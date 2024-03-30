using System;
using System.Threading.Tasks;
using IO = System.IO;

namespace Ccd.Server.Storage;

public interface IStorageEngine
{
    Task<byte[]> GetFileAsync(File file);
    IO.Stream GetFileStream(File file);
    Task<File> SaveFileAsync(Guid ownerId, StorageType storageType, IO.MemoryStream stream, string name);
    void DeleteFile(File file);
}
