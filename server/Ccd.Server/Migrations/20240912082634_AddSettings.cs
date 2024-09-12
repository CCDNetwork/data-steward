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
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "current_timestamp")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_settings", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "settings");
        }
    }
}
