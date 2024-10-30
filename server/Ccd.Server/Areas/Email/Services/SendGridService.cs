using System.Collections.Generic;
using System.Threading.Tasks;
using Ccd.Server.Helpers;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Ccd.Server.Email;

public class SendGridService : ISendGridService
{
    public async Task SendEmail(
        string to,
        string subject,
        string from,
        string templateId = null,
        Dictionary<string, string> templateData = null
    )
    {
        var apiKey = StaticConfiguration.SendgridApiKey;

        if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(to))
            return;

        var client = new SendGridClient(apiKey);
        var sgFrom = new EmailAddress(from);
        var sgTo = new EmailAddress(to);


        if (templateId == null) throw new BadRequestException("Template Id is missing");


        await SendEmailTemplate(sgFrom, sgTo, templateId, templateData, client);
    }


    private async Task SendEmailTemplate(EmailAddress sgFrom, EmailAddress sgTo, string templateId,
        Dictionary<string, string> templateData, SendGridClient client)
    {
        var msg = MailHelper.CreateSingleTemplateEmail(sgFrom, sgTo, templateId, templateData);
        var result = await client.SendEmailAsync(msg);

        if (!result.IsSuccessStatusCode)
            throw new BadRequestException("Error sending email: " + await result.Body.ReadAsStringAsync());
    }
}