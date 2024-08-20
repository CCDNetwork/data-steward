using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddIsRejectedFieldToReferralsAndUpdateExistingStatuses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_rejected",
                table: "referral",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.Sql("update referral set status = 'submission' where status = 'open';");

            migrationBuilder.Sql("update referral set status = 'enrolment' where status = 'enrolled';");

            migrationBuilder.Sql("update referral set status = 'evaluation' where status = 'inEvaluation';");

            migrationBuilder.Sql("update referral set status = 'submission', is_rejected = true where status = 'rejected';");

            migrationBuilder.Sql("update referral set status = 'submission', is_draft = true where status = 'withdrawn';");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_rejected",
                table: "referral");
        }
    }
}
