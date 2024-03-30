using System;

namespace Ccd.Server.Storage;

public class FileResponse
{
    public Guid Id { get; set; }
    public int StorageTypeId { get; set; }
    public string Name { get; set; }
    public string Url { get; set; }
}
