namespace Ccd.Server.FieldSettings;

public class FieldSetting
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public bool UsedForDeduplication { get; set; }
}
