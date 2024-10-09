using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ccd.Server.Email;

public interface ISendGridService
{
    public Task SendEmail(
        string to,
        string subject,
        string from,
        string templateId = null,
        Dictionary<string, string> templateData = null
    );
}