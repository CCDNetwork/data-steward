using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Authentication;

public class UserLoginRequest
{
    [Required] public string Username { get; set; }
    [Required] public string Password { get; set; }
}
