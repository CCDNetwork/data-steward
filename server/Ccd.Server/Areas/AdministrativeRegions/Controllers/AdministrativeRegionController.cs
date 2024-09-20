using System;
using System.Threading.Tasks;
using Ccd.Server.Helpers;
using Ccd.Server.Users;
using Microsoft.AspNetCore.Mvc;

namespace Ccd.Server.AdministrativeRegions;

[ApiController]
[Route("/api/v1/admin-regions")]
public class AdministrativeRegionController : ControllerBaseExtended
{
    private readonly AdministrativeRegionService _administrativeRegionService;

    public AdministrativeRegionController(
        AdministrativeRegionService administrativeRegionService
    )
    {
        _administrativeRegionService = administrativeRegionService;
    }

    [HttpGet]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<PagedApiResponse<AdministrativeRegionResponse>>> GetAll(
        [FromQuery] int level,
        [FromQuery] Guid? parentId,
        [FromQuery] Guid? id,
        [FromQuery] string? searchText,
        [FromQuery] RequestParameters requestParameters
    )
    {
        if (level < 1 || level > 4) throw new BadRequestException("The 'level' parameter must be between 1 and 4.");

        var administrativeRegions =
            await _administrativeRegionService.GetAdministrativeRegionsApi(level, parentId, id, searchText,
                requestParameters);
        return Ok(administrativeRegions);
    }

    [HttpGet("{id}")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<AdministrativeRegionResponse>> GetAdministrativeRegion(Guid id
    )
    {
        var administrativeRegion = await _administrativeRegionService.GetAdministrativeRegionApi(id);

        if (administrativeRegion == null)
            throw new NotFoundException();

        return Ok(administrativeRegion);
    }
}