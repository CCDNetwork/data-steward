namespace Ccd.Server.Notifications;

public class DeduplicationType
{
    public const string Single = "single";
    public const string Multiple = "multiple";

    public static bool IsValid(string type)
    {
        return type == Single || type == Multiple;
    }
}
