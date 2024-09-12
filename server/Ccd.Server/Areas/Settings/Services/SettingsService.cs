using System.Threading.Tasks;
using Ccd.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace Ccd.Server.Settings;

public class SettingsService
{
    private readonly CcdContext _context;


    public SettingsService(
        CcdContext context
    )
    {
        _context = context;
    }

    public async Task<Settings> GetSettings()
    {
        return await _context.Settings.SingleOrDefaultAsync();
    }


    public async Task<Settings> UpdateSettings(Settings settings)
    {
        var updatedSettings = _context.Settings.Update(settings).Entity;
        await _context.SaveChangesAsync();

        return updatedSettings;
    }
}