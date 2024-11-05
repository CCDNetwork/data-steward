using System;
using System.Globalization;
using Ccd.Server.Areas.Referrals.Helpers;
using ClosedXML.Excel;

namespace Ccd.Server.Referrals;

public static class BatchReferralsValidators
{
    public static void HighlightCellAndSetMissing(
        IXLWorksheet worksheet,
        int rowIndex,
        int columnIndex,
        ref bool missingRequiredFields
    )
    {
        worksheet.Cell(rowIndex, columnIndex).Style.Fill.BackgroundColor = XLColor.Red;
        missingRequiredFields = true;
    }

    public static void ValidateAndHighlightEmptyField(
        IXLWorksheet worksheet,
        int rowIndex,
        dynamic column,
        string value,
        ref bool missingRequiredFields
    )
    {
        if (!string.IsNullOrWhiteSpace(value))
            HighlightCellAndSetMissing(worksheet, rowIndex, (int)column, ref missingRequiredFields);
    }

    public static void ValidateAndHighlightRequiredField(
        IXLWorksheet worksheet,
        int rowIndex,
        int columnIndex,
        string fieldValue,
        ref bool missingRequiredFields
    )
    {
        if (string.IsNullOrWhiteSpace(fieldValue))
            HighlightCellAndSetMissing(worksheet, rowIndex, columnIndex, ref missingRequiredFields);
    }

    public static DateTime? ValidateAndParseDateOfBirth(
        IXLWorksheet worksheet,
        int rowIndex,
        int columnIndex,
        ref bool missingRequiredFields
    )
    {
        var cellValue = worksheet.Cell(rowIndex, columnIndex).Value.ToString();

        if (string.IsNullOrWhiteSpace(cellValue))
        {
            //  If empty, highlight the cell and mark as missing
            HighlightCellAndSetMissing(worksheet, rowIndex, columnIndex, ref missingRequiredFields);
            return null;
        }

        var dateFormats = new[]
        {
            "MM-dd-yyyy",
            "yyyyMMdd",
            "yyyy-MM-dd",
            "MM/dd/yyyy",
            "dd/MM/yyyy",
            "MM.dd.yyyy",
            "yyyy.MM.dd"
        };

        //  try to parse the value as a datetime
        if (
            DateTime.TryParseExact(
                cellValue,
                dateFormats,
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var parsedDate
            )
        )
            return parsedDate.ToUniversalTime(); // Return the parsed date if successful

        //  if fail, highlight the cell and mark as missing
        HighlightCellAndSetMissing(worksheet, rowIndex, columnIndex, ref missingRequiredFields);
        return null;
    }

    public static void ValidateContactPreference(
        IXLWorksheet worksheet,
        int rowIndex,
        string contactPreference,
        string email,
        string phone,
        ref bool missingRequiredFields
    )
    {
        if (contactPreference.Equals("email", StringComparison.OrdinalIgnoreCase))
        {
            if (string.IsNullOrWhiteSpace(email))
                HighlightCellAndSetMissing(
                    worksheet,
                    rowIndex,
                    (int)GeneralReferralsWorksheetColumns.Email,
                    ref missingRequiredFields
                );
        }
        else if (contactPreference.Equals("phone", StringComparison.OrdinalIgnoreCase))
        {
            if (string.IsNullOrWhiteSpace(phone))
                HighlightCellAndSetMissing(
                    worksheet,
                    rowIndex,
                    (int)GeneralReferralsWorksheetColumns.Phone,
                    ref missingRequiredFields
                );
        }
        else if (!contactPreference.Equals("visit", StringComparison.OrdinalIgnoreCase))
        {
            // invalid contact preference, highlight it in red
            HighlightCellAndSetMissing(
                worksheet,
                rowIndex,
                (int)GeneralReferralsWorksheetColumns.ContactPreference,
                ref missingRequiredFields
            );
        }
    }

