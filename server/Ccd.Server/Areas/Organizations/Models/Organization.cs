using System;
using System.ComponentModel.DataAnnotations;
using Ccd.Server.Helpers;

namespace Ccd.Server.Organizations;

public class Organization
{
    public Guid Id { get; set; } = IdProvider.NewId();

    [Required, QuickSearchable]
    public string Name { get; set; }
    public bool IsMpcaActive { get; set; }
    public bool IsWashActive { get; set; }
    public bool IsShelterActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}