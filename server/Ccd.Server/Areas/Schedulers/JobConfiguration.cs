using Hangfire;
using Ccd.Server.Helpers;

namespace Ccd.Server.Schedulers;

public class JobConfiguration
{
    private readonly IRecurringJobManager _recurringJobManager;
    private readonly CommcareScheduler _commcareScheduler;

    public JobConfiguration(
        IRecurringJobManager recurringJobManager,
        CommcareScheduler commcareScheduler
    )
    {
        _recurringJobManager = recurringJobManager;
        _commcareScheduler = commcareScheduler;
    }

    public void Configure()
    {
        _recurringJobManager.AddOrUpdate(
            "CommcareScheduler",
            () => _commcareScheduler.Run(),
            StaticConfiguration.CommcareSchedulerCronExpression
        );
    }
}
