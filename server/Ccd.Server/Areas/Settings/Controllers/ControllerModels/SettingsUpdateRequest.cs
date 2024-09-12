﻿namespace Ccd.Server.Settings;

public class SettingsUpdateRequest
{
    public string DeploymentCountry { get; set; }
    public string DeploymentName { get; set; }
    public string AdminLevel1Name { get; set; }
    public string AdminLevel2Name { get; set; }
    public string AdminLevel3Name { get; set; }
    public string AdminLevel4Name { get; set; }
    public string MetabaseUrl { get; set; }
}