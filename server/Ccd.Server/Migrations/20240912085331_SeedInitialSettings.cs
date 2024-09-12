using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeedInitialSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "settings",
                columns: new[] { "id", "admin_level1_name", "admin_level2_name", "admin_level3_name", "admin_level4_name", "deployment_country", "deployment_name", "metabase_url", "updated_at" },
                values: new object[] { new Guid("eb320169-d505-409c-bba0-424b9bd85f34"), "AdminLevel1", "AdminLevel2", "AdminLevel3", "AdminLevel4", "Country", "CCD Data Portal", "https://default.metabase.url", new DateTime(2024, 9, 12, 8, 53, 30, 806, DateTimeKind.Utc).AddTicks(9530) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "settings",
                keyColumn: "id",
                keyValue: new Guid("eb320169-d505-409c-bba0-424b9bd85f34"));
        }
    }
}
