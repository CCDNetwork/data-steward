using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class RenameSettingFieldsToBeneficiaryAttributes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "field_setting");

            migrationBuilder.CreateTable(
                name: "beneficiary_attribute",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: true),
                    type = table.Column<string>(type: "text", nullable: true),
                    used_for_deduplication = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_beneficiary_attribute", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "beneficiary_attribute",
                columns: new[] { "id", "name", "type", "used_for_deduplication" },
                values: new object[,]
                {
                    { 1, "First Name", "string", true },
                    { 2, "Family Name", "string", true },
                    { 3, "Gender", "string", false },
                    { 4, "Date of Birth", "DateTime", false },
                    { 5, "Community ID", "string", false },
                    { 6, "HH ID", "string", false },
                    { 7, "Mobile Phone ID", "int", false },
                    { 8, "Gov ID Type", "string", false },
                    { 9, "Gov ID Number", "string", false },
                    { 10, "Other ID Type", "string", false },
                    { 11, "Other ID Number", "string", false },
                    { 12, "Assistance Details", "string", false },
                    { 13, "Activity", "string", false },
                    { 14, "Currency", "string", false },
                    { 15, "Currency Amount", "int", false },
                    { 16, "Start Date", "DateTime", false },
                    { 17, "End Date", "DateTime", false },
                    { 18, "Frequency", "string", false }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "beneficiary_attribute");

            migrationBuilder.CreateTable(
                name: "field_setting",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: true),
                    type = table.Column<string>(type: "text", nullable: true),
                    used_for_deduplication = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_field_setting", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "field_setting",
                columns: new[] { "id", "name", "type", "used_for_deduplication" },
                values: new object[,]
                {
                    { 1, "First Name", "string", true },
                    { 2, "Family Name", "string", true },
                    { 3, "Gender", "string", false },
                    { 4, "Date of Birth", "DateTime", false },
                    { 5, "Community ID", "string", false },
                    { 6, "HH ID", "string", false },
                    { 7, "Mobile Phone ID", "int", false },
                    { 8, "Gov ID Type", "string", false },
                    { 9, "Gov ID Number", "string", false },
                    { 10, "Other ID Type", "string", false },
                    { 11, "Other ID Number", "string", false },
                    { 12, "Assistance Details", "string", false },
                    { 13, "Activity", "string", false },
                    { 14, "Currency", "string", false },
                    { 15, "Currency Amount", "int", false },
                    { 16, "Start Date", "DateTime", false },
                    { 17, "End Date", "DateTime", false },
                    { 18, "Frequency", "string", false }
                });
        }
    }
}
