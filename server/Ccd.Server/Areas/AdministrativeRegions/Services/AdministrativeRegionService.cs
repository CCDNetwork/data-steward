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
            AND (@searchText IS NULL OR name ilike @searchText || '%')";


    public AdministrativeRegionService(
        CcdContext context,
        IMapper mapper
    )
    {
        _context = context;
        _mapper = mapper;
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

    public async Task<AdministrativeRegionResponse> GetAdministrativeRegionApi(Guid id)
    {
        var ar = await _context.AdministrativeRegions.FirstOrDefaultAsync(e => e.Id == id);
        var arResponse = _mapper.Map<AdministrativeRegionResponse>(ar);

        return arResponse;
    }
}