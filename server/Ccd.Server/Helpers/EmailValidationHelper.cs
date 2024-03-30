using System;
using System.Text.RegularExpressions;

namespace Ccd.Server.Helpers;

public class EmailValidationHelper
{
    // Pattern for a valid email address
    const string Pattern = @"^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$";

    public static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;
        try
        {
            var regex = new Regex(Pattern);
            return regex.IsMatch(email);
        }
        catch (Exception)
        {
            return false;
        }
    }
}
