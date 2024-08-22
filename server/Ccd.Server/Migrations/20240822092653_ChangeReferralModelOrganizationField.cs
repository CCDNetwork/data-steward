using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeReferralModelOrganizationField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_referral_organization_organization_referred_to_id",
                table: "referral");

            migrationBuilder.AlterColumn<Guid>(
                name: "organization_referred_to_id",
                table: "referral",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "fk_referral_organization_organization_referred_to_id",
                table: "referral",
                column: "organization_referred_to_id",
                principalTable: "organization",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_referral_organization_organization_referred_to_id",
                table: "referral");

            migrationBuilder.AlterColumn<Guid>(
                name: "organization_referred_to_id",
                table: "referral",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "fk_referral_organization_organization_referred_to_id",
                table: "referral",
                column: "organization_referred_to_id",
                principalTable: "organization",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
