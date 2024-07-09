using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Deduplication;

public class SystemOrganizationsDeduplicationRequest
{
    [Required] public Guid FileId { get; set; }
    [Required] public Guid TemplateId { get; set; }
    [Required] public List<Guid> KeepDuplicatesIds { get; set; }
}
