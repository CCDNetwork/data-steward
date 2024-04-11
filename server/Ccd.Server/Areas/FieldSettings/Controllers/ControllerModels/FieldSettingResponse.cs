namespace Ccd.Server.FieldSettings;

public class FieldSettingResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public bool UsedForDeduplication { get; set; }
}
