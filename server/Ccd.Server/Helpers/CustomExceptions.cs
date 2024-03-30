using System;

namespace Ccd.Server.Helpers;

public class CustomException : Exception
{
    protected CustomException(string message)
        : base(message) { }
}

public class ConflictException : CustomException
{
    public ConflictException(string message = "Conflict")
        : base(message) { }
}

public class NotFoundException : CustomException
{
    public NotFoundException(string message = "Not found")
        : base(message) { }
}

public class UnauthorizedException : CustomException
{
    public UnauthorizedException(string message = "Unauthorized")
        : base(message) { }
}

public class BadRequestException : CustomException
{
    public BadRequestException(string message = "Bad request")
        : base(message) { }
}

public class ForbiddenException : Exception
{
    public ForbiddenException(string message = "Forbidden")
        : base(message) { }
}
