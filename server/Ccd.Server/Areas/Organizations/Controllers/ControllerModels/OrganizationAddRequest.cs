using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Organizations;

public class OrganizationAddRequest
{
    [Required, MinLength(3), MaxLength(100)]
    public string Name { get; set; }
}