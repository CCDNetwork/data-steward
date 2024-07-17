import { DataWithMeta, PaginationRequest, paginationRequestToUrl } from '@/helpers/pagination';
import { api } from '@/services';
import {
  dataToDatasetRequest,
  resToDatasetResponse,
  resToDeduplicationListing,
} from '@/services/deduplication/transformations';
import { DeduplicationDataset, DeduplicationListing } from '@/services/deduplication/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

enum QueryKeys {
  DeduplicationListings = 'deduplication-listings',
}

export const fetchDeduplicationListings = async (
  pagination: PaginationRequest,
): Promise<DataWithMeta<DeduplicationListing>> => {
  const url = paginationRequestToUrl('deduplication/listings', pagination);

  const resp = await api.get(url);
  return {
    meta: resp.data.meta,
    data: resp.data.data?.map(resToDeduplicationListing) ?? [],
  };
};

const deleteDeduplicationData = async (): Promise<object> => {
  const resp = await api.delete('/deduplication');
  return resp.data;
};

const postDeduplicationDataset = async (data: { file: File; templateId: string }): Promise<DeduplicationDataset> => {
  const resp = await api.post('/deduplication/dataset', dataToDatasetRequest(data), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return resToDatasetResponse(resp.data);
};

const postDeduplicationSameOrganization = async (data: {
  fileId: string;
  templateId: string;
}): Promise<DeduplicationDataset> => {
  const resp = await api.post('/deduplication/same-organization', data);

  return resToDatasetResponse(resp.data);
};

const postDeduplicationSystemOrganizations = async (data: {
  fileId: string;
  templateId: string;
  keepDuplicatesIds: string[];
}): Promise<DeduplicationDataset> => {
  const resp = await api.post('/deduplication/system-organizations', data);

  return resToDatasetResponse(resp.data);
};

const postDeduplicationFinish = async (data: {
  fileId: string;
  templateId: string;
  keepDuplicatesIds: string[];
}): Promise<DeduplicationDataset> => {
  const resp = await api.post('/deduplication/finish', data);

  return resToDatasetResponse(resp.data);
};

export const useDeduplicationListings = ({ currentPage, pageSize, sortBy, sortDirection, debouncedSearch }: any) => {
  return useQuery(
    [QueryKeys.DeduplicationListings, currentPage, pageSize, sortBy, sortDirection, debouncedSearch],
    () => fetchDeduplicationListings({ page: currentPage, pageSize, sortBy, sortDirection, search: debouncedSearch }),
  );
};

export const useDeduplicationMutation = () => {
  const queryClient = useQueryClient();
  return {
    wipeDeduplicationData: useMutation(deleteDeduplicationData),
    deduplicateFile: useMutation(postDeduplicationDataset),
    deduplicateSameOrganization: useMutation(postDeduplicationSameOrganization),
    deduplicateSystemOrganizations: useMutation(postDeduplicationSystemOrganizations),
    deduplicateFinish: useMutation(postDeduplicationFinish, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.DeduplicationListings]),
    }),
  };
};
