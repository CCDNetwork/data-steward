using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Users;

public class UserUpdateRequest
{
    public string Password { get; set; }

    [Required] public string FirstName { get; set; }

    [Required] public string LastName { get; set; }

    public string Role { get; set; }
    
    [Required] public string Language { get; set; } = "en";
}
