using System;
using System.ComponentModel.DataAnnotations;
using Ccd.Server.Organizations;

namespace Ccd.Server.Users;

public class UserOrganization
{
    public int Id { get; set; }

    [Required]
    public Guid OrganizationId { get; set; }

    [Required]
    public Organization Organization { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public User User { get; set; }

    [Required]
    public string Role { get; set; }
}
