using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class RenameDateofBirthToDateOfBirth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "dateof_birth",
                table: "template",
                newName: "date_of_birth");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "date_of_birth",
                table: "template",
                newName: "dateof_birth");
        }
    }
}
