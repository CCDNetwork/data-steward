using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddAllOtherFieldsToReferrals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "title",
                table: "referral",
                newName: "settlement");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "referral",
                newName: "raion");

            migrationBuilder.AddColumn<bool>(
                name: "consent",
                table: "referral",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "contact_details",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "family_name",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "first_name",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "focal_point",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "hromada",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "method_of_contact",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "note",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "oblast",
                table: "referral",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "consent",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "contact_details",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "family_name",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "first_name",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "focal_point",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "hromada",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "method_of_contact",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "note",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "oblast",
                table: "referral");

            migrationBuilder.RenameColumn(
                name: "settlement",
                table: "referral",
                newName: "title");

            migrationBuilder.RenameColumn(
                name: "raion",
                table: "referral",
                newName: "description");
        }
    }
}
