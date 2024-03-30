﻿namespace Ccd.Server.Users;

public class UserRole
{
    public const string Admin = "admin";
    public const string User = "user";

    public static bool IsValidRole(string modelRole)
    {
        return modelRole is Admin or User;
    }
}
