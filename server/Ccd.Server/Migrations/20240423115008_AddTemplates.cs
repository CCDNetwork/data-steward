using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddTemplates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "template",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    first_name = table.Column<string>(type: "text", nullable: true),
                    family_name = table.Column<string>(type: "text", nullable: true),
                    gender = table.Column<string>(type: "text", nullable: true),
                    dateof_birth = table.Column<string>(type: "text", nullable: true),
                    community_id = table.Column<string>(type: "text", nullable: true),
                    hhid = table.Column<string>(type: "text", nullable: true),
                    mobile_phone_id = table.Column<string>(type: "text", nullable: true),
                    gov_idtype = table.Column<string>(type: "text", nullable: true),
                    gov_idnumber = table.Column<string>(type: "text", nullable: true),
                    other_idtype = table.Column<string>(type: "text", nullable: true),
                    other_idnumber = table.Column<string>(type: "text", nullable: true),
                    assistance_details = table.Column<string>(type: "text", nullable: true),
                    activity = table.Column<string>(type: "text", nullable: true),
                    currency = table.Column<string>(type: "text", nullable: true),
                    currency_amount = table.Column<string>(type: "text", nullable: true),
                    start_date = table.Column<string>(type: "text", nullable: true),
                    end_date = table.Column<string>(type: "text", nullable: true),
                    frequency = table.Column<string>(type: "text", nullable: true),
                    organization_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp"),
                    user_created_id = table.Column<Guid>(type: "uuid", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp"),
                    user_updated_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_template", x => x.id);
                    table.ForeignKey(
                        name: "fk_template_organization_organization_id",
                        column: x => x.organization_id,
                        principalTable: "organization",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_template_user_user_created_id",
                        column: x => x.user_created_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_template_user_user_updated_id",
                        column: x => x.user_updated_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_template_organization_id",
                table: "template",
                column: "organization_id");

            migrationBuilder.CreateIndex(
                name: "ix_template_user_created_id",
                table: "template",
                column: "user_created_id");

            migrationBuilder.CreateIndex(
                name: "ix_template_user_updated_id",
                table: "template",
                column: "user_updated_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "template");
        }
    }
}
