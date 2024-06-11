using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Organizations;

public class OrganizationAddRequest
{
    [Required, MinLength(3), MaxLength(100)] public string Name { get; set; }
    [Required] public bool IsMpcaActive { get; set; }
    [Required] public bool IsWashActive { get; set; }
    [Required] public bool IsShelterActive { get; set; }
    public List<ActivityAddRequest> Activities { get; set; }
}