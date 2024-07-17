using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddMatchedFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "duplicate_of_id",
                table: "beneficary_deduplication");

            migrationBuilder.DropColumn(
                name: "duplicate_of_id",
                table: "beneficary");

            migrationBuilder.AddColumn<List<Guid>>(
                name: "duplicate_of_ids",
                table: "beneficary_deduplication",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "matched_fields",
                table: "beneficary_deduplication",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<List<Guid>>(
                name: "duplicate_of_ids",
                table: "beneficary",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "matched_fields",
                table: "beneficary",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "duplicate_of_ids",
                table: "beneficary_deduplication");

            migrationBuilder.DropColumn(
                name: "matched_fields",
                table: "beneficary_deduplication");

            migrationBuilder.DropColumn(
                name: "duplicate_of_ids",
                table: "beneficary");

            migrationBuilder.DropColumn(
                name: "matched_fields",
                table: "beneficary");

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
    }
}
