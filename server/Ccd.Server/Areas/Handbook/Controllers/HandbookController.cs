using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Helpers;
using Ccd.Server.Users;

namespace Ccd.Server.Handbooks;

[ApiController]
[Route("/api/v1/handbooks")]
public class HandbookController : ControllerBaseExtended
{
    private readonly IMapper _mapper;
    private readonly HandbookService _handbookService;

    public HandbookController(HandbookService handbookService, IMapper mapper)
    {
        _handbookService = handbookService;
        _mapper = mapper;
    }

    [HttpGet]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<PagedApiResponse<HandbookResponse>>> GetAll(
        [FromQuery] RequestParameters requestParams
    )
    {
        var handbooks = await _handbookService.GetHandbooksApi(requestParams);
        return Ok(handbooks);
    }

    [HttpGet("{id}")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<HandbookResponse>> GetHandbook(Guid id)
    {
        var handbook = await _handbookService.GetHandbookApi(id) ?? throw new NotFoundException();
        return Ok(handbook);
    }


    [HttpPost]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<HandbookResponse>> Add([FromBody] HandbookAddRequest model)
    {
        var handbook = _mapper.Map<Handbook>(model);

        var newOrganizaiton = await _handbookService.AddHandbook(handbook);
        var result = await _handbookService.GetHandbookApi(newOrganizaiton.Id);

        return Ok(result);
    }

    [HttpPut("{id}")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<HandbookResponse>> Update(
        [FromBody] HandbookUpdateRequest model,
        Guid id
    )
    {
        var handbook = await _handbookService.GetHandbookById(id) ?? throw new NotFoundException();

        _mapper.Map(model, handbook);

        await _handbookService.UpdateHandbook(handbook);

        var result = await _handbookService.GetHandbookApi(id);

        return Ok(result);
    }

    [HttpDelete("{id}")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<HandbookResponse>> Delete(Guid id)
    {
        var handbook = await _handbookService.GetHandbookById(id) ?? throw new NotFoundException();

        var result = await _handbookService.GetHandbookApi(handbook.Id);

        await _handbookService.DeleteHandbook(handbook);

        return Ok(result);
    }
}
