using System;

namespace Ccd.Server.Deduplication.Controllers.ControllerModels;

public class DeduplicationListResponse
{
    public Guid Id { get; set; }
    public string FileName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
