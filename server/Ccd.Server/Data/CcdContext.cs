using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Ccd.Server.Users;
using Ccd.Server.Storage;
using Ccd.Server.Organizations;
using Ccd.Server.Deduplication;
using Ccd.Server.BeneficiaryAttributes;

namespace Ccd.Server.Data;

public class CcdContext : DbContext
{
    private readonly DbUserTrackingService _dbUserTrackingService;

    public static readonly ILoggerFactory MyLoggerFactory = LoggerFactory.Create(builder => { builder.AddConsole(); });

    public CcdContext(
        DbContextOptions<CcdContext> options,
        DbUserTrackingService dbUserTrackingService
    )
        : base(options)
    {
        _dbUserTrackingService = dbUserTrackingService;
    }

    public DbSet<User> Users { get; set; }
    public DbSet<File> Files { get; set; }
    public DbSet<Organization> Organizations { get; set; }
    public DbSet<UserOrganization> UserOrganizations { get; set; }
    public DbSet<Beneficionary> Beneficionary { get; set; }
    public DbSet<BeneficiaryAttribute> BeneficiaryAttributes { get; set; }
    public DbSet<List> List { get; set; }

    private void seedData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BeneficiaryAttribute>().HasData(
            new BeneficiaryAttribute { Id = 1, Name = "First Name", Type = "string", UsedForDeduplication = true },
            new BeneficiaryAttribute { Id = 2, Name = "Family Name", Type = "string", UsedForDeduplication = true },
            new BeneficiaryAttribute { Id = 3, Name = "Gender", Type = "string", UsedForDeduplication = false },
            new BeneficiaryAttribute { Id = 4, Name = "Date of Birth", Type = "DateTime", UsedForDeduplication = false },
            new BeneficiaryAttribute { Id = 5, Name = "Community ID", Type = "string", UsedForDeduplication = false },
            new BeneficiaryAttribute { Id = 6, Name = "HH ID", Type = "string", UsedForDeduplication = false },
            new BeneficiaryAttribute { Id = 7, Name = "Mobile Phone ID", Type = "int", UsedForDeduplication = false },
            new BeneficiaryAttribute { Id = 8, Name = "Gov ID Type", Type = "string", UsedForDeduplication = false },
            new BeneficiaryAttribute { Id = 9, Name = "Gov ID Number", Type = "string", UsedForDeduplication = false },
            new BeneficiaryAttribute { Id = 10, Name = "Other ID Type", Type = "string", UsedForDeduplication = false },
            new BeneficiaryAttribute { Id = 11, Name = "Other ID Number", Type = "string", UsedForDeduplication = false },
            new BeneficiaryAttribute { Id = 12, Name = "Assistance Details", Type = "string", UsedForDeduplication = false },
            new BeneficiaryAttribute { Id = 13, Name = "Activity", Type = "string", UsedForDeduplication = false },
            new BeneficiaryAttribute { Id = 14, Name = "Currency", Type = "string", UsedForDeduplication = false },
            new BeneficiaryAttribute { Id = 15, Name = "Currency Amount", Type = "int", UsedForDeduplication = false },
            new BeneficiaryAttribute { Id = 16, Name = "Start Date", Type = "DateTime", UsedForDeduplication = false },
            new BeneficiaryAttribute { Id = 17, Name = "End Date", Type = "DateTime", UsedForDeduplication = false },
            new BeneficiaryAttribute { Id = 18, Name = "Frequency", Type = "string", UsedForDeduplication = false }
        );
    }

    private void disableCascadeDeletes(ModelBuilder modelBuilder)
    {
        var cascadeFKs = modelBuilder.Model
            .GetEntityTypes()
            .SelectMany(t => t.GetForeignKeys())
            .Where(fk => !fk.IsOwnership && fk.DeleteBehavior == DeleteBehavior.Cascade);

        foreach (var fk in cascadeFKs)
            fk.DeleteBehavior = DeleteBehavior.Restrict;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        DbFormatter.SetDefaultValues(modelBuilder);
        DbFormatter.FormatTableNames(modelBuilder);
        DbFormatter.FormatColumnsSnakeCase(modelBuilder);

        disableCascadeDeletes(modelBuilder);
        seedData(modelBuilder);
    }

    public override int SaveChanges()
    {
        SoftDelete.ProcessSoftDeletedItems(ChangeTracker);

        // this will be null while seeding data and creating initial organization users
        if (_dbUserTrackingService != null)
        {
            UserChangeTracker.ProcessUserChangeTrackedItems(
                ChangeTracker,
                _dbUserTrackingService.GetCurrentUserId(User.SYSTEM_USER.Id)
            );
        }

        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default(CancellationToken)
    )
    {
        SoftDelete.ProcessSoftDeletedItems(ChangeTracker);

        // this will be null while seeding data and creating initial organization users
        if (_dbUserTrackingService != null)
        {
            UserChangeTracker.ProcessUserChangeTrackedItems(
                ChangeTracker,
                _dbUserTrackingService.GetCurrentUserId(User.SYSTEM_USER.Id)
            );
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}