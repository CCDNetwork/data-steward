using System;
using System.ComponentModel.DataAnnotations;
using Ccd.Server.Helpers;
using Ccd.Server.Organizations;

namespace Ccd.Server.Handbooks;

public class Handbook
{
    public Guid Id { get; set; } = IdProvider.NewId();

    [Required]
    public string Title { get; set; }
    public string Content { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}