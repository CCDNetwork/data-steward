using System;
using System.Threading.Tasks;
using Ccd.Server.Helpers;
using IO = System.IO;

namespace Ccd.Server.Storage;

public class FilesystemStorageEngine : IStorageEngine
{
    private string getPath(File file)
    {
        if (file.StorageTypeId == StorageType.Assets.Id)
        {
            return IO.Path.Join(StaticConfiguration.StoragePath, StorageType.Assets.Directory, file.FileName);
        }

        var directory = StorageType.GetById(file.StorageTypeId).Directory;
        var path = IO.Path.Join(StaticConfiguration.StoragePath, file.OwnerId.ToString(), directory, file.FileName);

        return path;
    }

    public async Task<byte[]> GetFileAsync(File file)
    {
        var path = getPath(file);

        if (!IO.File.Exists(path))
            throw new NotFoundException("File not found");

        return await IO.File.ReadAllBytesAsync(path);
    }

    public IO.Stream GetFileStream(File file)
    {
        var path = getPath(file);

        if (!IO.File.Exists(path))
            throw new NotFoundException("File not found");

        return IO.File.OpenRead(path);
    }

    public async Task<File> SaveFileAsync(Guid ownerId, StorageType storageType, IO.MemoryStream stream, string name)
    {
        var directory = IO.Path.Combine(StaticConfiguration.StoragePath, ownerId.ToString(), storageType.Directory);

        if (storageType.Id == StorageType.Assets.Id)
        {
            directory = IO.Path.Combine(StaticConfiguration.StoragePath, storageType.Directory);
        }

        IO.Directory.CreateDirectory(directory);

        var internalFileName = Guid.NewGuid().ToString() + '-' + name.Replace(" ", "_");
        var uploadPath = IO.Path.Combine(directory, internalFileName);

        await using (var fileStream = new IO.FileStream(uploadPath, IO.FileMode.Create))
        {
            stream.WriteTo(fileStream);
        }

        return new File
        {
            OwnerId = ownerId,
            StorageTypeId = storageType.Id,
            Name = name,
            FileName = internalFileName,
            Size = stream.Length // in bytes
        };
    }

    public void DeleteFile(File file)
    {
        var path = getPath(file);

        IO.File.Delete(path);
    }
}
