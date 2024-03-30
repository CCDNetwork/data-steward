using System;

namespace Ccd.Server.Storage;

public class StorageType
{
    public static readonly StorageType Assets = new StorageType {Id = 1, Name = "Assets", Directory = "assets"};

    public int Id { get; set; }
    public string Name { get; set; }
    public string Directory { get; set; }

    public static StorageType GetById(int id)
    {
        if (Assets.Id == id) return Assets;

        throw new NotImplementedException("StorageType not found");
    }
}
