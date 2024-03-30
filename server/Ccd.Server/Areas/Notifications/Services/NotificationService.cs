using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ccd.Server.Notifications;

public class NotificationService : INotificationService
{
    public NotificationService()
    {
    }

    public async Task SendEmail(
        string to,
        string subject,
        string message,
        Dictionary<string, string> filesBase64 = null
    )
    {
        // TODO: send email
    }
}