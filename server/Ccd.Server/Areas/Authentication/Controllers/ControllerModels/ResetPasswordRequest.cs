using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Authentication;

public class ResetPasswordRequest
{
    [Required] public string Email { get; set; }
    [Required] public string PasswordResetCode { get; set; }
    [Required] public string Password { get; set; }
}
