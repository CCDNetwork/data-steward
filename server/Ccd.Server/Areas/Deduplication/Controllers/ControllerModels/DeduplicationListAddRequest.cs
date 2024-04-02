using Microsoft.AspNetCore.Http;

namespace Ccd.Server.Deduplication;

public class DeduplicationListAddRequest
{
    public IFormFile File { get; set; }
}
