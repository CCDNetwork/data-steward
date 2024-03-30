using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace Ccd.Server.Helpers;

public class HttpResponseMessageResult : IActionResult
{
    private readonly HttpResponseMessage _responseMessage;

    public HttpResponseMessageResult(HttpResponseMessage responseMessage)
    {
        _responseMessage = responseMessage; // could add throw if null
    }

    public async Task ExecuteResultAsync(ActionContext context)
    {
        context.HttpContext.Response.StatusCode = (int)_responseMessage.StatusCode;

        foreach (var header in _responseMessage.Headers)
        {
            context.HttpContext.Response.Headers.TryAdd(
                header.Key,
                new StringValues(header.Value.ToArray())
            );
        }

        if (_responseMessage.Content != null)
        {
            using (var stream = await _responseMessage.Content.ReadAsStreamAsync())
            {
                await stream.CopyToAsync(context.HttpContext.Response.Body);
                await context.HttpContext.Response.Body.FlushAsync();
            }
        }
    }
}
