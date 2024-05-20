using System;
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
    private readonly BeneficiaryAttributeGroupService _beneficiaryAttributeGroupService;

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
        return _mapper.Map<BeneficaryResponse>(beneficiary);
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
}
