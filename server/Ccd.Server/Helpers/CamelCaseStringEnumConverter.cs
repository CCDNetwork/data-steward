using System.Text.Json;
using System.Text.Json.Serialization;

namespace Ccd.Server.Helpers;

public class CamelCaseStringEnumConverter : JsonStringEnumConverter
{
    public CamelCaseStringEnumConverter()
        : base(JsonNamingPolicy.CamelCase) { }
}
