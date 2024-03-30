using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Ccd.Server.Data;

public class DbFormatter
{
    public static void FormatColumnsSnakeCase(ModelBuilder modelBuilder)
    {
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            entity.SetTableName(entity.GetTableName().ToSnakeCase());

            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(
                    property
                        .GetColumnName(
                            StoreObjectIdentifier.Table(entity.GetTableName(), entity.GetSchema())
                        )
                        .ToSnakeCase()
                );
            }

            foreach (var key in entity.GetKeys())
            {
                key.SetName(key.GetName().ToSnakeCase());
            }

            foreach (var key in entity.GetForeignKeys())
            {
                key.SetConstraintName(key.GetConstraintName().ToSnakeCase());
            }

            foreach (var index in entity.GetIndexes())
            {
                index.SetDatabaseName(index.GetDatabaseName().ToSnakeCase());
            }
        }
    }

    public static void SetDefaultValues(ModelBuilder modelBuilder)
    {
        // set default value to current date for all created/updated fields
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entity.GetProperties())
            {
                if (
                    property.GetColumnName(
                        StoreObjectIdentifier.Table(entity.GetTableName(), entity.GetSchema())
                    ) == "CreatedAt"
                    || property.GetColumnName(
                        StoreObjectIdentifier.Table(entity.GetTableName(), entity.GetSchema())
                    ) == "UpdatedAt"
                )
                {
                    property.SetDefaultValueSql("current_timestamp");
                }
            }
        }
    }

    public static void FormatTableNames(ModelBuilder modelBuilder)
    {
        // in singular, snake cased
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            entityType.SetTableName(entityType.DisplayName().ToSnakeCase());
        }
    }

    // used for JSON column filtering
    public static string FormatNumberOrQuotedString(string value)
    {
        if (value.All(char.IsDigit))
            return value;

        return "\"" + value.Replace("'", "''") + "\"";
    }
}
