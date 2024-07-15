using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddDuplicateOfToBeneficiary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "duplicate_of_id",
                table: "beneficary_deduplication",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "duplicate_of_id",
                table: "beneficary",
                type: "uuid",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "duplicate_of_id",
                table: "beneficary_deduplication");

            migrationBuilder.DropColumn(
                name: "duplicate_of_id",
                table: "beneficary");
        }
    }
}
