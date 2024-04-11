using System;
using Ccd.Server.Helpers;
using Ccd.Server.Organizations;

namespace Ccd.Server.Deduplication;

public class List
{
    public Guid Id { get; set; } = IdProvider.NewId();
    public Guid OrganizationId { get; set; }
    public Organization Organization { get; set; }
    public string FileName { get; set; }
}
