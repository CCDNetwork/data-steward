using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class RenameBeneficionaryToBeneficary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "beneficionary");

            migrationBuilder.CreateTable(
                name: "beneficary",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    first_name = table.Column<string>(type: "text", nullable: true),
                    family_name = table.Column<string>(type: "text", nullable: true),
                    gender = table.Column<string>(type: "text", nullable: true),
                    date_of_birth = table.Column<string>(type: "text", nullable: true),
                    community_id = table.Column<string>(type: "text", nullable: true),
                    hh_id = table.Column<string>(type: "text", nullable: true),
                    mobile_phone_id = table.Column<string>(type: "text", nullable: true),
                    gov_id_type = table.Column<string>(type: "text", nullable: true),
                    gov_id_number = table.Column<string>(type: "text", nullable: true),
                    other_id_type = table.Column<string>(type: "text", nullable: true),
                    other_id_number = table.Column<string>(type: "text", nullable: true),
                    assistance_details = table.Column<string>(type: "text", nullable: true),
                    activity = table.Column<string>(type: "text", nullable: true),
                    currency = table.Column<string>(type: "text", nullable: true),
                    currency_amount = table.Column<string>(type: "text", nullable: true),
                    start_date = table.Column<string>(type: "text", nullable: true),
                    end_date = table.Column<string>(type: "text", nullable: true),
                    frequency = table.Column<string>(type: "text", nullable: true),
                    is_primary = table.Column<bool>(type: "boolean", nullable: false),
                    status = table.Column<string>(type: "text", nullable: true),
                    organization_id = table.Column<Guid>(type: "uuid", nullable: false),
                    list_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_beneficary", x => x.id);
                    table.ForeignKey(
                        name: "fk_beneficary_list_list_id",
                        column: x => x.list_id,
                        principalTable: "list",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_beneficary_organization_organization_id",
                        column: x => x.organization_id,
                        principalTable: "organization",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_beneficary_list_id",
                table: "beneficary",
                column: "list_id");

            migrationBuilder.CreateIndex(
                name: "ix_beneficary_organization_id",
                table: "beneficary",
                column: "organization_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "beneficary");

            migrationBuilder.CreateTable(
                name: "beneficionary",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    list_id = table.Column<Guid>(type: "uuid", nullable: false),
                    organization_id = table.Column<Guid>(type: "uuid", nullable: false),
                    activity = table.Column<string>(type: "text", nullable: true),
                    assistance_details = table.Column<string>(type: "text", nullable: true),
                    community_id = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp"),
                    currency = table.Column<string>(type: "text", nullable: true),
                    currency_amount = table.Column<string>(type: "text", nullable: true),
                    date_of_birth = table.Column<string>(type: "text", nullable: true),
                    end_date = table.Column<string>(type: "text", nullable: true),
                    family_name = table.Column<string>(type: "text", nullable: true),
                    first_name = table.Column<string>(type: "text", nullable: true),
                    frequency = table.Column<string>(type: "text", nullable: true),
                    gender = table.Column<string>(type: "text", nullable: true),
                    gov_id_number = table.Column<string>(type: "text", nullable: true),
                    gov_id_type = table.Column<string>(type: "text", nullable: true),
                    hh_id = table.Column<string>(type: "text", nullable: true),
                    is_primary = table.Column<bool>(type: "boolean", nullable: false),
                    mobile_phone_id = table.Column<string>(type: "text", nullable: true),
                    other_id_number = table.Column<string>(type: "text", nullable: true),
                    other_id_type = table.Column<string>(type: "text", nullable: true),
                    start_date = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<string>(type: "text", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_beneficionary", x => x.id);
                    table.ForeignKey(
                        name: "fk_beneficionary_list_list_id",
                        column: x => x.list_id,
                        principalTable: "list",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_beneficionary_organization_organization_id",
                        column: x => x.organization_id,
                        principalTable: "organization",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_beneficionary_list_id",
                table: "beneficionary",
                column: "list_id");

            migrationBuilder.CreateIndex(
                name: "ix_beneficionary_organization_id",
                table: "beneficionary",
                column: "organization_id");
        }
    }
}
