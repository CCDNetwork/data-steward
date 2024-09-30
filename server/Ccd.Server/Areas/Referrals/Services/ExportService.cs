using System.Collections.Generic;
using System.IO;
using System.Linq;
using AutoMapper;
using ClosedXML.Excel;

namespace Ccd.Server.Referrals;

public class ExportService
{
    private readonly IMapper _mapper;

    public ExportService(IMapper mapper)
    {
        _mapper = mapper;
    }


    public byte[] ExportXls<TSource, TTarget>(List<TSource> items, string language = "en")
    {
        var targetItems = items.Select(item => _mapper.Map<TTarget>(item)).ToList();

        var headers = CsvMapper.GetHeaders<TTarget>(language);

        var memoryStream = new MemoryStream();

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Export");

        worksheet.Cell(1, 1).InsertData(headers, true);
        worksheet.Cell(2, 1).InsertData(targetItems);

        worksheet.Row(1).Style.Font.Bold = true;
        worksheet.Columns().AdjustToContents();

        workbook.SaveAs(memoryStream);
        memoryStream.Position = 0;

        return memoryStream.ToArray();
    }
}