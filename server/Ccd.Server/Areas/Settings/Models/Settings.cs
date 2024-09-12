using System;
using Ccd.Server.Helpers;

namespace Ccd.Server.Settings;

public class Settings
{
    public Guid Id { get; set; } = IdProvider.NewId();

    public string DeploymentCountry { get; set; }
    public string DeploymentName { get; set; }
    public string AdminLevel1Name { get; set; }
    public string AdminLevel2Name { get; set; }
    public string AdminLevel3Name { get; set; }
    public string AdminLevel4Name { get; set; }
    public string MetabaseUrl { get; set; }

    public DateTime UpdatedAt { get; set; }
}