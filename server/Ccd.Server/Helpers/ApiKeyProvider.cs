using System.Threading.Tasks;
using AspNetCore.Authentication.ApiKey;
using Ccd.Server.Data;

namespace Ccd.Server.Helpers;

public class ApiKeyProvider : IApiKeyProvider
{
    private readonly CcdContext _context;

    public ApiKeyProvider(CcdContext context)
    {
        _context = context;
    }

    public Task<IApiKey> ProvideAsync(string key)
    {
        throw new UnauthorizedException();
    }
}
