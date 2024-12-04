using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Ccd.Server.Commcare;
using Ccd.Server.Data;
using Newtonsoft.Json.Linq;

namespace Ccd.Server.Schedulers;

public class CommcareSchedulerService
{
    private readonly CcdContext _context;

    public CommcareSchedulerService(CcdContext context)
    {
        _context = context;
    }

    public async Task Runner()
    {
        try
        {
            using HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", "ApiKey" + " " + "marin@init.hr:e178994a68b22fc59d43a555ca9e276d5d31a846");

            string baseUrl = "https://www.commcarehq.org/a/ccd-network-test-space/api/v0.5/form/";
            using HttpResponseMessage res = await client.GetAsync(baseUrl);

            using HttpContent content = res.Content;
            var response = await content.ReadAsStringAsync();
            if (content != null)
            {
                var objects = JObject.Parse(response)["objects"];
                foreach (var item in objects)
                {
                    var firstName = item["form"]["first_name"]?.ToString();
                    var familyName = item["form"]["family_name"]?.ToString();
                    var taxId = item["form"]["tax_id"]?.ToString();

                    if (string.IsNullOrEmpty(firstName) || string.IsNullOrEmpty(familyName) || string.IsNullOrEmpty(taxId))
                    {
                        continue;
                    }

                    var existing = _context.CommcareData.Where(x => x.TaxId == taxId).FirstOrDefault();
                    if (existing != null) continue;

                    var commcare = new CommcareData
                    {
                        FirstName = firstName,
                        FamilyName = familyName,
                        TaxId = taxId
                    };
                    _context.CommcareData.Add(commcare);

                    Console.WriteLine("Data Added----------");
                }

                await _context.SaveChangesAsync();
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
}
