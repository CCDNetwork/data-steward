using System;
using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Beneficiaries;

public class BeneficaryStatusPatchRequest
{
    [Required, MinLength(1)] public string Status { get; set; }
}
