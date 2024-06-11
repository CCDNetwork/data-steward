using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using Ccd.Server.Users;
using Ccd.Server.Organizations;
using System.Linq;
using Ccd.Server.Storage;
using System.Collections.Generic;

namespace Ccd.Server.Referrals;

public class ReferralService
{
    private readonly IMapper _mapper;
    private readonly CcdContext _context;
    private readonly IStorageService _storageService;

    private readonly string _selectSql =
        $@"
             SELECT DISTINCT ON (r.id)
                 r.*
             FROM
                 referral r
             WHERE
                (CASE
                    WHEN @received THEN organization_referred_to_id = @organizationId
                    ELSE organization_created_id = @organizationId
                END)
                AND (@id is null OR r.id = @id)";

    private object getSelectSqlParams(Guid? id = null, Guid? organizationId = null, bool received = false)
    {
        return new { id, organizationId, received };
    }

    public ReferralService(
        IMapper mapper,
        CcdContext context,
        IStorageService storageService
    )
    {
        _mapper = mapper;
        _context = context;
        _storageService = storageService;
    }

    public async Task<PagedApiResponse<ReferralResponse>> GetReferralsApi(Guid organizationId, RequestParameters requestParameters = null, bool received = false)
    {
        return await PagedApiResponse<ReferralResponse>.GetFromSql(
            _context,
            _selectSql,
            getSelectSqlParams(
                organizationId: organizationId,
                received: received
            ),
            requestParameters,
            resolveDependencies
        );
    }

    public async Task<ReferralResponse> GetReferralApi(Guid organizationId, Guid id)
    {
        var referral = await GetReferralById(organizationId, id) ?? throw new NotFoundException("Referral not found.");
        var referralResponse = _mapper.Map<ReferralResponse>(referral);

        if (referral != null)
            await resolveDependencies(referralResponse);

        return referralResponse;
    }

    public async Task<Referral> GetReferralById(Guid organizationId, Guid id)
    {
        return await _context.Referrals.Where(e =>
            (e.OrganizationCreatedId == organizationId) ||
            (e.OrganizationReferredToId == organizationId)).FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<Referral> AddReferral(Guid organizationId, ReferralAddRequest model)
    {
        var referredOrganization = await _context.Organizations.FirstOrDefaultAsync(e => e.Id == model.OrganizationReferredToId) ?? throw new NotFoundException("Organization not found.");
        var referral = _mapper.Map<Referral>(model);
        referral.OrganizationCreatedId = organizationId;
        referral.Status = ReferralStatus.Open;

        var newReferral = _context.Referrals.Add(referral).Entity;
        await _context.SaveChangesAsync();

        return newReferral;
    }

    public async Task<Referral> UpdateReferral(Referral referral)
    {
        var updatedReferral = _context.Referrals.Update(referral).Entity;
        await _context.SaveChangesAsync();

        return updatedReferral;
    }

    public async Task DeleteReferral(Referral referral)
    {
        _context.Referrals.Remove(referral);
        await _context.SaveChangesAsync();
    }

    private async Task resolveDependencies(ReferralResponse referral)
    {
        var organizationReffereTo = await _context.Organizations.FirstOrDefaultAsync(e => e.Id == referral.OrganizationReferredToId);
        var organizationCreated = await _context.Organizations.FirstOrDefaultAsync(e => e.Id == referral.OrganizationCreatedId);
        var userCreated = await _context.Users.FirstOrDefaultAsync(e => e.Id == referral.UserCreatedId);
        referral.OrganizationReferredTo = _mapper.Map<OrganizationResponse>(organizationReffereTo);
        referral.OrganizationCreated = _mapper.Map<OrganizationResponse>(organizationCreated);
        referral.UserCreated = _mapper.Map<UserResponse>(userCreated);

        if (referral.FocalPointId != null)
        {
            var userFocalPoint = await _context.Users.FirstOrDefaultAsync(e => e.Id == referral.FocalPointId);
            referral.FocalPoint = _mapper.Map<UserResponse>(userFocalPoint);
        }

        if (referral.FileIds != null && referral.FileIds.Count > 0)
        {
            referral.Files = await _storageService.GetFilesApiById(referral.FileIds);
        }

    }
}
