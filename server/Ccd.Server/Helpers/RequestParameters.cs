using System.Collections.Generic;

namespace Ccd.Server.Helpers;

public class RequestParameters
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string Search { get; set; } = null;
    public string SortBy { get; set; }
    public string SortDirection { get; set; }

    public string Filter { get; set; }

    public Dictionary<string, string> FilterList
    {
        get
        {
            {
                var list = new Dictionary<string, string>();

                if (string.IsNullOrEmpty(Filter))
                    return list;

                foreach (var filter in Filter.Split(","))
                {
                    var filterParts = filter.Split("=");

                    if (filterParts.Length != 2)
                        continue;

                    list.Add(filterParts[0], filterParts[1]);
                }

                return list;
            }
        }
    }
}
