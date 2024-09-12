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
    public async Task<ActionResult<SettingsResponse>> GetSettings()
    {
        var settings = await _settingsService.GetSettings() ?? throw new NotFoundException();
        return Ok(settings);
    }

    [HttpPut]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<SettingsResponse>> Update(
        [FromBody] SettingsUpdateRequest model
    )
    {
        var settings = await _settingsService.GetSettings() ?? throw new NotFoundException();

        _mapper.Map(model, settings);

        await _settingsService.UpdateSettings(settings);

        var result = await _settingsService.GetSettings();

        return Ok(result);
    }
}