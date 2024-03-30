using System;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Ccd.Server.Helpers;

[ApiExplorerSettings(IgnoreApi = true)]
public class ErrorsController : ControllerBase
{
    [Route("error")]
    public ErrorResponse HandleError()
    {
        var context = HttpContext.Features.Get<IExceptionHandlerFeature>();
        var exception = context?.Error;
        var code = HttpStatusCode.InternalServerError;

        if (exception is ConflictException)
            code = HttpStatusCode.Conflict;
        else if (exception is NotFoundException)
            code = HttpStatusCode.NotFound;
        else if (exception is UnauthorizedException)
            code = HttpStatusCode.Unauthorized;
        else if (exception is BadRequestException)
            code = HttpStatusCode.BadRequest;
        else if (exception is ForbiddenException)
            code = HttpStatusCode.Forbidden;

        Response.StatusCode = (int)code;

        return new ErrorResponse(exception);
    }
}

public class ErrorResponse
{
    public ErrorResponse(Exception e)
    {
        ErrorMessage = e.Message;
    }

    public string ErrorMessage { get; set; }
}
