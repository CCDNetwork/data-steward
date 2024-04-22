using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddReferrals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "referral",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    first_name = table.Column<string>(type: "text", nullable: true),
                    last_name = table.Column<string>(type: "text", nullable: true),
                    organization_created_id = table.Column<Guid>(type: "uuid", nullable: false),
                    organization_referred_to_id = table.Column<Guid>(type: "uuid", nullable: false),
                    status = table.Column<string>(type: "text", nullable: true),
                    date_of_birth = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp"),
                    user_created_id = table.Column<Guid>(type: "uuid", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp"),
                    user_updated_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_referral", x => x.id);
                    table.ForeignKey(
                        name: "fk_referral_organization_organization_created_id",
                        column: x => x.organization_created_id,
                        principalTable: "organization",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_referral_organization_organization_referred_to_id",
                        column: x => x.organization_referred_to_id,
                        principalTable: "organization",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_referral_user_user_created_id",
                        column: x => x.user_created_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_referral_user_user_updated_id",
                        column: x => x.user_updated_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_referral_organization_created_id",
                table: "referral",
                column: "organization_created_id");

            migrationBuilder.CreateIndex(
                name: "ix_referral_organization_referred_to_id",
                table: "referral",
                column: "organization_referred_to_id");

            migrationBuilder.CreateIndex(
                name: "ix_referral_user_created_id",
                table: "referral",
                column: "user_created_id");

            migrationBuilder.CreateIndex(
                name: "ix_referral_user_updated_id",
                table: "referral",
                column: "user_updated_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "referral");
        }
    }
}
