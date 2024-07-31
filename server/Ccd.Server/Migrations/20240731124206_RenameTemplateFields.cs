using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class RenameTemplateFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "other_idtype",
                table: "template",
                newName: "other_id_type");

            migrationBuilder.RenameColumn(
                name: "other_idnumber",
                table: "template",
                newName: "other_id_number");

            migrationBuilder.RenameColumn(
                name: "gov_idtype",
                table: "template",
                newName: "gov_id_type");

            migrationBuilder.RenameColumn(
                name: "gov_idnumber",
                table: "template",
                newName: "gov_id_number");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "other_id_type",
                table: "template",
                newName: "other_idtype");

            migrationBuilder.RenameColumn(
                name: "other_id_number",
                table: "template",
                newName: "other_idnumber");

            migrationBuilder.RenameColumn(
                name: "gov_id_type",
                table: "template",
                newName: "gov_idtype");

            migrationBuilder.RenameColumn(
                name: "gov_id_number",
                table: "template",
                newName: "gov_idnumber");
        }
    }
}
