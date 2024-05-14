using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddBenificinaryAttributeGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "beneficiary_attribute_group",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    order = table.Column<int>(type: "integer", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    organization_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_beneficiary_attribute_group", x => x.id);
                    table.ForeignKey(
                        name: "fk_beneficiary_attribute_group_organization_organization_id",
                        column: x => x.organization_id,
                        principalTable: "organization",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ba_bag",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    beneficiary_attribute_group_id = table.Column<Guid>(type: "uuid", nullable: false),
                    beneficiary_attribute_id = table.Column<int>(type: "integer", nullable: false),
                    organization_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_ba_bag", x => x.id);
                    table.ForeignKey(
                        name: "fk_ba_bag_beneficiary_attribute_beneficiary_attribute_id",
                        column: x => x.beneficiary_attribute_id,
                        principalTable: "beneficiary_attribute",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_ba_bag_beneficiary_attribute_group_beneficiary_attribute_gr~",
                        column: x => x.beneficiary_attribute_group_id,
                        principalTable: "beneficiary_attribute_group",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_ba_bag_organization_organization_id",
                        column: x => x.organization_id,
                        principalTable: "organization",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_ba_bag_beneficiary_attribute_group_id",
                table: "ba_bag",
                column: "beneficiary_attribute_group_id");

            migrationBuilder.CreateIndex(
                name: "ix_ba_bag_beneficiary_attribute_id",
                table: "ba_bag",
                column: "beneficiary_attribute_id");

            migrationBuilder.CreateIndex(
                name: "ix_ba_bag_organization_id",
                table: "ba_bag",
                column: "organization_id");

            migrationBuilder.CreateIndex(
                name: "ix_beneficiary_attribute_group_organization_id",
                table: "beneficiary_attribute_group",
                column: "organization_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ba_bag");

            migrationBuilder.DropTable(
                name: "beneficiary_attribute_group");
        }
    }
}
