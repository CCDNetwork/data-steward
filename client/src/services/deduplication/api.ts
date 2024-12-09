import {
  DataWithMeta,
  PaginationRequest,
  paginationRequestToUrl,
} from '@/helpers/pagination';
import { useDeduplicationProvider } from '@/modules/DeduplicationPage';
import { api } from '@/services';
import {
  dataToDatasetRequest,
  resToCommcareDedupeResponse,
  resToDatasetResponse,
  resToDeduplicationListing,
  resToSameOrgDedupResponse,
  resToSystemDedupeResponse,
} from '@/services/deduplication/transformations';
import {
  DeduplicationDataset,
  DeduplicationListing,
  SameOrgDedupeResponse,
  SystemOrgDedupeResponse,
} from '@/services/deduplication/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

enum QueryKeys {
  DeduplicationListings = 'deduplication-listings',
}

export const fetchDeduplicationListings = async (
  pagination: PaginationRequest
): Promise<DataWithMeta<DeduplicationListing>> => {
  const url = paginationRequestToUrl('deduplication/listings', pagination);

  const resp = await api.get(url);
  return {
    meta: resp.data.meta,
    data: resp.data.data?.map(resToDeduplicationListing) ?? [],
  };
};

export const deleteDeduplicationData = async (): Promise<object> => {
  const resp = await api.delete('/deduplication');
  return resp.data;
};

const postDeduplicationDataset = async (data: {
  file: File;
  templateId: string;
}): Promise<DeduplicationDataset> => {
  const resp = await api.post(
    '/deduplication/dataset',
    dataToDatasetRequest(data),
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  return resToDatasetResponse(resp.data);
};

const postDeduplicationSameOrganization = async (data: {
  fileId: string;
  templateId: string;
}): Promise<SameOrgDedupeResponse> => {
  const resp = await api.post('/deduplication/same-organization', data);

  return resToSameOrgDedupResponse(resp.data);
};

const postDeduplicationSystemOrganizations = async (data: {
  fileId: string;
  templateId: string;
}): Promise<SystemOrgDedupeResponse> => {
  const resp = await api.post('/deduplication/system-organizations', data);

  return resToSystemDedupeResponse(resp.data);
};

const postDeduplicationCommcare = async (data: {
  fileId: string;
  templateId: string;
}): Promise<DeduplicationDataset> => {
  const resp = await api.post('/deduplication/commcare', data);

  return resToCommcareDedupeResponse(resp.data);
};

const postDeduplicationFinish = async (data: {
  fileId: string;
  templateId: string;
}): Promise<DeduplicationDataset> => {
  const resp = await api.post('/deduplication/finish', data);

  return resToDatasetResponse(resp.data);
};

export const useDeduplicationListings = ({
  currentPage,
  pageSize,
  sortBy,
  sortDirection,
  debouncedSearch,
}: any) => {
  return useQuery(
    [
      QueryKeys.DeduplicationListings,
      currentPage,
      pageSize,
      sortBy,
      sortDirection,
      debouncedSearch,
    ],
    () =>
      fetchDeduplicationListings({
        page: currentPage,
        pageSize,
        sortBy,
        sortDirection,
        search: debouncedSearch,
      })
  );
};

export const useDeduplicationMutation = () => {
  const queryClient = useQueryClient();
  const { setDeduplicationWizardError } = useDeduplicationProvider();

  return {
    deduplicateFile: useMutation(postDeduplicationDataset, {
      onError: (error) => setDeduplicationWizardError(error),
    }),
    deduplicateSameOrganization: useMutation(
      postDeduplicationSameOrganization,
      {
        onError: (error) => setDeduplicationWizardError(error),
      }
    ),
    deduplicateSystemOrganizations: useMutation(
      postDeduplicationSystemOrganizations,
      {
        onError: (error) => setDeduplicationWizardError(error),
      }
    ),
    deduplicateCommcare: useMutation(postDeduplicationCommcare, {
      onError: (error) => setDeduplicationWizardError(error),
    }),
    deduplicateFinish: useMutation(postDeduplicationFinish, {
      onSuccess: () =>
        queryClient.invalidateQueries([QueryKeys.DeduplicationListings]),
      onError: (error) => setDeduplicationWizardError(error),
    }),
  };
};
