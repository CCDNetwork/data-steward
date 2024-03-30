using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Ccd.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace Ccd.Server.Helpers;

public class PagedApiResponseMeta
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalRows { get; set; }
    public int TotalPages { get; set; }
    public string SortBy { get; set; }
    public string SortDirection { get; set; }

    public PagedApiResponseMeta() { }

    public PagedApiResponseMeta(
        int page,
        int pageSize,
        int totalRows,
        string sortBy,
        string sortDirection
    )
    {
        this.Page = page;
        this.PageSize = pageSize;
        this.TotalRows = totalRows;
        this.TotalPages = Convert.ToInt32(Math.Ceiling((decimal)totalRows / pageSize));
        this.SortBy = sortBy;
        this.SortDirection = sortDirection;
    }
}

public class PagedApiResponse<T>
{
    private const int DEFAULT_PAGE_SIZE = 20;

    public List<T> Data { get; set; }
    public PagedApiResponseMeta Meta { get; set; }

    private static string generateSearchSql<TT>(RequestParameters parameters)
    {
        var sqlSearch = "";

        if (!string.IsNullOrEmpty(parameters?.Search))
        {
            var searchColumnList = (
                from pi in typeof(TT).GetProperties()
                where Attribute.IsDefined(pi, typeof(QuickSearchable))
                select pi.Name
            ).ToList();

            var searchValue = parameters.Search.Replace("'", "");

            sqlSearch = " (";

            sqlSearch += $"id::text ILIKE '%{searchValue}%'";

            for (int i = 0; i < searchColumnList.Count; i++)
            {
                sqlSearch +=
                    " OR " + searchColumnList[i].ToSnakeCase() + $" ILIKE '%{searchValue}%'";
            }

            sqlSearch += ") ";
        }

        return sqlSearch;
    }

    private static string generateFilterSql<TT>(RequestParameters parameters)
    {
        var sqlFilter = "";

        if (parameters?.FilterList.Count > 0)
        {
            var filterColumnList = (
                from pi in typeof(TT).GetProperties()
                select pi.Name.ToSnakeCase()
            ).ToList();

            if (filterColumnList.Count > 0)
            {
                sqlFilter = " (";

                var i = 0;

                foreach (var key in parameters.FilterList.Keys)
                {
                    var column = key.Replace("'", "")
                        .Replace("[gt]", "")
                        .Replace("[lt]", "")
                        .Replace("[not]", "")
                        .Replace("[like]", "")
                        .Replace("[in]", "")
                        .Replace("[contains]", "")
                        .ToSnakeCase();

                    var isCustomField = key.Contains('.');

                    if (!filterColumnList.Contains(column) && !isCustomField)
                        throw new BadRequestException($"Invalid filter: {column}");

                    var filterType = typeof(TT)
                        .GetProperties()
                        .First(e => e.Name.ToSnakeCase() == column)
                        ?.PropertyType;

                    var quote = "'";
                    var cast = "::varchar";
                    var isNumeric = false;

                    if (filterType == typeof(decimal) || filterType == typeof(int))
                    {
                        quote = "";
                        cast = "";
                        isNumeric = true;
                    }

                    var value = parameters.FilterList[key].Replace("'", "");

                    if (filterType == typeof(List<string>))
                    {
                        value = "'[\"" + value.Replace("'", "") + "\"]'";
                        cast = "";
                        quote = "";
                    }

                    if (i > 0)
                        sqlFilter += " AND ";

                    var sqlOperator = "=";
                    var likeOperator = "";

                    if (key.Contains("[lt]"))
                        sqlOperator = "<";
                    if (key.Contains("[gt]"))
                        sqlOperator = ">=";
                    if (key.Contains("[not]"))
                        sqlOperator = "<>";
                    if (key.Contains("[contains]"))
                    {
                        sqlOperator = " @> ";
                    }
                    if (key.Contains("[like]"))
                    {
                        if (isNumeric)
                            throw new BadRequestException(
                                $"Invalid [like] filter for numeric column: {column}"
                            );

                        sqlOperator = " ilike ";
                        likeOperator = "%";
                    }

                    if (key.Contains("[in]"))
                    {
                        sqlOperator = " in ";
                    }

                    if (isCustomField)
                    {
                        sqlOperator = " = ";
                        cast = "";
                        column =
                            key.Split('.')[0].Replace("'", "")
                            + "->>"
                            + "'"
                            + key.Split('.')[1].Replace("'", "")
                            + "'";
                    }

                    if (value == "$null")
                    {
                        sqlFilter += column + " is null";
                    }
                    else if (value == "$notnull")
                    {
                        sqlFilter += column + " is not null";
                    }
                    else
                    {
                        if (key.Contains("[in]"))
                        {
                            var stringValues = string.Join(
                                ",",
                                value.Split("|").Select(x => $"{quote}{x}{quote}")
                            );
                            sqlFilter += column + $"{cast} in ({stringValues})";
                        }
                        else
                        {
                            sqlFilter +=
                                column
                                + $"{cast} {sqlOperator} {quote}{likeOperator}{value}{likeOperator}{quote}";
                        }
                    }

                    i++;
                }

                sqlFilter += ") ";
            }
        }

        return sqlFilter;
    }

