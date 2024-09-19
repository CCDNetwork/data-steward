using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddAdministrativeRegionsToReferrals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "administrative_region1_id",
                table: "referral",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "administrative_region2_id",
                table: "referral",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "administrative_region3_id",
                table: "referral",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "administrative_region4_id",
                table: "referral",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_referral_administrative_region1_id",
                table: "referral",
                column: "administrative_region1_id");

            migrationBuilder.CreateIndex(
                name: "ix_referral_administrative_region2_id",
                table: "referral",
                column: "administrative_region2_id");

            migrationBuilder.CreateIndex(
                name: "ix_referral_administrative_region3_id",
                table: "referral",
                column: "administrative_region3_id");

            migrationBuilder.CreateIndex(
                name: "ix_referral_administrative_region4_id",
                table: "referral",
                column: "administrative_region4_id");

            migrationBuilder.AddForeignKey(
                name: "fk_referral_administrative_region_administrative_region1_id",
                table: "referral",
                column: "administrative_region1_id",
                principalTable: "administrative_region",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_referral_administrative_region_administrative_region2_id",
                table: "referral",
                column: "administrative_region2_id",
                principalTable: "administrative_region",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_referral_administrative_region_administrative_region3_id",
                table: "referral",
                column: "administrative_region3_id",
                principalTable: "administrative_region",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_referral_administrative_region_administrative_region4_id",
                table: "referral",
                column: "administrative_region4_id",
                principalTable: "administrative_region",
                principalColumn: "id");
            
            migrationBuilder.Sql("update referral set administrative_region1_id = (select id from administrative_region where level=1 and name=referral.oblast limit 1);");
            migrationBuilder.Sql("update referral set administrative_region2_id = (select id from administrative_region where level=2 and name=referral.ryon limit 1);");
            migrationBuilder.Sql("update referral set administrative_region3_id = (select id from administrative_region where level=3 and name=referral.hromada limit 1);");
            migrationBuilder.Sql("update referral set administrative_region4_id = (select id from administrative_region where level=4 and name=referral.settlement limit 1);");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_referral_administrative_region_administrative_region1_id",
                table: "referral");

            migrationBuilder.DropForeignKey(
                name: "fk_referral_administrative_region_administrative_region2_id",
                table: "referral");

            migrationBuilder.DropForeignKey(
                name: "fk_referral_administrative_region_administrative_region3_id",
                table: "referral");

            migrationBuilder.DropForeignKey(
                name: "fk_referral_administrative_region_administrative_region4_id",
                table: "referral");

            migrationBuilder.DropIndex(
                name: "ix_referral_administrative_region1_id",
                table: "referral");

            migrationBuilder.DropIndex(
                name: "ix_referral_administrative_region2_id",
                table: "referral");

            migrationBuilder.DropIndex(
                name: "ix_referral_administrative_region3_id",
                table: "referral");

            migrationBuilder.DropIndex(
                name: "ix_referral_administrative_region4_id",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "administrative_region1_id",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "administrative_region2_id",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "administrative_region3_id",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "administrative_region4_id",
                table: "referral");
        }
    }
}
