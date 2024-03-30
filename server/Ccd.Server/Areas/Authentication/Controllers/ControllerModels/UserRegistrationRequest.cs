using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Authentication;

public class UserRegistrationRequest
{
    [Required]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }

    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    [Required]
    public string OrganizationName { get; set; }
    
    [Required]
    public string Role { get; set; }
}
