using System;
using System.Collections.Generic;
using Ccd.Server.Storage;

namespace Ccd.Server.Deduplication;

public class SameOrganizationDeduplicationResponse
{
    public FileShortResponse File { get; set; }
    public Guid TemplateId { get; set; }
    public int TotalRecords { get; set; }
    public int IdenticalRecords { get; set; }
    public int PotentialDuplicateRecords { get; set; }
}
