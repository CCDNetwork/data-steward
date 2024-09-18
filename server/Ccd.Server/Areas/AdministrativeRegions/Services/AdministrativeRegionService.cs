using System;
using System.Threading.Tasks;
using Ccd.Server.Data;
using Ccd.Server.Helpers;

namespace Ccd.Server.AdministrativeRegions;

public class AdministrativeRegionService
{
    private readonly CcdContext _context;

    private readonly string _selectSql =
        @"
            SELECT * FROM 
                administrative_region 
            WHERE 
                level = @level 
            AND (@parentId IS NULL OR parent_id = @parentId) 
            AND (@searchText IS NULL OR name ilike @searchText || '%')";


    public AdministrativeRegionService(
        CcdContext context
    )
    {
        _context = context;
    }

    private object getSelectSqlParams(int level, Guid? parentId = null, string? searchText = null)
    {
        return new { level, parentId, searchText };
    }

    public async Task<PagedApiResponse<AdministrativeRegionResponse>> GetAdministrativeRegionsApi(
        int level,
        Guid? parentId,
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
                searchText
            ),
            requestParameters
        );
    }
}