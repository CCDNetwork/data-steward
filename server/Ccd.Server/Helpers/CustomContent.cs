using System.Collections.Generic;

namespace Ccd.Server.Helpers;

public class CustomContent : Dictionary<string, object> { }

public class CustomField
{
    public string id { get; set; }
    public string name { get; set; }
    public string type { get; set; }
}

public class CustomFieldType
{
    public const string Decimal = "decimal";
    public const string TierSelection = "tierselection";
}
