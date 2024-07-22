using System.ComponentModel.DataAnnotations;
using Ccd.Server.Helpers;

namespace Ccd.Server.Users;

public class UserUpdateMeRequest : PatchRequest
{
    public string Password { get; set; }

    [Required] public string FirstName { get; set; }

    [Required] public string LastName { get; set; }
}
