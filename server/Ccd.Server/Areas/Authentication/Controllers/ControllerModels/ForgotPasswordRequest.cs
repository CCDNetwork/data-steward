using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Authentication;

public class ForgotPasswordRequest
{
    [Required] public string Email { get; set; }
}
