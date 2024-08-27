using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeReferralStatusNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("update referral set status = 'underReview' where status = 'submission';");

            migrationBuilder.Sql("update referral set status = 'delivered' where status = 'enrolment';");

            migrationBuilder.Sql("update referral set status = 'inAssessment' where status = 'evaluation';");

            migrationBuilder.Sql("update referral set status = 'registered' where status = 'acceptance';");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
