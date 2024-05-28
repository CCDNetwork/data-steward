using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveOrganizationIdFromAttributes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_ba_bag_organization_organization_id",
                table: "ba_bag");

            migrationBuilder.DropForeignKey(
                name: "fk_beneficiary_attribute_group_organization_organization_id",
                table: "beneficiary_attribute_group");

            migrationBuilder.DropIndex(
                name: "ix_beneficiary_attribute_group_organization_id",
                table: "beneficiary_attribute_group");

            migrationBuilder.DropIndex(
                name: "ix_ba_bag_organization_id",
                table: "ba_bag");

            migrationBuilder.DropColumn(
                name: "organization_id",
                table: "beneficiary_attribute_group");

            migrationBuilder.DropColumn(
                name: "organization_id",
                table: "ba_bag");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "organization_id",
                table: "beneficiary_attribute_group",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "organization_id",
                table: "ba_bag",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "ix_beneficiary_attribute_group_organization_id",
                table: "beneficiary_attribute_group",
                column: "organization_id");

            migrationBuilder.CreateIndex(
                name: "ix_ba_bag_organization_id",
                table: "ba_bag",
                column: "organization_id");

            migrationBuilder.AddForeignKey(
                name: "fk_ba_bag_organization_organization_id",
                table: "ba_bag",
                column: "organization_id",
                principalTable: "organization",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_beneficiary_attribute_group_organization_organization_id",
                table: "beneficiary_attribute_group",
                column: "organization_id",
                principalTable: "organization",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
