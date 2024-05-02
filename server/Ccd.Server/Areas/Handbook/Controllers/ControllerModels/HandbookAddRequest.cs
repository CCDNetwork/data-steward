using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Handbooks;

public class HandbookAddRequest
{
    [Required, MinLength(3)]
    public string Title { get; set; }
    [Required, MinLength(1)]
    public string Content { get; set; }
}