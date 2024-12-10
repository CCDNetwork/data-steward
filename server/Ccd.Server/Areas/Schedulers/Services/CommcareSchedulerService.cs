using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Ccd.Server.Commcare;
using Ccd.Server.Data;
using Ccd.Server.Email;
using Ccd.Server.Helpers;
using Newtonsoft.Json.Linq;

namespace Ccd.Server.Schedulers;

public class CommcareSchedulerService
{
    private readonly CcdContext _context;
    private readonly SendGridService _sendGridService;

    public CommcareSchedulerService(CcdContext context, SendGridService sendGridService)
    {
        _context = context;
        _sendGridService = sendGridService;
    }

    public async Task Runner()
    {
        try
        {
            var formData = await GetFormData();
            if (formData != null)
            {
                var objects = formData["objects"];
                foreach (var item in objects)
                {
                    var firstName = item["form"]["first_name"]?.ToString();
                    var familyName = item["form"]["family_name"]?.ToString();
                    var taxId = item["form"]["tax_id"]?.ToString();
                    if (string.IsNullOrEmpty(firstName) || string.IsNullOrEmpty(familyName) || string.IsNullOrEmpty(taxId)) continue;

                    var existing = _context.CommcareData.Where(x => x.TaxId == taxId).FirstOrDefault();
                    if (existing != null) continue;

                    var commcare = new CommcareData
                    {
                        FirstName = firstName,
                        FamilyName = familyName,
                        TaxId = taxId
                    };

                    _context.CommcareData.Add(commcare);
                    await _context.SaveChangesAsync();

                    var duplicateCount = _context.Beneficaries.Where(x => x.GovIdNumber == taxId).Count();
                    if (duplicateCount == 0) continue;

                    var userId = item["form"]?["meta"]?["userID"]?.ToString();
                    if (userId == null) continue;

                    var workerData = await GetWorkerData(userId);
                    if (workerData == null) continue;

                    var workerEmail = workerData["email"]?.ToString();
                    var workerFirstName = workerData["first_name"]?.ToString();
                    var workerLastName = workerData["last_name"]?.ToString();
                    var templateData = new Dictionary<string, string>
                    {
                        { "firstName", workerFirstName },
                        { "lastName", workerLastName },
                        { "taxId", taxId },
                        { "ccdDuplicates", duplicateCount.ToString() }
                    };

                    await _sendGridService.SendEmail(workerEmail, StaticConfiguration.SendgridCommcareEmailTemplateId, templateData);
                }
            }
            else
            {
                Console.WriteLine("NO Data----------");
            }
        }
        catch (Exception exception)
        {
            Console.WriteLine("Exception Hit------------");
            Console.WriteLine(exception);
        }
    }

    private async Task<JObject> GetFormData()
    {
        using HttpClient client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", "ApiKey" + " " + "marin@init.hr:e178994a68b22fc59d43a555ca9e276d5d31a846");

        string url = "https://www.commcarehq.org/a/ccd-network-test-space/api/v0.5/form/";
        using HttpResponseMessage res = await client.GetAsync(url);
        using HttpContent content = res.Content;
        if (content == null) return null;

        var responseString = await content.ReadAsStringAsync();
        return JObject.Parse(responseString);
    }

    private async Task<JObject> GetWorkerData(string userId)
    {
        using HttpClient client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", "ApiKey" + " " + "marin@init.hr:e178994a68b22fc59d43a555ca9e276d5d31a846");

        string url = $"https://www.commcarehq.org/a/ccd-network-test-space/api/v0.5/user/{userId}/";
        using HttpResponseMessage res = await client.GetAsync(url);
        using HttpContent content = res.Content;
        if (content == null) return null;

        var responseString = await content.ReadAsStringAsync();
        return JObject.Parse(responseString);
    }
}
