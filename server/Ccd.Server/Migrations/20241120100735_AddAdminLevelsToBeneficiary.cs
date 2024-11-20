using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminLevelsToBeneficiary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "admin_level1",
                table: "beneficary_deduplication",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "admin_level2",
                table: "beneficary_deduplication",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "admin_level3",
                table: "beneficary_deduplication",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "admin_level4",
                table: "beneficary_deduplication",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "admin_level1",
                table: "beneficary",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "admin_level2",
                table: "beneficary",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "admin_level3",
                table: "beneficary",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "admin_level4",
                table: "beneficary",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "settings",
                keyColumn: "id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "funding_sources",
                value: new List<string> { "BHA", "Other" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "admin_level1",
                table: "beneficary_deduplication");

            migrationBuilder.DropColumn(
                name: "admin_level2",
                table: "beneficary_deduplication");

            migrationBuilder.DropColumn(
                name: "admin_level3",
                table: "beneficary_deduplication");

            migrationBuilder.DropColumn(
                name: "admin_level4",
                table: "beneficary_deduplication");

            migrationBuilder.DropColumn(
                name: "admin_level1",
                table: "beneficary");

            migrationBuilder.DropColumn(
                name: "admin_level2",
                table: "beneficary");

            migrationBuilder.DropColumn(
                name: "admin_level3",
                table: "beneficary");

            migrationBuilder.DropColumn(
                name: "admin_level4",
                table: "beneficary");

            migrationBuilder.UpdateData(
                table: "settings",
                keyColumn: "id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "funding_sources",
                value: new List<string> { "BHA", "Other" });
        }
    }
}
