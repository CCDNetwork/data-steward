using System;
using Ccd.Server.Helpers;

namespace Ccd.Server.Organizations;

public class OrganizationResponse
{
    public Guid Id { get; set; }

    [QuickSearchable]
    public string Name { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
