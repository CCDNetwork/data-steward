using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace Ccd.Server;

public class Program
{
    public static void Main(string[] args)
    {
        Console.WriteLine("CCD Server initializing...");
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder
                    .UseStartup<Startup>()
                    .UseUrls("http://0.0.0.0:5000")
                    .UseKestrel(options =>
                    {
                        options.Limits.MaxRequestBodySize = int.MaxValue;
                        options.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(5);
                    });
            });
}