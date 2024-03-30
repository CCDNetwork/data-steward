using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Ccd.Server.Users;
using Ccd.Server.Storage;
using Ccd.Server.Organizations;

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

    private void seedData(ModelBuilder modelBuilder)
    {
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