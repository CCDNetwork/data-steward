using System.Collections.Generic;
using Ccd.Server.Organizations;
using Ccd.Server.Users;

namespace Ccd.Server.Authentication;

public class UserAuthenticationResponse
{
    public string Token { get; set; }
    public UserResponse User { get; set; }
    public List<OrganizationUserResponse> Organizations { get; set; } = new List<OrganizationUserResponse>();

    public UserAuthenticationResponse() { }

    public UserAuthenticationResponse(
        string token,
        UserResponse user,
        List<OrganizationUserResponse> organizations
    )
    {
        Token = token;
        User = user;
        Organizations = organizations;
    }
}
