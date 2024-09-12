using System.Threading.Tasks;
using AutoMapper;
using Ccd.Server.Helpers;
using Ccd.Server.Users;
using Microsoft.AspNetCore.Mvc;

namespace Ccd.Server.Settings;

[ApiController]
[Route("/api/v1/settings")]
public class SettingsController : ControllerBaseExtended
{
    private readonly IMapper _mapper;
    private readonly SettingsService _settingsService;


    public SettingsController(SettingsService settingsService, IMapper mapper)
    {
        _settingsService = settingsService;
        _mapper = mapper;
    }

    [HttpGet]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<SettingsResponse>> GetSettings()
    {
        var settings = await _settingsService.GetSettingsApi() ?? throw new NotFoundException();
        return Ok(settings);
    }

    [HttpPut]
    public async Task<ActionResult<SettingsResponse>> Update(
        [FromBody] SettingsUpdateRequest model
    )
    {
        // check that user is superadmin
        if(this.UserId != Ccd.Server.Users.User.SYSTEM_USER.Id)
        {
            throw new UnauthorizedException("Only superadmin can change settings");
        }
        
        await _settingsService.UpdateSettingsApi(model);

        var result = await _settingsService.GetSettingsApi();

        return Ok(result);
    }
}