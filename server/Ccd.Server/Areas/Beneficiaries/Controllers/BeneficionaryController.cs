using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Helpers;
using Ccd.Server.Users;
using System;

namespace Ccd.Server.Beneficiaries;

[ApiController]
[Route("/api/v1/beneficionary")]
public class BeneficionaryController : ControllerBaseExtended
{
    private readonly BeneficionaryService _beneficionaryService;

    public BeneficionaryController(BeneficionaryService beneficionaryService)
    {
        _beneficionaryService = beneficionaryService;
    }

    [HttpGet]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<PagedApiResponse<BeneficionaryResponse>>> GetBeneficiaries([FromQuery] RequestParameters requestParameters)
    {
        var response = await _beneficionaryService.GetBeneficiariesApi(requestParameters, this.OrganizationId);
        return Ok(response);
    }

    [HttpGet("{id}")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<BeneficionaryResponse>> GetBeneficiary(Guid id)
    {
        var response = await _beneficionaryService.GetBeneficiaryApi(this.OrganizationId, id);
        return Ok(response);
    }
}
