using System.Collections.Generic;
using System.Linq;

namespace Ccd.Server.Referrals;

public class CsvMapper
{
    public static string[] GetHeaders<T>(string language, List<string> columns = null)
    {
        if (string.IsNullOrEmpty(language))
            language = "en";

        var type = typeof(T);
        var properties = type.GetProperties();
        var headers = new List<string>();

        foreach (var property in properties)
        {
            var attributes = property.GetCustomAttributes(typeof(ImpexNameAttribute), false);
            foreach (var attribute in attributes)
            {
                var localizedNameAttribute = (ImpexNameAttribute)attribute;

                foreach (var name in localizedNameAttribute.LocalizedNames)
                {
                    var parts = name.Split(";");
                    if (parts.Length > 1 && parts[1] == language)
                        if (
                            columns == null
                            || columns.Count == 0
                            || columns.Select(e => e.ToLower()).Contains(property.Name.ToLower())
                        )
                        {
                            headers.Add(parts[0]);
                            break;
                        }
                }
            }
        }

        return headers.ToArray();
    }

    public static IEnumerable<object[]> GetBody<T>(List<T> targetItems, List<string> columns)
    {
        var extractedData = targetItems
            .Select(item =>
            {
                var extractedItem = new List<object>();
                foreach (var property in typeof(T).GetProperties())
                    if (
                        columns == null
                        || columns.Count == 0
                        || columns.Select(e => e.ToLower()).Contains(property.Name.ToLower())
                    )
                    {
                        var value = property.GetValue(item);
                        extractedItem.Add(value);
                    }

                return extractedItem.ToArray();
            })
            .ToList();

        return extractedData;
    }
}