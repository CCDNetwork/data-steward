using System;

namespace Ccd.Server.Storage;

public class FileShortResponse
{
    public Guid Id { get; set; }
    public string Url { get; set; }
    public string Name { get; set; }
}
