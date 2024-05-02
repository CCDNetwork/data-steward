using System;
using System.Threading.Tasks;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Ccd.Server.Data;
using Ccd.Server.Email;
using Ccd.Server.Helpers;
using System.Linq;

namespace Ccd.Server.Handbooks;

public class HandbookService
{
    private readonly CcdContext _context;
    private readonly DateTimeProvider _dateTimeProvider;
    private readonly EmailManagerService _emailManagerService;

    private readonly string _selectSql =
        $@"
             SELECT DISTINCT ON (t.id)
                 t.*
             FROM
                 handbook t
             WHERE
                 (@id is null OR t.id = @id)";

    private object getSelectSqlParams(Guid? id = null)
    {
        return new { id };
    }

    public HandbookService(
        CcdContext context,
        DateTimeProvider dateTimeProvider,
        EmailManagerService emailManagerService
    )
    {
        _context = context;
        _dateTimeProvider = dateTimeProvider;
        _emailManagerService = emailManagerService;
    }

    public async Task<PagedApiResponse<HandbookResponse>> GetHandbooksApi(
        RequestParameters requestParameters = null
    )
    {
        return await PagedApiResponse<HandbookResponse>.GetFromSql(
            _context,
            _selectSql,
            getSelectSqlParams(),
            requestParameters
        );
    }

    public async Task<HandbookResponse> GetHandbookApi(Guid id)
    {
        var handbook = await _context.Database
            .GetDbConnection()
            .QueryFirstOrDefaultAsync<HandbookResponse>(_selectSql, getSelectSqlParams(id));

        return handbook;
    }

    public async Task<Handbook> GetHandbookById(Guid id)
    {
        return await _context.Handbooks.FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<Handbook> AddHandbook(Handbook handbook)
    {
        var newHandbook = _context.Handbooks.Add(handbook).Entity;
        await _context.SaveChangesAsync();

        return newHandbook;
    }

    public async Task<Handbook> UpdateHandbook(Handbook handbook)
    {
        var updatedHandbook = _context.Handbooks.Update(handbook).Entity;
        await _context.SaveChangesAsync();

        return updatedHandbook;
    }

    public async Task DeleteHandbook(Handbook handbook)
    {
        _context.Handbooks.Remove(handbook);
        await _context.SaveChangesAsync();
    }
}
