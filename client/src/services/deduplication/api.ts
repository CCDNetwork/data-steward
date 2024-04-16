import { DataWithMeta, PaginationRequest, paginationRequestToUrl } from '@/helpers/pagination';
import { api } from '@/services';
import { resToDeduplicationListing } from '@/services/deduplication/transformations';
import { DeduplicationListing } from '@/services/deduplication/types';
import { useMutation, useQuery } from '@tanstack/react-query';

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

export const useDeduplicationListings = ({ currentPage, pageSize, sortBy, sortDirection, debouncedSearch }: any) => {
  return useQuery(
    [QueryKeys.DeduplicationListings, currentPage, pageSize, sortBy, sortDirection, debouncedSearch],
    () => fetchDeduplicationListings({ page: currentPage, pageSize, sortBy, sortDirection, search: debouncedSearch }),
  );
};

export const useDeduplicationMutation = () => {
  return {
    wipeDeduplicationData: useMutation(deleteDeduplicationData),
  };
};
