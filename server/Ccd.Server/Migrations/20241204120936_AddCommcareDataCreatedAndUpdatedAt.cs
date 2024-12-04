using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddCommcareDataCreatedAndUpdatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "commcare_data",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "current_timestamp");

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "commcare_data",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "current_timestamp");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "created_at",
                table: "commcare_data");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "commcare_data");
        }
    }
}
