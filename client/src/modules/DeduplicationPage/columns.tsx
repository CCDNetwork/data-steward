import { formatDate } from 'date-fns';

import { TableColumn } from '@/components/DataTable/types';
import { DeduplicationListing } from '@/services/deduplication';

export const columns: TableColumn<DeduplicationListing>[] = [
  {
    accessorKey: 'uploadUser',
    id: 'uploadUser',
    header: 'Upload User',
    cell: ({ row }) => {
      const { userCreated } = row.original;

      return <div>{`${userCreated?.firstName ?? '-'} ${userCreated?.lastName ?? '-'}`}</div>;
    },
  },
  {
    accessorKey: 'fileName',
    id: 'fileName',
    header: 'File Name',
  },
  {
    accessorKey: 'duplicates',
    id: 'duplicates',
    header: 'Duplicates',
    cell: ({ getValue }) => {
      return (
        <div className="flex flex-col">
          <span>{(getValue() as number) || 'none'}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: 'Created At',
    cell: ({ getValue }) => {
      return (
        <div className="flex flex-col">
          <span>{formatDate(getValue() as Date, 'MM/dd/yyyy HH:mm:ss')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: 'Updated At',
    cell: ({ getValue }) => {
      return (
        <div className="flex flex-col">
          <span>{formatDate(getValue() as Date, 'MM/dd/yyyy HH:mm:ss')}</span>
        </div>
      );
    },
  },
];
