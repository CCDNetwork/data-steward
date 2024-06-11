using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ccd.Server.Migrations
{
    /// <inheritdoc />
    public partial class NewRefferalFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "raion",
                table: "referral",
                newName: "tax_id");

            migrationBuilder.RenameColumn(
                name: "note",
                table: "referral",
                newName: "surname");

            migrationBuilder.RenameColumn(
                name: "method_of_contact",
                table: "referral",
                newName: "service_category");

            migrationBuilder.RenameColumn(
                name: "family_name",
                table: "referral",
                newName: "ryon");

            migrationBuilder.RenameColumn(
                name: "contact_details",
                table: "referral",
                newName: "restrictions");

            migrationBuilder.AlterColumn<bool>(
                name: "consent",
                table: "referral",
                type: "boolean",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AddColumn<string>(
                name: "address",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "caregiver",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "caregiver_contact_preference",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "caregiver_email",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "caregiver_explanation",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "caregiver_note",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "caregiver_phone",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "contact_preference",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "date_of_birth",
                table: "referral",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "displacement_status",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "email",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "gender",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "household_monthly_income",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "household_size",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "households_vulnerability_criteria",
                table: "referral",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_caregiver_informed",
                table: "referral",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_separated",
                table: "referral",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_urgent",
                table: "referral",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "need_for_service",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "patronymic_name",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "phone",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "relationship_to_child",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "required",
                table: "referral",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<Guid>>(
                name: "subactivities",
                table: "referral",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "address",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "caregiver",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "caregiver_contact_preference",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "caregiver_email",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "caregiver_explanation",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "caregiver_note",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "caregiver_phone",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "contact_preference",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "date_of_birth",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "displacement_status",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "email",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "gender",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "household_monthly_income",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "household_size",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "households_vulnerability_criteria",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "is_caregiver_informed",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "is_separated",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "is_urgent",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "need_for_service",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "patronymic_name",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "phone",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "relationship_to_child",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "required",
                table: "referral");

            migrationBuilder.DropColumn(
                name: "subactivities",
                table: "referral");

            migrationBuilder.RenameColumn(
                name: "tax_id",
                table: "referral",
                newName: "raion");

            migrationBuilder.RenameColumn(
                name: "surname",
                table: "referral",
                newName: "note");

            migrationBuilder.RenameColumn(
                name: "service_category",
                table: "referral",
                newName: "method_of_contact");

            migrationBuilder.RenameColumn(
                name: "ryon",
                table: "referral",
                newName: "family_name");

            migrationBuilder.RenameColumn(
                name: "restrictions",
                table: "referral",
                newName: "contact_details");

            migrationBuilder.AlterColumn<bool>(
                name: "consent",
                table: "referral",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldNullable: true);
        }
    }
}
