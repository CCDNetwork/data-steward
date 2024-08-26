import { useMutation, useQuery } from '@tanstack/react-query';

import {
  imageToFormData,
  resToStorageFile,
  fileToFormData,
} from './transformations';
import { StorageFile } from './types';
import { api } from '../api';

enum QueryKeys {
  StorageFileSingle = 'file',
  UpdateStorageFileAlt = 'fileAlt',
  AddStorageFile = 'addFile',
}

//
// API calls
//
const fetchStorageFile = async (fileName: string): Promise<StorageFile> => {
  const resp = await api.get(`/storage/${fileName}`);
  return resToStorageFile(resp.data);
};

const postStorageFile = async (data: any): Promise<StorageFile> => {
  const resp = await api.post(
    `/storage/files`,
    data.type ? fileToFormData(data) : imageToFormData(data.file),
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  return resToStorageFile(resp.data);
};

const putStorageFileAlt = async (data: any): Promise<StorageFile> => {
  const resp = await api.put(`/storage/file/${data.id}/alt`, { alt: data.alt });
  return resToStorageFile(resp.data);
};

//
// GET hooks
//
export const useStorageFile = ({ fileName }: { fileName: string }) => {
  return useQuery([QueryKeys.StorageFileSingle, fileName], () =>
    fetchStorageFile(fileName),
  );
};

//
// Mutation hooks
//
export const useStorageFileMutation = () => {
  return {
    addStorageFile: useMutation(postStorageFile, {
      mutationKey: [QueryKeys.AddStorageFile],
    }),
    updateStorageFileAlt: useMutation(putStorageFileAlt, {
      mutationKey: [QueryKeys.UpdateStorageFileAlt],
    }),
  };
};
