using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Ccd.Server.BeneficiaryAttributes;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using Ccd.Server.Organizations;
using Ccd.Server.Users;
using Microsoft.EntityFrameworkCore;

namespace Ccd.Server.Beneficiaries;

public class BeneficaryService
{
    private readonly CcdContext _context;
    private readonly IMapper _mapper;

    public BeneficaryService(CcdContext context, IMapper mapper, BeneficiaryAttributeGroupService beneficiaryAttributeGroupService)
    {
        _context = context;
        _mapper = mapper;
    }

    private readonly string _selectSql =
    $@"SELECT DISTINCT ON (b.id)
                 b.*
            FROM
                 beneficary as b
            WHERE
                (@organizationId is null OR b.organization_id = @organizationId)";

    private object getSelectSqlParams(Guid? organizationId = null, Guid? id = null)
    {
        return new { id, organizationId };
    }

    public async Task<PagedApiResponse<BeneficaryResponse>> GetBeneficiariesApi(RequestParameters requestParameters, Guid organizationId, Guid? id = null)
    {
        return await PagedApiResponse<BeneficaryResponse>.GetFromSql(
            _context,
            _selectSql,
            getSelectSqlParams(organizationId, id),
            requestParameters
        );
    }

    public async Task<BeneficaryResponse> GetBeneficiaryApi(Guid organizationId, Guid id)
    {
        var beneficiary = await GetBeneficiary(organizationId, id);
        var beneficiaryResponse = _mapper.Map<BeneficaryResponse>(beneficiary);
        if (beneficiary.UploadedById != null)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == beneficiary.UploadedById);
            beneficiaryResponse.UploadedBy = _mapper.Map<UserResponse>(user);
        }

        beneficiaryResponse.Duplicates = await GetDuplicates(beneficiaryResponse);

        return beneficiaryResponse;
    }

    public async Task<Beneficary> GetBeneficiary(Guid organizationId, Guid id)
    {
        return await _context.Beneficaries.FirstOrDefaultAsync(b => b.OrganizationId == organizationId && b.Id == id) ?? throw new NotFoundException("Beneficiary not found.");
    }

    public async Task<BeneficaryResponse> PatchBeneficiaryStatus(Guid organizationId, Guid id, BeneficaryStatusPatchRequest model)
    {
        var beneficiary = await GetBeneficiary(organizationId, id);
        if (!BeneficaryStatus.IsValid(model.Status)) throw new BadRequestException("Invalid status.");
        beneficiary.Status = model.Status;
        await _context.SaveChangesAsync();

        return await GetBeneficiaryApi(organizationId, id);
    }

    public async Task DeleteBeneficiary(Guid organizationId, Guid id)
    {
        var beneficiary = await GetBeneficiary(organizationId, id);
        _context.Beneficaries.Remove(beneficiary);
        await _context.SaveChangesAsync();
    }

    private async Task<List<BeneficaryResponse>> GetDuplicates(BeneficaryResponse response)
    {
        var duplicates = new List<BeneficaryResponse>();

        foreach (var duplicateId in response.DuplicateOfIds)
        {
            var duplicate = await _context.Beneficaries.FirstOrDefaultAsync(b => b.Id == duplicateId);
            var duplicateResponse = _mapper.Map<BeneficaryResponse>(duplicate);

            var organization = await _context.Organizations.FirstOrDefaultAsync(o => o.Id == duplicate.OrganizationId);
            duplicateResponse.Organization = _mapper.Map<OrganizationResponse>(organization);

            if (duplicate.UploadedById != null)
            {
                var uploadedBy = await _context.Users.FirstOrDefaultAsync(u => u.Id == duplicate.UploadedById);
                duplicateResponse.UploadedBy = _mapper.Map<UserResponse>(uploadedBy);
            }

            var userOrganizations = await _context.UserOrganizations.Where(o => o.OrganizationId == duplicate.OrganizationId).ToListAsync();
            var pointOfContact = await _context.Users.Where(u => userOrganizations.Select(o => o.UserId).Contains(u.Id)).OrderBy(o => o.CreatedAt).FirstOrDefaultAsync();
            duplicateResponse.PointOfContact = _mapper.Map<UserResponse>(pointOfContact);

            duplicates.Add(duplicateResponse);
        }

        return duplicates;
    }
}
