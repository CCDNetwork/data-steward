using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddBeneficaryDeduplicationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_organization_duplicate",
                table: "beneficary_deduplication",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_system_duplicate",
                table: "beneficary_deduplication",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "marked_for_import",
                table: "beneficary_deduplication",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_organization_duplicate",
                table: "beneficary_deduplication");

            migrationBuilder.DropColumn(
                name: "is_system_duplicate",
                table: "beneficary_deduplication");

            migrationBuilder.DropColumn(
                name: "marked_for_import",
                table: "beneficary_deduplication");
        }
    }
}
