using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Users;

public class UserAddRequest
{
    [Required]
    public string Email { get; set; }

    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }


    [Required]
    public string Password { get; set; }

    [Required]
    public Guid OrganizationId { get; set; }

    public List<string> Permissions { get; set; }
}
