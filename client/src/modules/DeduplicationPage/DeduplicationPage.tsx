import axios from 'axios';

import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { DUMMY_DATA } from '@/modules/DeduplicationPage/constants';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/GlobalProvider';

import { columns } from './columns';
import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const DeduplicationPage = () => {
  const { organization } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
            Upload list
          </Button>
          <Button type="button" onClick={handleUploadRevisedListClick}>
            Upload revised list
          </Button>
        </div>
      }
    >
      <DataTable data={DUMMY_DATA.data} isQueryLoading={false} columns={columns} />
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
