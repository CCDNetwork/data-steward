using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Ccd.Server.Data;
using Ccd.Server.Email;
using Ccd.Server.Helpers;
using Ccd.Server.Organizations;

namespace Ccd.Server.FieldSettings;

public class FieldSettingsService
{
    private readonly CcdContext _context;
    private readonly IMapper _mapper;

    public FieldSettingsService(CcdContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<FieldSetting>> GetFieldSettings()
    {
        var fieldSettings = await _context.FieldSettings.ToListAsync();
        return fieldSettings;
    }

    public async Task<FieldSetting> GetFieldSetting(int id)
    {
        var fieldSetting = await _context.FieldSettings.FirstOrDefaultAsync(x => x.Id == id);
        return fieldSetting;
    }

    public async Task<FieldSetting> PatchFieldSetting(int id, FieldSettingPatchRequest model)
    {
        var fieldSetting = await GetFieldSetting(id) ?? throw new Exception("Field setting not found");
        fieldSetting.UsedForDeduplication = model.UsedForDeduplication;

        var newFieldSetting = _context.Update(fieldSetting).Entity;
        await _context.SaveChangesAsync();

        return newFieldSetting;
    }

}