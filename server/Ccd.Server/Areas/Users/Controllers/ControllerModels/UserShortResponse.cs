using System;

namespace Ccd.Server.Users;

public class UserShortResponse
{
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
