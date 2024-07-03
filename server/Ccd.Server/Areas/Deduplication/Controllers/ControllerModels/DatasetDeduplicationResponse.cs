using System;
using Ccd.Server.Storage;
using Microsoft.AspNetCore.Http;

namespace Ccd.Server.Deduplication;

public class DatasetDeduplicationResponse
{
    public FileShortResponse File { get; set; }
    public Guid TemplateId { get; set; }
    public bool HasDuplicates { get; set; }
}
