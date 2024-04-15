using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddUserTrackingToList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "user_created_id",
                table: "list",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_list_user_created_id",
                table: "list",
                column: "user_created_id");

            migrationBuilder.AddForeignKey(
                name: "fk_list_user_user_created_id",
                table: "list",
                column: "user_created_id",
                principalTable: "user",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_list_user_user_created_id",
                table: "list");

            migrationBuilder.DropIndex(
                name: "ix_list_user_created_id",
                table: "list");

            migrationBuilder.DropColumn(
                name: "user_created_id",
                table: "list");
        }
    }
}
