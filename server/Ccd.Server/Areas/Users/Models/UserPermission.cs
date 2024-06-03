public class UserPermission
{
    public const string Referral = "referral";
    public const string Deduplication = "deduplication";

    public static bool IsValidPermission(string permission)
    {
        return permission is Referral or Deduplication;
    }
}