    public static async Task<PagedApiResponse<T>> GetFromSql(
        DbContext context,
        string sql,
        object sqlParams,
        RequestParameters parameters,
        Func<T, Task> resolveDependencies = null,
        Func<T, string, Task> resolveDependenciesWithLanguage = null,
        string language = null,
        Func<T, string> resolveDependenciesSearch = null
    )
    {
        var page = parameters?.Page ?? 1;
        var pageSize = parameters?.PageSize ?? DEFAULT_PAGE_SIZE;

        var offset = (page - 1) * pageSize;
        var limit = pageSize;

        var sqlOrder = "";
        var sortDirection = parameters?.SortDirection == "desc" ? "desc" : "asc";

        if (!string.IsNullOrEmpty(parameters?.SortBy))
        {
            var sortProperty = typeof(T)
                .GetProperties()
                .FirstOrDefault(e => e.Name.ToSnakeCase() == parameters.SortBy);

            if (sortProperty?.IsDefined(typeof(SortAsNumberAttribute), false) == true)
            {
                sqlOrder =
                    $@" ORDER BY right('00000000000000000000' || {parameters.SortBy.Replace("'", "''").ToSnakeCase()}, 20) {sortDirection}";
            }
            else
            {
                sqlOrder =
                    $@" ORDER BY {parameters.SortBy.Replace("'", "''").ToSnakeCase()} {sortDirection}";
            }
        }
        else
        {
            sqlOrder = $@" ORDER BY id";
        }

        var sqlPaging = $@" OFFSET {offset.ToString()} LIMIT {limit.ToString()}";

        var sqlWhere = "";
        var sqlSearch = generateSearchSql<T>(parameters);
        var sqlFilter = generateFilterSql<T>(parameters);

        if (!string.IsNullOrEmpty(sqlSearch) || !string.IsNullOrEmpty(sqlFilter))
        {
            sqlWhere = $" WHERE ";
            if (!string.IsNullOrEmpty(sqlSearch))
                sqlWhere += sqlSearch;
            if (!string.IsNullOrEmpty(sqlSearch) && !string.IsNullOrEmpty(sqlFilter))
                sqlWhere += " AND ";
            if (!string.IsNullOrEmpty(sqlFilter))
                sqlWhere += sqlFilter;
        }

        var sqlWithConditions =
            $@"SELECT * FROM ( {sql} ) as result " + sqlWhere + sqlOrder + sqlPaging;
        var sqlCount = $@"SELECT COUNT(*) as row_count FROM ( {sql} ) as result {sqlWhere}";

        var items = await context.Database
            .GetDbConnection()
            .QueryAsync<T>(sqlWithConditions, sqlParams);
        var totalRows = await context.Database
            .GetDbConnection()
            .QuerySingleAsync<int>(sqlCount, sqlParams);

        var data = items.ToList();

        if (resolveDependenciesWithLanguage != null)
        {
            foreach (var item in items)
            {
                await resolveDependenciesWithLanguage(item, language);
            }
        }

        else if (resolveDependencies != null)
        {
            foreach (var item in items)
            {
                await resolveDependencies(item);
            }
        }

        else if (resolveDependenciesSearch != null)
        {
            foreach (var item in items)
            {
                resolveDependenciesSearch(item);
            }
        }

        var response = new PagedApiResponse<T>
        {
            Data = data,
            Meta = new PagedApiResponseMeta(
                page,
                pageSize,
                totalRows,
                parameters?.SortBy,
                sortDirection
            )
        };

        return response;
    }
}
