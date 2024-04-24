using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Ccd.Server.Deduplication;

public class DeduplicationListAddRequest
{
    [Required]
    public IFormFile File { get; set; }
    [Required]
    public string Type { get; set; }
    [Required]
    public Guid TemplateId { get; set; }
}
