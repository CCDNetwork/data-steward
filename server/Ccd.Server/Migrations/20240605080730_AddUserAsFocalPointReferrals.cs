using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddUserAsFocalPointReferrals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "focal_point",
                table: "referral");

            migrationBuilder.AddColumn<Guid>(
                name: "focal_point_id",
                table: "referral",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_referral_focal_point_id",
                table: "referral",
                column: "focal_point_id");

            migrationBuilder.AddForeignKey(
                name: "fk_referral_user_focal_point_id",
                table: "referral",
                column: "focal_point_id",
                principalTable: "user",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_referral_user_focal_point_id",
                table: "referral");

            migrationBuilder.DropIndex(
                name: "ix_referral_focal_point_id",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "focal_point_id",
                table: "referral");

            migrationBuilder.AddColumn<string>(
                name: "focal_point",
                table: "referral",
                type: "text",
                nullable: true);
        }
    }
}
