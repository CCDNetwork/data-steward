using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using Ccd.Server.Organizations;
using Ccd.Server.Users;

namespace Ccd.Server.Deduplication;

public class List
{
    public Guid Id { get; set; } = IdProvider.NewId();
    public Guid OrganizationId { get; set; }
    public Organization Organization { get; set; }
    public string FileName { get; set; }
    public int Duplicates { get; set; }

    [ForeignKey("User")]
    public Guid? UserCreatedId { get; set; }
    public User UserCreated { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
