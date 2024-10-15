using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddPathFieldToAdministrativeRegion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "path",
                table: "administrative_region",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "path",
                table: "administrative_region");
        }
    }
}
