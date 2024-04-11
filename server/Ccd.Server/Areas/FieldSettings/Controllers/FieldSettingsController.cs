using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Helpers;
using System;
using Ccd.Server.Users;

namespace Ccd.Server.FieldSettings;

[ApiController]
[Route("/api/v1/field-settings")]
public class FieldSettingsController : ControllerBaseExtended
{
    private readonly IMapper _mapper;
    private readonly FieldSettingsService _fieldSettingsService;

    public FieldSettingsController(IMapper mapper, FieldSettingsService fieldSettingsService)
    {
        _mapper = mapper;
        _fieldSettingsService = fieldSettingsService;
    }

    [HttpGet]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<List<FieldSettingResponse>>> GetFieldSettings()
    {
        Console.WriteLine("FieldSettingsController.GetFieldSettings");
        var fieldSettings = await _fieldSettingsService.GetFieldSettings();
        var response = _mapper.Map<List<FieldSettingResponse>>(fieldSettings);
        return Ok(response);
    }

    [HttpPatch("{id}")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<FieldSettingResponse>> UpdateFieldSettings(int id, FieldSettingPatchRequest model)
    {
        var fieldSetting = await _fieldSettingsService.PatchFieldSetting(id, model);
        var response = _mapper.Map<FieldSettingResponse>(fieldSetting);
        return Ok(response);
    }
}
