using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Users;

public class UserUpdateMeRequest
{
    public string Password { get; set; }

    [Required] public string FirstName { get; set; }

    [Required] public string LastName { get; set; }
}
