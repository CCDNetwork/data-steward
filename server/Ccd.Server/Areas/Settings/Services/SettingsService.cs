using System.Threading.Tasks;
using AutoMapper;
using Ccd.Server.Data;
using Ccd.Server.Users;
using Microsoft.EntityFrameworkCore;

namespace Ccd.Server.Settings;

public class SettingsService
{
    private readonly CcdContext _context;
    private readonly IMapper _mapper;
    private readonly UserService _userService;


    public SettingsService(
        CcdContext context,
        IMapper mapper,
        UserService userService
    )
    {
        _context = context;
        _mapper = mapper;
        _userService = userService;
    }

    public async Task<Settings> GetSettingsApi()
    {
        return await _context.Settings.FirstAsync();
    }


    public async Task<Settings> UpdateSettingsApi(SettingsUpdateRequest model)
    {
        var settings = await _context.Settings.FirstAsync();

        _mapper.Map(model, settings);

        var updatedSettings = _context.Settings.Update(settings).Entity;

        await _context.SaveChangesAsync();

        return updatedSettings;
    }
}