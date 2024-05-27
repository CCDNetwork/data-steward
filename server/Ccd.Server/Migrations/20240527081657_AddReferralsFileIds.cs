using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddReferralsFileIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<List<Guid>>(
                name: "file_ids",
                table: "referral",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "file_ids",
                table: "referral");

            migrationBuilder.AddColumn<Guid>(
                name: "file_id",
                table: "referral",
                type: "uuid",
                nullable: true);

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
    }
}
