using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Ccd.Server.Deduplication;

public class SameOrganizationDeduplicationRequest
{
    [Required] public Guid FileId { get; set; }
    [Required] public Guid TemplateId { get; set; }
}
