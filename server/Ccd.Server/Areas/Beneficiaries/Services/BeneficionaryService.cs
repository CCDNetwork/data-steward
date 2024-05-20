using System;
using System.Threading.Tasks;
using AutoMapper;
using Ccd.Server.BeneficiaryAttributes;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using Microsoft.EntityFrameworkCore;

namespace Ccd.Server.Beneficiaries;

public class BeneficionaryService
{
    private readonly CcdContext _context;
    private readonly IMapper _mapper;
    private readonly BeneficiaryAttributeGroupService _beneficiaryAttributeGroupService;

    public BeneficionaryService(CcdContext context, IMapper mapper, BeneficiaryAttributeGroupService beneficiaryAttributeGroupService)
    {
        _context = context;
        _mapper = mapper;
    }

    private readonly string _selectSql =
    $@"SELECT DISTINCT ON (b.id)
                 b.*
            FROM
                 beneficionary as b
            WHERE
                (@organizationId is null OR b.organization_id = @organizationId)";

    private object getSelectSqlParams(Guid? organizationId = null, Guid? id = null)
    {
        return new { id, organizationId };
    }

    public async Task<PagedApiResponse<BeneficionaryResponse>> GetBeneficiariesApi(RequestParameters requestParameters, Guid organizationId, Guid? id = null)
    {
        return await PagedApiResponse<BeneficionaryResponse>.GetFromSql(
            _context,
            _selectSql,
            getSelectSqlParams(organizationId, id),
            requestParameters
        );
    }

    public async Task<BeneficionaryResponse> GetBeneficiaryApi(Guid organizationId, Guid id)
    {
        var beneficiary = await GetBeneficiary(organizationId, id);
        return _mapper.Map<BeneficionaryResponse>(beneficiary);
    }

    public async Task<Beneficionary> GetBeneficiary(Guid organizationId, Guid id)
    {
        return await _context.Beneficionary.FirstOrDefaultAsync(b => b.OrganizationId == organizationId && b.Id == id) ?? throw new NotFoundException("Beneficiary not found.");
    }

    public async Task<BeneficionaryResponse> PatchBeneficiaryStatus(Guid organizationId, Guid id, BeneficionaryStatusPatchRequest model)
    {
        var beneficiary = await GetBeneficiary(organizationId, id);
        if (!BeneficionaryStatus.IsValid(model.Status)) throw new BadRequestException("Invalid status.");
        beneficiary.Status = model.Status;
        await _context.SaveChangesAsync();

        return await GetBeneficiaryApi(organizationId, id);
    }

    public async Task DeleteBeneficiary(Guid organizationId, Guid id)
    {
        var beneficiary = await GetBeneficiary(organizationId, id);
        _context.Beneficionary.Remove(beneficiary);
        await _context.SaveChangesAsync();
    }
}
