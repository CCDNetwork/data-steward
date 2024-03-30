using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ccd.Server.Notifications;

public interface INotificationService
{
    public Task SendEmail(
        string to,
        string subject,
        string message,
        Dictionary<string, string> filesBase64 = null
    );
}
