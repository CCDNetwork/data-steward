import { useState } from 'react';
import axios from 'axios';

import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/GlobalProvider';
import { useDeduplicationListings } from '@/services/deduplication';
import { usePagination } from '@/helpers/pagination';

import { columns } from './columns';
import { useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

export const DeduplicationPage = () => {
  const queryClient = useQueryClient();
  const pagination = usePagination();
  const { currentPage, onPageChange, onPageSizeChange, onSortChange, onSearchChange } = pagination;
  const { organization, token } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: listings, isLoading: queryLoading } = useDeduplicationListings(pagination);

  const handleUploadListClick = async () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  };

  const handleUploadRevisedListClick = async () => {
    const fileInput = document.getElementById('file-input-revised') as HTMLInputElement;
    fileInput.click();
  };

  const handleUploadChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'single' | 'multiple') => {
    setIsLoading(true);
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      try {
        const response = await axios.post(`${API_URL}/api/v1/deduplication/deduplicate`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'organization-id': organization?.id,
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'deduplication.' + file.name.split('.').pop());
        document.body.appendChild(link);
        link.click();
        link.remove();
        queryClient.invalidateQueries(['deduplication-listings']);
      } catch (error) {
        console.error('Failed to upload file');
      }

      e.target.value = '';
    }
    setIsLoading(false);
  };

  return (
    <PageContainer
      pageTitle="Deduplication"
      isLoading={isLoading}
      headerNode={
        <div className="flex gap-3">
          <Button type="button" onClick={handleUploadListClick}>
            Internal deduplication
          </Button>
          <Button type="button" onClick={handleUploadRevisedListClick}>
            Registry deduplication
          </Button>
        </div>
      }
    >
      <DataTable
        data={listings?.data ?? []}
        pagination={listings?.meta}
        isQueryLoading={queryLoading}
        currentPage={currentPage}
        pageClicked={onPageChange}
        pageSizeClicked={onPageSizeChange}
        headerClicked={onSortChange}
        onSearchChange={onSearchChange}
        columns={columns}
      />
      <input
        type="file"
        className="hidden"
        id="file-input"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUploadChange(e, 'single')}
      />
      <input
        type="file"
        className="hidden"
        id="file-input-revised"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUploadChange(e, 'multiple')}
      />
    </PageContainer>
  );
};
