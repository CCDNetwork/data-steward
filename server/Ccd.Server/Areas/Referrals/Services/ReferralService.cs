﻿using System;
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
    private readonly UserService _userService;

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
        IStorageService storageService,
        UserService userService
    )
    {
        _mapper = mapper;
        _context = context;
        _storageService = storageService;
        _userService = userService;
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

    public async Task<ReferralCaseNumberResponse> GetReferralByCaseNumberApi(string caseNumber)
    {
        var refferal = await _context.Referrals.FirstOrDefaultAsync(e => e.CaseNumber == caseNumber) ?? throw new NotFoundException("Referral not found.");
        var referralResponse = _mapper.Map<ReferralCaseNumberResponse>(refferal);
        var organizationReffereTo = await _context.Organizations.FirstOrDefaultAsync(e => e.Id == referralResponse.OrganizationReferredToId);
        var organizationCreated = await _context.Organizations.FirstOrDefaultAsync(e => e.Id == referralResponse.OrganizationCreatedId);
        referralResponse.OrganizationReferredTo = _mapper.Map<OrganizationResponse>(organizationReffereTo);
        referralResponse.OrganizationCreated = _mapper.Map<OrganizationResponse>(organizationCreated);

        return referralResponse;
    }

    public async Task<Referral> AddReferral(Guid organizationId, ReferralAddRequest model)
    {
        var referredOrganization = await _context.Organizations.FirstOrDefaultAsync(e => e.Id == model.OrganizationReferredToId) ?? throw new NotFoundException("Organization not found.");
        var referral = _mapper.Map<Referral>(model);
        referral.OrganizationCreatedId = organizationId;
        referral.CaseNumber = GuidHelper.ToShortString(Guid.NewGuid());
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
        _context.Discussions.RemoveRange(_context.Discussions.Where(e => e.ReferralId == referral.Id));
        _context.Referrals.Remove(referral);
        await _context.SaveChangesAsync();
    }

    public async Task<Discussion> AddDiscussion(Guid referralId, DiscussionAddRequest model)
    {
        var referral = await _context.Referrals.FirstOrDefaultAsync(e => e.Id == referralId) ?? throw new NotFoundException("Referral not found.");
        var discussion = _mapper.Map<Discussion>(model);
        discussion.ReferralId = referralId;

        var newDiscussion = _context.Discussions.Add(discussion).Entity;
        await _context.SaveChangesAsync();

        return newDiscussion;
    }

    public async Task<Discussion> AddDiscussionBot(Guid referralId, DiscussionAddRequest model)
    {
        var referral = await _context.Referrals.FirstOrDefaultAsync(e => e.Id == referralId) ?? throw new NotFoundException("Referral not found.");
        var discussion = _mapper.Map<Discussion>(model);
        discussion.ReferralId = referralId;
        discussion.IsBot = true;

        var newDiscussion = _context.Discussions.Add(discussion).Entity;
        await _context.SaveChangesAsync();

        return newDiscussion;
    }

    public async Task<DiscussionResponse> GetDiscussionApi(Guid id)
    {
        var discussion = await _context.Discussions.FirstOrDefaultAsync(e => e.Id == id) ?? throw new NotFoundException("Discussion not found.");
        var discussionResponse = _mapper.Map<DiscussionResponse>(discussion);
        var userResponse = await _userService.GetUserApi(id: discussion.UserCreatedId);
        userResponse.Permissions = null;
        discussionResponse.UserCreated = userResponse;

        return discussionResponse;
    }

    public async Task<List<DiscussionResponse>> GetDiscussionsApi(Guid referralId)
    {
        var referral = await _context.Referrals.FirstOrDefaultAsync(e => e.Id == referralId) ?? throw new NotFoundException("Referral not found.");
        var discussions = await _context.Discussions.Where(e => e.ReferralId == referralId).ToListAsync();
        var discussionsResponse = _mapper.Map<List<DiscussionResponse>>(discussions);
        for (int i = 0; i < discussionsResponse.Count; i++)
        {
            var userResponse = await _userService.GetUserApi(id: discussions[i].UserCreatedId);
            userResponse.Permissions = null;
            discussionsResponse[i].UserCreated = userResponse;
        }

        return discussionsResponse;
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
