﻿// <auto-generated />
using System;
using Ccd.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Ccd.Server.Migrations
{
    [DbContext(typeof(CcdContext))]
    partial class CcdContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Ccd.Server.BeneficiaryAttributes.BeneficiaryAttribute", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.Property<string>("Type")
                        .HasColumnType("text")
                        .HasColumnName("type");

                    b.Property<bool>("UsedForDeduplication")
                        .HasColumnType("boolean")
                        .HasColumnName("used_for_deduplication");

                    b.HasKey("Id")
                        .HasName("pk_beneficiary_attribute");

                    b.ToTable("beneficiary_attribute");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "First Name",
                            Type = "string",
                            UsedForDeduplication = true
                        },
                        new
                        {
                            Id = 2,
                            Name = "Family Name",
                            Type = "string",
                            UsedForDeduplication = true
                        },
                        new
                        {
                            Id = 3,
                            Name = "Gender",
                            Type = "string",
                            UsedForDeduplication = false
                        },
                        new
                        {
                            Id = 4,
                            Name = "Date of Birth",
                            Type = "DateTime",
                            UsedForDeduplication = false
                        },
                        new
                        {
                            Id = 5,
                            Name = "Community ID",
                            Type = "string",
                            UsedForDeduplication = false
                        },
                        new
                        {
                            Id = 6,
                            Name = "HH ID",
                            Type = "string",
                            UsedForDeduplication = false
                        },
                        new
                        {
                            Id = 7,
                            Name = "Mobile Phone ID",
                            Type = "int",
                            UsedForDeduplication = false
                        },
                        new
                        {
                            Id = 8,
                            Name = "Gov ID Type",
                            Type = "string",
                            UsedForDeduplication = false
                        },
                        new
                        {
                            Id = 9,
                            Name = "Gov ID Number",
                            Type = "string",
                            UsedForDeduplication = false
                        },
                        new
                        {
                            Id = 10,
                            Name = "Other ID Type",
                            Type = "string",
                            UsedForDeduplication = false
                        },
                        new
                        {
                            Id = 11,
                            Name = "Other ID Number",
                            Type = "string",
                            UsedForDeduplication = false
                        },
                        new
                        {
                            Id = 12,
                            Name = "Assistance Details",
                            Type = "string",
                            UsedForDeduplication = false
                        },
                        new
                        {
                            Id = 13,
                            Name = "Activity",
                            Type = "string",
                            UsedForDeduplication = false
                        },
                        new
                        {
                            Id = 14,
                            Name = "Currency",
                            Type = "string",
                            UsedForDeduplication = false
                        },
                        new
                        {
                            Id = 15,
                            Name = "Currency Amount",
                            Type = "int",
                            UsedForDeduplication = false
                        },
                        new
                        {
                            Id = 16,
                            Name = "Start Date",
                            Type = "DateTime",
                            UsedForDeduplication = false
                        },
                        new
                        {
                            Id = 17,
                            Name = "End Date",
                            Type = "DateTime",
                            UsedForDeduplication = false
                        },
                        new
                        {
                            Id = 18,
                            Name = "Frequency",
                            Type = "string",
                            UsedForDeduplication = false
                        });
                });

            modelBuilder.Entity("Ccd.Server.Deduplication.Beneficionary", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<string>("Activity")
                        .HasColumnType("text")
                        .HasColumnName("activity");

                    b.Property<string>("AssistanceDetails")
                        .HasColumnType("text")
                        .HasColumnName("assistance_details");

                    b.Property<string>("CommunityId")
                        .HasColumnType("text")
                        .HasColumnName("community_id");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at")
                        .HasDefaultValueSql("current_timestamp");

                    b.Property<string>("Currency")
                        .HasColumnType("text")
                        .HasColumnName("currency");

                    b.Property<int>("CurrencyAmount")
                        .HasColumnType("integer")
                        .HasColumnName("currency_amount");

                    b.Property<DateTime?>("DateOfBirth")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("date_of_birth");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("end_date");

                    b.Property<string>("FamilyName")
                        .HasColumnType("text")
                        .HasColumnName("family_name");

                    b.Property<string>("FirstName")
                        .HasColumnType("text")
                        .HasColumnName("first_name");

                    b.Property<string>("Frequency")
                        .HasColumnType("text")
                        .HasColumnName("frequency");

                    b.Property<string>("Gender")
                        .HasColumnType("text")
                        .HasColumnName("gender");

                    b.Property<string>("GovIdNumber")
                        .HasColumnType("text")
                        .HasColumnName("gov_id_number");

                    b.Property<string>("GovIdType")
                        .HasColumnType("text")
                        .HasColumnName("gov_id_type");

                    b.Property<string>("HhId")
                        .HasColumnType("text")
                        .HasColumnName("hh_id");

                    b.Property<Guid>("ListId")
                        .HasColumnType("uuid")
                        .HasColumnName("list_id");

                    b.Property<int?>("MobilePhoneId")
                        .HasColumnType("integer")
                        .HasColumnName("mobile_phone_id");

                    b.Property<Guid>("OrganizationId")
                        .HasColumnType("uuid")
                        .HasColumnName("organization_id");

                    b.Property<string>("OtherIdNumber")
                        .HasColumnType("text")
                        .HasColumnName("other_id_number");

                    b.Property<string>("OtherIdType")
                        .HasColumnType("text")
                        .HasColumnName("other_id_type");

                    b.Property<DateTime?>("StartDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("start_date");

                    b.Property<DateTime>("UpdatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at")
                        .HasDefaultValueSql("current_timestamp");

                    b.HasKey("Id")
                        .HasName("pk_beneficionary");

                    b.HasIndex("ListId")
                        .HasDatabaseName("ix_beneficionary_list_id");

                    b.HasIndex("OrganizationId")
                        .HasDatabaseName("ix_beneficionary_organization_id");

                    b.ToTable("beneficionary");
                });

            modelBuilder.Entity("Ccd.Server.Deduplication.List", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at")
                        .HasDefaultValueSql("current_timestamp");

                    b.Property<string>("FileName")
                        .HasColumnType("text")
                        .HasColumnName("file_name");

                    b.Property<Guid>("OrganizationId")
                        .HasColumnType("uuid")
                        .HasColumnName("organization_id");

                    b.Property<DateTime>("UpdatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at")
                        .HasDefaultValueSql("current_timestamp");

                    b.HasKey("Id")
                        .HasName("pk_list");

                    b.HasIndex("OrganizationId")
                        .HasDatabaseName("ix_list_organization_id");

                    b.ToTable("list");
                });

            modelBuilder.Entity("Ccd.Server.Organizations.Organization", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at")
                        .HasDefaultValueSql("current_timestamp");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.Property<DateTime>("UpdatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at")
                        .HasDefaultValueSql("current_timestamp");

                    b.HasKey("Id")
                        .HasName("pk_organization");

                    b.ToTable("organization");
                });

            modelBuilder.Entity("Ccd.Server.Storage.File", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at")
                        .HasDefaultValueSql("current_timestamp");

                    b.Property<string>("FileName")
                        .HasColumnType("text")
                        .HasColumnName("file_name");

                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.Property<Guid>("OwnerId")
                        .HasColumnType("uuid")
                        .HasColumnName("owner_id");

                    b.Property<long>("Size")
                        .HasColumnType("bigint")
                        .HasColumnName("size");

                    b.Property<int>("StorageTypeId")
                        .HasColumnType("integer")
                        .HasColumnName("storage_type_id");

                    b.Property<DateTime>("UpdatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at")
                        .HasDefaultValueSql("current_timestamp");

                    b.Property<Guid>("UserCreatedId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_created_id");

                    b.Property<Guid>("UserUpdatedId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_updated_id");

                    b.HasKey("Id")
                        .HasName("pk_file");

                    b.HasIndex("OwnerId")
                        .HasDatabaseName("ix_file_owner_id");

                    b.HasIndex("UserCreatedId")
                        .HasDatabaseName("ix_file_user_created_id");

                    b.HasIndex("UserUpdatedId")
                        .HasDatabaseName("ix_file_user_updated_id");

                    b.ToTable("file");
                });

            modelBuilder.Entity("Ccd.Server.Users.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime?>("ActivatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("activated_at");

                    b.Property<string>("ActivationCode")
                        .HasColumnType("text")
                        .HasColumnName("activation_code");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at")
                        .HasDefaultValueSql("current_timestamp");

                    b.Property<string>("Email")
                        .HasColumnType("text")
                        .HasColumnName("email");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("first_name");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("boolean")
                        .HasColumnName("is_deleted");

                    b.Property<string>("Language")
                        .HasColumnType("text")
                        .HasColumnName("language");

                    b.Property<string>("LastName")
                        .HasColumnType("text")
                        .HasColumnName("last_name");

                    b.Property<string>("Password")
                        .HasColumnType("text")
                        .HasColumnName("password");

                    b.Property<string>("PasswordResetCode")
                        .HasColumnType("text")
                        .HasColumnName("password_reset_code");

                    b.Property<DateTime>("UpdatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("updated_at")
                        .HasDefaultValueSql("current_timestamp");

                    b.HasKey("Id")
                        .HasName("pk_user");

                    b.ToTable("user");
                });

            modelBuilder.Entity("Ccd.Server.Users.UserOrganization", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<Guid>("OrganizationId")
                        .HasColumnType("uuid")
                        .HasColumnName("organization_id");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("role");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_id");

                    b.HasKey("Id")
                        .HasName("pk_user_organization");

                    b.HasIndex("OrganizationId")
                        .HasDatabaseName("ix_user_organization_organization_id");

                    b.HasIndex("UserId")
                        .HasDatabaseName("ix_user_organization_user_id");

                    b.ToTable("user_organization");
                });

            modelBuilder.Entity("Ccd.Server.Deduplication.Beneficionary", b =>
                {
                    b.HasOne("Ccd.Server.Deduplication.List", "List")
                        .WithMany()
                        .HasForeignKey("ListId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired()
                        .HasConstraintName("fk_beneficionary_list_list_id");

                    b.HasOne("Ccd.Server.Organizations.Organization", "Organization")
                        .WithMany()
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired()
                        .HasConstraintName("fk_beneficionary_organization_organization_id");

                    b.Navigation("List");

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("Ccd.Server.Deduplication.List", b =>
                {
                    b.HasOne("Ccd.Server.Organizations.Organization", "Organization")
                        .WithMany()
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired()
                        .HasConstraintName("fk_list_organization_organization_id");

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("Ccd.Server.Storage.File", b =>
                {
                    b.HasOne("Ccd.Server.Users.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired()
                        .HasConstraintName("fk_file_user_owner_id");

                    b.HasOne("Ccd.Server.Users.User", "UserCreated")
                        .WithMany()
                        .HasForeignKey("UserCreatedId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired()
                        .HasConstraintName("fk_file_user_user_created_id");

                    b.HasOne("Ccd.Server.Users.User", "UserUpdated")
                        .WithMany()
                        .HasForeignKey("UserUpdatedId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired()
                        .HasConstraintName("fk_file_user_user_updated_id");

                    b.Navigation("Owner");

                    b.Navigation("UserCreated");

                    b.Navigation("UserUpdated");
                });

            modelBuilder.Entity("Ccd.Server.Users.UserOrganization", b =>
                {
                    b.HasOne("Ccd.Server.Organizations.Organization", "Organization")
                        .WithMany()
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired()
                        .HasConstraintName("fk_user_organization_organization_organization_id");

                    b.HasOne("Ccd.Server.Users.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired()
                        .HasConstraintName("fk_user_organization_user_user_id");

                    b.Navigation("Organization");

                    b.Navigation("User");
                });
#pragma warning restore 612, 618
        }
    }
}
