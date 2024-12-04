using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Ccd.Server.Helpers;

namespace Ccd.Server.Schedulers;

public class CommcareScheduler
{
    private readonly IServiceProvider _serviceProvider;
    private readonly DateTimeProvider _dateTimeProvider;

    public CommcareScheduler(IServiceProvider serviceProvider, DateTimeProvider dateTimeProvider)
    {
        _serviceProvider = serviceProvider;
        _dateTimeProvider = dateTimeProvider;
    }

    public async Task Run()
    {
        using var scope = _serviceProvider.CreateScope();

        var commcareSchedulerService =
            scope.ServiceProvider.GetRequiredService<CommcareSchedulerService>();

        Console.WriteLine(
            $"[{_dateTimeProvider.UtcNow}] - [HangFire]: Running CommcareScheduler"
        );
        Stopwatch stopwatch = new Stopwatch();
        stopwatch.Start();

        await commcareSchedulerService.Runner();

        stopwatch.Stop();
        Console.WriteLine(
            $"[{_dateTimeProvider.UtcNow}] - [HangFire]: elapsed time => {stopwatch.ElapsedMilliseconds.ToString()} ms"
        );
    }
}
