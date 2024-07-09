using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddBeneficaryDeduplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "beneficary_deduplication",
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
                    is_same_organization_duplicate = table.Column<bool>(type: "boolean", nullable: false),
                    is_system_wide_duplicate = table.Column<bool>(type: "boolean", nullable: false),
                    file_id = table.Column<Guid>(type: "uuid", nullable: false),
                    organization_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_beneficary_deduplication", x => x.id);
                    table.ForeignKey(
                        name: "fk_beneficary_deduplication_file_file_id",
                        column: x => x.file_id,
                        principalTable: "file",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_beneficary_deduplication_organization_organization_id",
                        column: x => x.organization_id,
                        principalTable: "organization",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_beneficary_deduplication_file_id",
                table: "beneficary_deduplication",
                column: "file_id");

            migrationBuilder.CreateIndex(
                name: "ix_beneficary_deduplication_organization_id",
                table: "beneficary_deduplication",
                column: "organization_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "beneficary_deduplication");
        }
    }
}
