using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Ccd.Server.BeneficiaryAttributes;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
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

        beneficiaryResponse.Duplicates = await GetDuplicatesRecursive(organizationId, beneficiary.DuplicateOfId);

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

    private async Task<List<BeneficaryResponse>> GetDuplicatesRecursive(Guid organizationId, Guid? duplicateId)
    {
        var duplicates = new List<BeneficaryResponse>();

        while (duplicateId.HasValue)
        {
            var duplicate = await GetBeneficiary(organizationId, duplicateId.Value);
            if (duplicate == null)
            {
                break;
            }

            var duplicateResponse = _mapper.Map<BeneficaryResponse>(duplicate);
            duplicates.Add(duplicateResponse);

            duplicateId = duplicate.DuplicateOfId;
        }

        return duplicates;
    }
}
