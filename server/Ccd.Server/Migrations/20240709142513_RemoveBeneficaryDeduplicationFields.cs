using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveBeneficaryDeduplicationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_same_organization_duplicate",
                table: "beneficary_deduplication");

            migrationBuilder.DropColumn(
                name: "is_system_wide_duplicate",
                table: "beneficary_deduplication");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_same_organization_duplicate",
                table: "beneficary_deduplication",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_system_wide_duplicate",
                table: "beneficary_deduplication",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
