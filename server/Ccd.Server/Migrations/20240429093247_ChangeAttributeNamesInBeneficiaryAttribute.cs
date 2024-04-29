using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeAttributeNamesInBeneficiaryAttribute : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 4,
                column: "attribute_name",
                value: "DateOfBirth");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 5,
                column: "attribute_name",
                value: "HhId");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 6,
                column: "attribute_name",
                value: "MobilePhoneId");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 7,
                column: "attribute_name",
                value: "GovIdType");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 8,
                column: "attribute_name",
                value: "GovIdNumber");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 9,
                column: "attribute_name",
                value: "OtherIdType");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 10,
                column: "attribute_name",
                value: "OtherIdNumber");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
                value: "HHID");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 6,
                column: "attribute_name",
                value: "MobilePhoneID");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 7,
                column: "attribute_name",
                value: "GovIDType");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 8,
                column: "attribute_name",
                value: "GovIDNumber");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 9,
                column: "attribute_name",
                value: "OtherIDType");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 10,
                column: "attribute_name",
                value: "OtherIDNumber");
        }
    }
}
