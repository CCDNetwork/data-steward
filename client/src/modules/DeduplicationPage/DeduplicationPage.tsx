import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { usePagination } from '@/helpers/pagination';
import { DUMMY_DATA } from '@/modules/DeduplicationPage/constants';

import { columns } from './columns';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const DeduplicationPage = () => {
  const pagination = usePagination();

  const { currentPage, onPageChange, onPageSizeChange, onSortChange, onSearchChange } = pagination;

  const handleUploadListClick = async () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  };

  const handleUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`${API_URL}/api/v1/deduplication/lists`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
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
  };

  return (
    <PageContainer
      pageTitle="Deduplication"
      headerNode={
        <div className="flex gap-3">
          <Button type="button" onClick={handleUploadListClick}>
            Upload list
          </Button>
          <Button type="button">Upload revised list</Button>
        </div>
      }
    >
      <DataTable
        data={DUMMY_DATA.data}
        pagination={DUMMY_DATA.meta}
        isQueryLoading={false}
        currentPage={currentPage}
        pageClicked={onPageChange}
        pageSizeClicked={onPageSizeChange}
        headerClicked={onSortChange}
        onSearchChange={onSearchChange}
        columns={columns}
      />
      <input type="file" className="hidden" id="file-input" onChange={handleUploadChange} />
    </PageContainer>
  );
};
