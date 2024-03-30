using System;
using System.Linq;
using System.Security.Claims;
using Ccd.Server.Helpers;
using Ccd.Server.Users;
using Microsoft.AspNetCore.Http;

namespace Ccd.Server.Data;

/// <summary>
/// This is used for tracking user changes in database
/// </summary>
public class DbUserTrackingService
{
    private readonly IHttpContextAccessor _httpContext;

    public DbUserTrackingService(IHttpContextAccessor httpContext)
    {
        _httpContext = httpContext;
    }

    public Guid GetCurrentUserId(Guid? fallbackUserId = null)
    {
        // for members we're always returning the system user id (1)

        if (_httpContext == null || _httpContext.HttpContext == null)
        {
            if (fallbackUserId.HasValue)
                return fallbackUserId.Value;

            throw new UnauthorizedException("Can't find logged in user");
        }

        if (_httpContext.HttpContext.User?.Claims == null || !(_httpContext.HttpContext.User?.Claims).Any())
            return User.SYSTEM_USER.Id;

        var userIdClaim =
            _httpContext.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        var groupClaim = _httpContext.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.GroupSid);
        var authenticationMethod =
            _httpContext.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.AuthenticationMethod);

        if (userIdClaim?.Value == null || groupClaim?.Value == "members" || authenticationMethod?.Value == "apiKey")
            return User.SYSTEM_USER.Id;

        if (!Guid.TryParse(userIdClaim.Value, out var userId))
        {
            throw new UnauthorizedException("Error parsing logged in user");
        }

        return userId;
    }
}
