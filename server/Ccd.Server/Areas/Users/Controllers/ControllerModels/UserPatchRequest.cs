using System.Collections.Generic;
using Ccd.Server.Helpers;

namespace Ccd.Server.Areas.Users.Controllers.ControllerModels;

public class UserPatchRequest : PatchRequest
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Password { get; set; }
    public List<string> Permissions { get; set; }
}
