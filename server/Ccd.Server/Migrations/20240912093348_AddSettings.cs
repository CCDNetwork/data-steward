using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "settings",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    deployment_country = table.Column<string>(type: "text", nullable: true),
                    deployment_name = table.Column<string>(type: "text", nullable: true),
                    admin_level1_name = table.Column<string>(type: "text", nullable: true),
                    admin_level2_name = table.Column<string>(type: "text", nullable: true),
                    admin_level3_name = table.Column<string>(type: "text", nullable: true),
                    admin_level4_name = table.Column<string>(type: "text", nullable: true),
                    metabase_url = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp"),
                    user_created_id = table.Column<Guid>(type: "uuid", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp"),
                    user_updated_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_settings", x => x.id);
                    table.ForeignKey(
                        name: "fk_settings_user_user_created_id",
                        column: x => x.user_created_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_settings_user_user_updated_id",
                        column: x => x.user_updated_id,
                        principalTable: "user",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "user",
                columns: new[] { "id", "activated_at", "activation_code", "created_at", "email", "first_name", "is_deleted", "language", "last_name", "password", "password_reset_code", "updated_at" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000001"), new DateTime(2022, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2022, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@ccd.org", "System", false, "en", "", "", null, new DateTime(2022, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.InsertData(
                table: "settings",
                columns: new[] { "id", "admin_level1_name", "admin_level2_name", "admin_level3_name", "admin_level4_name", "deployment_country", "deployment_name", "metabase_url", "user_created_id", "user_updated_id" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000001"), "AdminLevel1", "AdminLevel2", "AdminLevel3", "AdminLevel4", "Country", "CCD Data Portal", "https://default.metabase.url", new Guid("00000000-0000-0000-0000-000000000001"), new Guid("00000000-0000-0000-0000-000000000001") });

            migrationBuilder.CreateIndex(
                name: "ix_settings_user_created_id",
                table: "settings",
                column: "user_created_id");

            migrationBuilder.CreateIndex(
                name: "ix_settings_user_updated_id",
                table: "settings",
                column: "user_updated_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "settings");

            migrationBuilder.DeleteData(
                table: "user",
                keyColumn: "id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"));
        }
    }
}
