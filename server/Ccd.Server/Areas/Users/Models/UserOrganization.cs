using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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

    [Required, Column(TypeName = "jsonb")]
    public List<string> Permissions { get; set; }
}
