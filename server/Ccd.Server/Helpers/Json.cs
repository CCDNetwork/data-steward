using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Ccd.Server.Helpers;

public class Json
{
    private static JsonSerializerOptions jsonOptions = new JsonSerializerOptions
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        NumberHandling = JsonNumberHandling.AllowReadingFromString,
    };

    public static string Serialize(object data)
    {
        return JsonSerializer.Serialize(data, jsonOptions);
    }

    public static T Deserialize<T>(string data)
    {
        return JsonSerializer.Deserialize<T>(data, jsonOptions);
    }

    public static Dictionary<string, object> DeserializeRecursive(string data)
    {
        var result = new Dictionary<string, object>();
        var dataJson = Deserialize<Dictionary<string, object>>(data ?? "{}");

        foreach (var cdKey in dataJson.Keys)
        {
            var value = dataJson[cdKey];

            // TODO: do this in a better way when it's sorted out on the front-end
            if (value != null && value.ToString().StartsWith("[{\""))
            {
                try
                {
                    value = Deserialize<Dictionary<string, object>[]>(value.ToString());
                }
                catch { }
            }

            result[cdKey] = value;
        }

        return result;
    }

    public static string GetValue(IReadOnlyDictionary<string, string> dictValues, string keyValue)
    {
        return dictValues.ContainsKey(keyValue) ? dictValues[keyValue] : null;
    }

    public static string GetValue(IReadOnlyDictionary<string, object> dictValues, string keyValue)
    {
        return dictValues.ContainsKey(keyValue) ? dictValues[keyValue].ToString() : null;
    }
}
