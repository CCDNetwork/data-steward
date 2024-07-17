using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddUploadedBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "uploaded_by_id",
                table: "beneficary_deduplication",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "uploaded_by_id",
                table: "beneficary",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_beneficary_deduplication_uploaded_by_id",
                table: "beneficary_deduplication",
                column: "uploaded_by_id");

            migrationBuilder.CreateIndex(
                name: "ix_beneficary_uploaded_by_id",
                table: "beneficary",
                column: "uploaded_by_id");

            migrationBuilder.AddForeignKey(
                name: "fk_beneficary_user_uploaded_by_id",
                table: "beneficary",
                column: "uploaded_by_id",
                principalTable: "user",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_beneficary_deduplication_user_uploaded_by_id",
                table: "beneficary_deduplication",
                column: "uploaded_by_id",
                principalTable: "user",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_beneficary_user_uploaded_by_id",
                table: "beneficary");

            migrationBuilder.DropForeignKey(
                name: "fk_beneficary_deduplication_user_uploaded_by_id",
                table: "beneficary_deduplication");

            migrationBuilder.DropIndex(
                name: "ix_beneficary_deduplication_uploaded_by_id",
                table: "beneficary_deduplication");

            migrationBuilder.DropIndex(
                name: "ix_beneficary_uploaded_by_id",
                table: "beneficary");

            migrationBuilder.DropColumn(
                name: "uploaded_by_id",
                table: "beneficary_deduplication");

            migrationBuilder.DropColumn(
                name: "uploaded_by_id",
                table: "beneficary");
        }
    }
}
