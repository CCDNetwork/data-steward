using System;
using Ccd.Server.Helpers;

namespace Ccd.Server.Handbooks;

public class HandbookResponse
{
    public Guid Id { get; set; }
    [QuickSearchable]
    public string Title { get; set; }
    public string Content { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
