using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddReferralsFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "date_of_birth",
                table: "referral");

            migrationBuilder.RenameColumn(
                name: "last_name",
                table: "referral",
                newName: "title");

            migrationBuilder.RenameColumn(
                name: "first_name",
                table: "referral",
                newName: "description");

            migrationBuilder.AddColumn<Guid>(
                name: "file_id",
                table: "referral",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_draft",
                table: "referral",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "ix_referral_file_id",
                table: "referral",
                column: "file_id");

            migrationBuilder.AddForeignKey(
                name: "fk_referral_file_file_id",
                table: "referral",
                column: "file_id",
                principalTable: "file",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_referral_file_file_id",
                table: "referral");

            migrationBuilder.DropIndex(
                name: "ix_referral_file_id",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "file_id",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "is_draft",
                table: "referral");

            migrationBuilder.RenameColumn(
                name: "title",
                table: "referral",
                newName: "last_name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "referral",
                newName: "first_name");

            migrationBuilder.AddColumn<DateTime>(
                name: "date_of_birth",
                table: "referral",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
