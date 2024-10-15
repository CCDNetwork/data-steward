using System;
using System.Threading.Tasks;
using AutoMapper;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using Microsoft.EntityFrameworkCore;

namespace Ccd.Server.AdministrativeRegions;

public class AdministrativeRegionService
{
    private readonly CcdContext _context;
    private readonly IMapper _mapper;

    private readonly string _selectSql =
        @"
            SELECT * FROM 
                administrative_region 
            WHERE 
                level = @level 
            AND (@parentId IS NULL OR parent_id = @parentId) 
            AND (@id IS NULL OR id = @id) 
            AND (@searchText IS NULL OR name ilike @searchText || '%')";


    public AdministrativeRegionService(
        CcdContext context,
        IMapper mapper
    )
    {
        _context = context;
        _mapper = mapper;
    }

    private object getSelectSqlParams(int level, Guid? parentId = null, Guid? id = null, string? searchText = null)
    {
        return new { level, parentId, id, searchText };
    }

    public async Task<PagedApiResponse<AdministrativeRegionResponse>> GetAdministrativeRegionsApi(
        int level,
        Guid? parentId,
        Guid? id,
        string? searchText,
        RequestParameters requestParameters
    )
    {
        return await PagedApiResponse<AdministrativeRegionResponse>.GetFromSql(
            _context,
            _selectSql,
            getSelectSqlParams(
                level,
                parentId,
                id,
                searchText
            ),
            requestParameters,
            resolveDependencies
        );
    }

    public async Task<AdministrativeRegionResponse> GetAdministrativeRegionApi(Guid id)
    {
        var ar = await _context.AdministrativeRegions.FirstOrDefaultAsync(e => e.Id == id);
        var arResponse = _mapper.Map<AdministrativeRegionResponse>(ar);

        return arResponse;
    }

    public async Task<Guid?> GetAdministrativeRegionByNameApi(string name, int level)
    {
        var ar = await _context.AdministrativeRegions.FirstOrDefaultAsync(e =>
            e.Name.ToLower() == name.ToLower() && e.Level == level);

        return ar?.Id;
    }

    private async Task resolveDependencies(AdministrativeRegionResponse adminRegion)
    {
        if (adminRegion.ParentId.HasValue)
        {
            var parentRegion = await GetAdministrativeRegionApi(adminRegion.ParentId.Value);

            adminRegion.Path = await BuildRegionPath(parentRegion);
        }
    }

    private async Task<string> BuildRegionPath(AdministrativeRegionResponse region)
    {
        if (region.ParentId == null) return region.Name;

        var parentRegion = await GetAdministrativeRegionApi(region.ParentId.Value);
        var parentPath = await BuildRegionPath(parentRegion);

        return $"{parentPath} > {region.Name}";
    }
}