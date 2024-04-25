using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminLevels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "community_id",
                table: "template",
                newName: "admin_level4");

            migrationBuilder.AddColumn<string>(
                name: "admin_level1",
                table: "template",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "admin_level2",
                table: "template",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "admin_level3",
                table: "template",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "HHID", "HH ID" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 6,
                columns: new[] { "attribute_name", "name", "type" },
                values: new object[] { "MobilePhoneID", "Mobile Phone ID", "int" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 7,
                columns: new[] { "attribute_name", "name", "type" },
                values: new object[] { "GovIDType", "Gov ID Type", "string" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 8,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "GovIDNumber", "Gov ID Number" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 9,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "OtherIDType", "Other ID Type" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 10,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "OtherIDNumber", "Other ID Number" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 11,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "AssistanceDetails", "Assistance Details" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 12,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "Activity", "Activity" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 13,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "Currency", "Currency" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 14,
                columns: new[] { "attribute_name", "name", "type" },
                values: new object[] { "CurrencyAmount", "Currency Amount", "int" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 15,
                columns: new[] { "attribute_name", "name", "type" },
                values: new object[] { "StartDate", "Start Date", "DateTime" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 16,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "EndDate", "End Date" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 17,
                columns: new[] { "attribute_name", "name", "type" },
                values: new object[] { "Frequency", "Frequency", "string" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 18,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "AdminLevel1", "AdminLevel1" });

            migrationBuilder.InsertData(
                table: "beneficiary_attribute",
                columns: new[] { "id", "attribute_name", "name", "type", "used_for_deduplication" },
                values: new object[,]
                {
                    { 19, "AdminLevel2", "AdminLevel2", "string", false },
                    { 20, "AdminLevel3", "AdminLevel3", "string", false },
                    { 21, "AdminLevel4", "AdminLevel4", "string", false }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 21);

            migrationBuilder.DropColumn(
                name: "admin_level1",
                table: "template");

            migrationBuilder.DropColumn(
                name: "admin_level2",
                table: "template");

            migrationBuilder.DropColumn(
                name: "admin_level3",
                table: "template");

            migrationBuilder.RenameColumn(
                name: "admin_level4",
                table: "template",
                newName: "community_id");

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "CommunityID", "Community ID" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 6,
                columns: new[] { "attribute_name", "name", "type" },
                values: new object[] { "HHID", "HH ID", "string" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 7,
                columns: new[] { "attribute_name", "name", "type" },
                values: new object[] { "MobilePhoneID", "Mobile Phone ID", "int" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 8,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "GovIDType", "Gov ID Type" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 9,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "GovIDNumber", "Gov ID Number" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 10,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "OtherIDType", "Other ID Type" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 11,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "OtherIDNumber", "Other ID Number" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 12,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "AssistanceDetails", "Assistance Details" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 13,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "Activity", "Activity" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 14,
                columns: new[] { "attribute_name", "name", "type" },
                values: new object[] { "Currency", "Currency", "string" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 15,
                columns: new[] { "attribute_name", "name", "type" },
                values: new object[] { "CurrencyAmount", "Currency Amount", "int" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 16,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "StartDate", "Start Date" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 17,
                columns: new[] { "attribute_name", "name", "type" },
                values: new object[] { "EndDate", "End Date", "DateTime" });

            migrationBuilder.UpdateData(
                table: "beneficiary_attribute",
                keyColumn: "id",
                keyValue: 18,
                columns: new[] { "attribute_name", "name" },
                values: new object[] { "Frequency", "Frequency" });
        }
    }
}
