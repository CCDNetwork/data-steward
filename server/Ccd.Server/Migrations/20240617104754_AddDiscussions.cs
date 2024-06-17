using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddDiscussions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "discussion",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    referral_id = table.Column<Guid>(type: "uuid", nullable: false),
                    text = table.Column<string>(type: "text", nullable: true),
                    is_bot = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp"),
                    user_created_id = table.Column<Guid>(type: "uuid", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp"),
                    user_updated_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_discussion", x => x.id);
                    table.ForeignKey(
                        name: "fk_discussion_referral_referral_id",
                        column: x => x.referral_id,
                        principalTable: "referral",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_discussion_user_user_created_id",
                        column: x => x.user_created_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_discussion_user_user_updated_id",
                        column: x => x.user_updated_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_discussion_referral_id",
                table: "discussion",
                column: "referral_id");

            migrationBuilder.CreateIndex(
                name: "ix_discussion_user_created_id",
                table: "discussion",
                column: "user_created_id");

            migrationBuilder.CreateIndex(
                name: "ix_discussion_user_updated_id",
                table: "discussion",
                column: "user_updated_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "discussion");
        }
    }
}
