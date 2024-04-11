using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddBenificinaryFieldSettingsList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateTable(
                name: "list",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    organization_id = table.Column<Guid>(type: "uuid", nullable: false),
                    file_name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_list", x => x.id);
                    table.ForeignKey(
                        name: "fk_list_organization_organization_id",
                        column: x => x.organization_id,
                        principalTable: "organization",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "beneficionary",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    first_name = table.Column<string>(type: "text", nullable: true),
                    family_name = table.Column<string>(type: "text", nullable: true),
                    gender = table.Column<string>(type: "text", nullable: true),
                    date_of_birth = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    community_id = table.Column<string>(type: "text", nullable: true),
                    hh_id = table.Column<string>(type: "text", nullable: true),
                    mobile_phone_id = table.Column<int>(type: "integer", nullable: false),
                    gov_id_type = table.Column<string>(type: "text", nullable: true),
                    gov_id_number = table.Column<string>(type: "text", nullable: true),
                    other_id_type = table.Column<string>(type: "text", nullable: true),
                    other_id_number = table.Column<string>(type: "text", nullable: true),
                    assistance_details = table.Column<string>(type: "text", nullable: true),
                    activity = table.Column<string>(type: "text", nullable: true),
                    currency = table.Column<string>(type: "text", nullable: true),
                    currency_amount = table.Column<int>(type: "integer", nullable: false),
                    start_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    end_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    frequency = table.Column<string>(type: "text", nullable: true),
                    organization_id = table.Column<Guid>(type: "uuid", nullable: false),
                    list_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_beneficionary", x => x.id);
                    table.ForeignKey(
                        name: "fk_beneficionary_list_list_id",
                        column: x => x.list_id,
                        principalTable: "list",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_beneficionary_organization_organization_id",
                        column: x => x.organization_id,
                        principalTable: "organization",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
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

            migrationBuilder.CreateIndex(
                name: "ix_beneficionary_list_id",
                table: "beneficionary",
                column: "list_id");

            migrationBuilder.CreateIndex(
                name: "ix_beneficionary_organization_id",
                table: "beneficionary",
                column: "organization_id");

            migrationBuilder.CreateIndex(
                name: "ix_list_organization_id",
                table: "list",
                column: "organization_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "beneficionary");

            migrationBuilder.DropTable(
                name: "field_setting");

            migrationBuilder.DropTable(
                name: "list");
        }
    }
}
