using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Ccd.Server.Data;

public class SoftDelete
{
    public static void ProcessSoftDeletedItems(ChangeTracker changeTracker)
    {
        changeTracker.DetectChanges();

        var markedAsDeleted = changeTracker.Entries().Where(x => x.State == EntityState.Deleted);

        foreach (var item in markedAsDeleted)
        {
            if (item.Entity is IIsDeleted entity)
            {
                item.State = EntityState.Unchanged;
                entity.IsDeleted = true;
            }
        }
    }
}
