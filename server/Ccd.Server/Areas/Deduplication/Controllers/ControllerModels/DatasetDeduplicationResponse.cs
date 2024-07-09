using System;
using Ccd.Server.Storage;

namespace Ccd.Server.Deduplication;

public class DatasetDeduplicationResponse
{
    public FileShortResponse File { get; set; }
    public Guid TemplateId { get; set; }
    public int Duplicates { get; set; }
}
