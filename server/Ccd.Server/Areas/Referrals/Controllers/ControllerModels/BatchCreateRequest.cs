using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Ccd.Server.Referrals;

public class BatchCreateRequest
{
    [Required] public Guid OrganizationReferredToId { get; set; }
    [Required] public string ServiceCategory { get; set; }

    public List<Guid> SubactivitiesIds { get; set; }

    // MPCA service cat specific info
    public string DisplacementStatus { get; set; }
    public string HouseholdSize { get; set; }
    public string HouseholdMonthlyIncome { get; set; }
    public List<string> HouseholdsVulnerabilityCriteria { get; set; }

    [Required] public IFormFile File { get; set; }
}