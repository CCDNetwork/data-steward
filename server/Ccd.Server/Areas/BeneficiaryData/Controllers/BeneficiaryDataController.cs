using System.Threading.Tasks;
using Ccd.Server.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace Ccd.Server.BeneficiaryData;

[ApiController]
[Route("/api/v1/beneficiary-data")]
public class BeneficiaryDataController : ControllerBaseExtended
{
    private readonly BeneficaryDataService _beneficaryDataService;

    public BeneficiaryDataController(BeneficaryDataService beneficaryDataService)
    {
        _beneficaryDataService = beneficaryDataService;
    }


    [HttpGet("{taxId}")]
    public async Task<ActionResult<BeneficaryDataResponse>> GetBeneficiaryData(string taxId)
    {
        var response = await _beneficaryDataService.GetBeneficiaryDataApi(taxId);
        return Ok(response);
    }
}