using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddBenificinaryListNewFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "list",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "current_timestamp");

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "list",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "current_timestamp");

            migrationBuilder.AlterColumn<DateTime>(
                name: "start_date",
                table: "beneficionary",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<int>(
                name: "mobile_phone_id",
                table: "beneficionary",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<DateTime>(
                name: "end_date",
                table: "beneficionary",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "date_of_birth",
                table: "beneficionary",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "beneficionary",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "current_timestamp");

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "beneficionary",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "current_timestamp");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "created_at",
                table: "list");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "list");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "beneficionary");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "beneficionary");

            migrationBuilder.AlterColumn<DateTime>(
                name: "start_date",
                table: "beneficionary",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "mobile_phone_id",
                table: "beneficionary",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "end_date",
                table: "beneficionary",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "date_of_birth",
                table: "beneficionary",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);
        }
    }
}
