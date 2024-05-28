using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ccd.Server.Data;
using System.Linq;
using Ccd.Server.Helpers;

namespace Ccd.Server.BeneficiaryAttributes;

public class BeneficiaryAttributeGroupService
{
    private readonly CcdContext _context;
    private readonly IMapper _mapper;


    private readonly string _selectSql =
        $@"SELECT DISTINCT ON (bag.id)
                    bag.*
                FROM
                    beneficiary_attribute_group as bag
                WHERE
                    (@id is null OR bag.id = @id)";

    public BeneficiaryAttributeGroupService(CcdContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    private object getSelectSqlParams(Guid? id = null)
    {
        return new { id };
    }

    private async Task resolveDependencies(BeneficiaryAttributeGroupResponse listing)
    {
        listing.BeneficiaryAttributes = await _context.BaBags
            .Where(bag => bag.BeneficiaryAttributeGroupId == listing.Id)
            .Include(bag => bag.BeneficiaryAttribute)
            .Select(bag => _mapper.Map<BeneficiaryAttributeResponse>(bag.BeneficiaryAttribute))
            .ToListAsync();
    }

    public async Task<PagedApiResponse<BeneficiaryAttributeGroupResponse>> GetBeneficiaryAttributeGroupsApi(RequestParameters requestParameters)
    {
        requestParameters.SortBy ??= "\"order\"";
        return await PagedApiResponse<BeneficiaryAttributeGroupResponse>.GetFromSql(
            _context,
            _selectSql,
            getSelectSqlParams(),
            requestParameters,
            resolveDependencies
        );
    }

    public async Task<BeneficiaryAttributeGroupResponse> GetBeneficiaryAttributeGroupApi(Guid baGroupId)
    {
        var baGroup = await _context.BeneficiaryAttributeGroups
             .Where(bag => bag.Id == baGroupId)
             .FirstOrDefaultAsync() ?? throw new NotFoundException("Beneficiary Attribute Group not found.");

        var response = _mapper.Map<BeneficiaryAttributeGroupResponse>(baGroup);
        response.BeneficiaryAttributes = await _context.BaBags
            .Where(bag => bag.BeneficiaryAttributeGroupId == response.Id)
            .Include(bag => bag.BeneficiaryAttribute)
            .Select(bag => _mapper.Map<BeneficiaryAttributeResponse>(bag.BeneficiaryAttribute))
            .ToListAsync();

        return response;
    }

    public async Task<BeneficiaryAttributeGroupResponse> CreateBeneficiaryAttributeGroups(BeneficiaryAttributeGroupCreateRequest model)
    {
        var baGroup = _mapper.Map<BeneficiaryAttributeGroup>(model);
        baGroup.Order = await _context.BeneficiaryAttributeGroups
            .OrderByDescending(bag => bag.Order)
            .Select(bag => bag.Order)
            .FirstOrDefaultAsync() + 1;

        _context.BeneficiaryAttributeGroups.Add(baGroup);

        model.BeneficiaryAttributeIds.ForEach(baId =>
        {
            var baBag = new BaBag
            {
                BeneficiaryAttributeId = baId,
                BeneficiaryAttributeGroupId = baGroup.Id,
            };

            _context.BaBags.Add(baBag);
        });

        await _context.SaveChangesAsync();

        return await GetBeneficiaryAttributeGroupApi(baGroup.Id);
    }

    public async Task<BeneficiaryAttributeGroupResponse> PatchBeneficiaryAttributeGroups(Guid baGroupId, BeneficiaryAttributeGroupPatchRequest model)
    {
        var baGroup = await _context.BeneficiaryAttributeGroups
            .Where(bag => bag.Id == baGroupId)
            .FirstOrDefaultAsync() ?? throw new NotFoundException("Beneficiary Attribute Group not found.");

        model.Patch(baGroup);

        if (model.BeneficiaryAttributeIds != null && model.BeneficiaryAttributeIds.Count > 0)
        {
            var existingBaBags = await _context.BaBags
                .Where(bag => bag.BeneficiaryAttributeGroupId == baGroup.Id)
                .ToListAsync();

            foreach (var baBag in existingBaBags)
            {
                _context.BaBags.Remove(baBag);
            }

            foreach (var baId in model.BeneficiaryAttributeIds)
            {
                var baBag = new BaBag
                {
                    BeneficiaryAttributeId = baId,
                    BeneficiaryAttributeGroupId = baGroup.Id,
                };

                _context.BaBags.Add(baBag);
            }
        }

        _context.BeneficiaryAttributeGroups.Update(baGroup);

        await _context.SaveChangesAsync();

        return await GetBeneficiaryAttributeGroupApi(baGroup.Id);
    }

    public async Task DeleteBeneficiaryAttributeGroup(Guid baGroupId)
    {
        var baGroup = await _context.BeneficiaryAttributeGroups
            .Where(bag => bag.Id == baGroupId)
            .FirstOrDefaultAsync() ?? throw new NotFoundException("Beneficiary Attribute Group not found.");

        _context.BaBags.RemoveRange(_context.BaBags.Where(bag => bag.BeneficiaryAttributeGroupId == baGroup.Id));
        _context.BeneficiaryAttributeGroups.Remove(baGroup);

        // Update order of remaining groups
        var remainingGroups = await _context.BeneficiaryAttributeGroups
            .Where(bag => bag.Order > baGroup.Order)
            .ToListAsync();

        foreach (var group in remainingGroups)
        {
            group.Order--;
            _context.BeneficiaryAttributeGroups.Update(group);
        }

        await _context.SaveChangesAsync();
    }

    public async Task<PagedApiResponse<BeneficiaryAttributeGroupResponse>> ReorderBeneficiaryAttributeGroups(BeneficiaryAttributeGroupReorderRequest model)
    {
        var baGroups = await _context.BeneficiaryAttributeGroups
            .ToListAsync();

        foreach (var pair in model.NewOrderList)
        {
            var baGroup = baGroups.FirstOrDefault(bag => bag.Id == pair.Id) ?? throw new NotFoundException("Beneficiary Attribute Group not found.");
            baGroup.Order = pair.Order;
            _context.BeneficiaryAttributeGroups.Update(baGroup);
        }

        await _context.SaveChangesAsync();

        return await GetBeneficiaryAttributeGroupsApi(new RequestParameters() { PageSize = 1000 });
    }
}