using System.Linq;
using CsvHelper.Configuration.Attributes;

namespace Ccd.Server.Referrals;

public class ImpexNameAttribute : NameAttribute
{
    public ImpexNameAttribute(string name)
        : base(getOnlyName(name))
    {
        LocalizedNames = new[] { name };
    }

    public ImpexNameAttribute(params string[] names)
        : base(getOnlyNames(names))
    {
        LocalizedNames = names;
    }

    public string[] LocalizedNames { get; set; }

    private static string getOnlyName(string name)
    {
        return name.Split(";")[0];
    }

    private static string[] getOnlyNames(string[] names)
    {
        return names.Select(getOnlyName).ToArray();
    }
}