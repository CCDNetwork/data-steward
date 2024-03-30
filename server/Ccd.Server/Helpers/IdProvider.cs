using System;
using RT.Comb;

namespace Ccd.Server.Helpers;

public class IdProvider
{
    public static Guid NewId()
    {
        return Provider.PostgreSql.Create();
    }
}
