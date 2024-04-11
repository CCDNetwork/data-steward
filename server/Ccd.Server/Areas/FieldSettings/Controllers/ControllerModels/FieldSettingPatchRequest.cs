using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.FieldSettings;

public class FieldSettingPatchRequest
{
    [Required]
    public bool UsedForDeduplication { get; set; }
}
