using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using Ccd.Server.Users;
using System.Linq;

namespace Ccd.Server.Templates;

public class TemplateService
{
    private readonly IMapper _mapper;
    private readonly CcdContext _context;

    private readonly string _selectSql =
        $@"
             SELECT DISTINCT ON (r.id)
                 r.*
             FROM
                 template r
             WHERE
                (@id is null OR r.id = @id) AND
                (@organizationId is null OR r.organization_id = @organizationId)";

    private object getSelectSqlParams(Guid? id = null, Guid? organizationId = null)
    {
        return new { id, organizationId };
    }

    public TemplateService(
        IMapper mapper,
        CcdContext context
    )
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<PagedApiResponse<TemplateResponse>> GetTemplatesApi(Guid organizationId, RequestParameters requestParameters = null)
    {
        return await PagedApiResponse<TemplateResponse>.GetFromSql(
            _context,
            _selectSql,
            getSelectSqlParams(
                organizationId: organizationId
            ),
            requestParameters,
            ResolveDependencies
        );
    }

    public async Task<TemplateResponse> GetTemplateApi(Guid organizationId, Guid id)
    {
        var template = await GetTemplateById(organizationId, id) ?? throw new NotFoundException("Template not found.");
        var templateResponse = _mapper.Map<TemplateResponse>(template);

        if (template != null)
            await ResolveDependencies(templateResponse);

        return templateResponse;
    }

    public async Task<Template> GetTemplateById(Guid organizationId, Guid id)
    {
        return await _context.Templates
                        .Where(e => e.OrganizationId == organizationId)
                        .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<Template> AddTemplate(Guid organizationId, TemplateAddRequest model)
    {
        var template = _mapper.Map<Template>(model);
        template.OrganizationId = organizationId;

        var newTemplate = _context.Templates.Add(template).Entity;
        await _context.SaveChangesAsync();

        return newTemplate;
    }

    public async Task<Template> UpdateTemplate(Template template)
    {
        var updatedTemplate = _context.Templates.Update(template).Entity;
        await _context.SaveChangesAsync();

        return updatedTemplate;
    }

    public async Task DeleteTemplate(Template template)
    {
        _context.Templates.Remove(template);
        await _context.SaveChangesAsync();
    }

    private async Task ResolveDependencies(TemplateResponse template)
    {
        var userCreated = await _context.Users.FirstOrDefaultAsync(e => e.Id == template.UserCreatedId);
        template.UserCreated = _mapper.Map<UserResponse>(userCreated);
    }
}
