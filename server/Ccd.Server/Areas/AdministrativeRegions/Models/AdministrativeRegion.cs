using System;
using Ccd.Server.Helpers;

namespace Ccd.Server.AdministrativeLevels;

public class AdministrativeRegion
{
    public Guid Id { get; set; } = IdProvider.NewId();
    public Guid? ParentId { get; set; }
    public int Level { get; set; }
    public string Name { get; set; }
    public string? Code { get; set; }
}