using System;

namespace Ccd.Server.AdministrativeRegions;

public class AdministrativeRegionResponse
{
    public Guid Id { get; set; }
    public Guid? ParentId { get; set; }
    public int Level { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public string Path { get; set; }
}