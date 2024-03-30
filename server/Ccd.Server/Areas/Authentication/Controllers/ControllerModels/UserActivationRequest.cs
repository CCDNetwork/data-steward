using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Authentication;

public class UserActivationRequest
{
    [Required] public string Email { get; set; }
    [Required] public string ActivationCode { get; set; }
}
