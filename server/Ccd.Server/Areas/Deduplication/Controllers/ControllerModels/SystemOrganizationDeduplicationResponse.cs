using System;
using System.Collections.Generic;
using Ccd.Server.Storage;

namespace Ccd.Server.Deduplication;

public class SystemOrganizationDeduplicationResponse
{
    public FileShortResponse File { get; set; }
    public Guid TemplateId { get; set; }
    public int Duplicates { get; set; }
    public List<BeneficaryDeduplication> DuplicateBeneficiaries { get; set; }
    public List<string> RuleFields { get; set; }

}
