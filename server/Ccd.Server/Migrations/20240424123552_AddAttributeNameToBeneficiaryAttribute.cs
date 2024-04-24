using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddAttributeNameToBeneficiaryAttribute : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "attribute_name",
                table: "beneficiary_attribute",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 1,
                column: "attribute_name",
                value: "FirstName");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 2,
                column: "attribute_name",
                value: "FamilyName");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 3,
                column: "attribute_name",
                value: "Gender");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 4,
                column: "attribute_name",
                value: "DateofBirth");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 5,
                column: "attribute_name",
                value: "CommunityID");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 6,
                column: "attribute_name",
                value: "HHID");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 7,
                column: "attribute_name",
                value: "MobilePhoneID");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 8,
                column: "attribute_name",
                value: "GovIDType");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 9,
                column: "attribute_name",
                value: "GovIDNumber");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 10,
                column: "attribute_name",
                value: "OtherIDType");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 11,
                column: "attribute_name",
                value: "OtherIDNumber");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 12,
                column: "attribute_name",
                value: "AssistanceDetails");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 13,
                column: "attribute_name",
                value: "Activity");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 14,
                column: "attribute_name",
                value: "Currency");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 15,
                column: "attribute_name",
                value: "CurrencyAmount");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 16,
                column: "attribute_name",
                value: "StartDate");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 17,
                column: "attribute_name",
                value: "EndDate");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 18,
                column: "attribute_name",
                value: "Frequency");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "attribute_name",
                table: "beneficiary_attribute");
        }
    }
}