    public static void ValidateCaregiverContactPreference(
        IXLWorksheet worksheet,
        int rowIndex,
        string contactPreference,
        string email,
        string phone,
        ref bool missingRequiredFields
    )
    {
        if (contactPreference.Equals("email", StringComparison.OrdinalIgnoreCase))
            // validate caregiver email if contact preference is email
            ValidateAndHighlightRequiredField(
                worksheet,
                rowIndex,
                (int)MinorReferralsWorksheetColumns.CaregiverEmail,
                email,
                ref missingRequiredFields
            );
        else if (contactPreference.Equals("phone", StringComparison.OrdinalIgnoreCase))
            // validate caregiver phone if contact preference is phone
            ValidateAndHighlightRequiredField(
                worksheet,
                rowIndex,
                (int)MinorReferralsWorksheetColumns.CaregiverPhone,
                phone,
                ref missingRequiredFields
            );
        else if (!contactPreference.Equals("visit", StringComparison.OrdinalIgnoreCase))
            // if contact preference is neither email, phone, nor visit, mark it as invalid
            HighlightCellAndSetMissing(
                worksheet,
                rowIndex,
                (int)MinorReferralsWorksheetColumns.CaregiverContactPreference,
                ref missingRequiredFields
            );
    }

    public static void ValidateCaregiverFields(
        IXLWorksheet worksheet,
        int rowIndex,
        bool isSeparated,
        string caregiver,
        string relationshipToChild,
        string caregiverEmail,
        string caregiverPhone,
        string caregiverContactPreference,
        bool isCaregiverInformed,
        string caregiverExplanation,
        string caregiverNote,
        ref bool missingRequiredFields
    )
    {
        var isSeparatedValue = worksheet
            .Cell(rowIndex, (int)MinorReferralsWorksheetColumns.IsSeparated)
            .Value.ToString();

        if (!bool.TryParse(isSeparatedValue, out var isSeparatedParsed))
        {
            HighlightCellAndSetMissing(
                worksheet,
                rowIndex,
                (int)MinorReferralsWorksheetColumns.IsSeparated,
                ref missingRequiredFields
            );
            return; // exit since isSeparated must be valid
        }

        // if isSeparated is false, none of the other fields should be present
        if (!isSeparatedParsed)
        {
            ValidateAndHighlightEmptyField(
                worksheet,
                rowIndex,
                MinorReferralsWorksheetColumns.Caregiver,
                caregiver,
                ref missingRequiredFields
            );
            ValidateAndHighlightEmptyField(
                worksheet,
                rowIndex,
                MinorReferralsWorksheetColumns.RelationshipToChild,
                relationshipToChild,
                ref missingRequiredFields
            );
            ValidateAndHighlightEmptyField(
                worksheet,
                rowIndex,
                MinorReferralsWorksheetColumns.CaregiverEmail,
                caregiverEmail,
                ref missingRequiredFields
            );
            ValidateAndHighlightEmptyField(
                worksheet,
                rowIndex,
                MinorReferralsWorksheetColumns.CaregiverPhone,
                caregiverPhone,
                ref missingRequiredFields
            );
            ValidateAndHighlightEmptyField(
                worksheet,
                rowIndex,
                MinorReferralsWorksheetColumns.CaregiverContactPreference,
                caregiverContactPreference,
                ref missingRequiredFields
            );
            return; // exit since none of these fields should be filled
        }

        // if isSeparated is true, caregiver and relationshipToChild are required
        ValidateAndHighlightRequiredField(
            worksheet,
            rowIndex,
            (int)MinorReferralsWorksheetColumns.Caregiver,
            caregiver,
            ref missingRequiredFields
        );
        ValidateAndHighlightRequiredField(
            worksheet,
            rowIndex,
            (int)MinorReferralsWorksheetColumns.RelationshipToChild,
            relationshipToChild,
            ref missingRequiredFields
        );

        // validate caregiver preference based on its value (email,phone,visit)
        ValidateCaregiverContactPreference(
            worksheet,
            rowIndex,
            caregiverContactPreference,
            caregiverEmail,
            caregiverPhone,
            ref missingRequiredFields
        );

        // if isCaregiverInformed is valid boolean and is false, validate caregiverExplanation
        if (!isCaregiverInformed)
            ValidateAndHighlightRequiredField(
                worksheet,
                rowIndex,
                (int)MinorReferralsWorksheetColumns.CaregiverExplanation,
                caregiverExplanation,
                ref missingRequiredFields
            );
    }
}
