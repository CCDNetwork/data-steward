using Microsoft.AspNetCore.Http;

namespace Ccd.Server.Storage;

public class FileRequest
{
    public int StorageTypeId { get; set; }
    public IFormFile File { get; set; }
}
