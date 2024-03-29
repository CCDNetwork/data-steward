import { MetaData, SortDirection } from '@/helpers/pagination';

export interface DUMMY_TYPE {
  id: string;
  uploadDate: Date;
  uploadUser: string;
  filename: string;
  duplicates: string;
}

export const DUMMY_DATA: { data: DUMMY_TYPE[]; meta: MetaData } = {
  data: [
    {
      id: '018e0f13-123c-4cda-be45-c09fa8879eb1',
      uploadDate: new Date(),
      uploadUser: 'John',
      filename: 'data-001.csv',
      duplicates: '1',
    },
    {
      id: '018e0f13-123c-4cda-be45-c09fa8879eb2',
      uploadDate: new Date(),
      uploadUser: 'Jack',
      filename: 'data-002.csv',
      duplicates: '14',
    },
    {
      id: '018e0f13-123c-4cda-be45-c09fa8879eb3',
      uploadDate: new Date(),
      uploadUser: 'Jordan',
      filename: 'data-003.csv',
      duplicates: '11',
    },
    {
      id: '018e0f13-123c-4cda-be45-c09fa8879eb4',
      uploadDate: new Date(),
      uploadUser: 'Jacques',
      filename: 'data-004.csv',
      duplicates: '15',
    },
    {
      id: '018e0f13-123c-4cda-be45-c09fa8879eb5',
      uploadDate: new Date(),
      uploadUser: 'Jeniffer',
      filename: 'data-005.csv',
      duplicates: '5',
    },
    {
      id: '018e0f13-123c-4cda-be45-c09fa8879eb6',
      uploadDate: new Date(),
      uploadUser: 'Jared',
      filename: 'data-006.csv',
      duplicates: '10',
    },
    {
      id: '018e0f13-123c-4cda-be45-c09fa8879eb7',
      uploadDate: new Date(),
      uploadUser: 'Marco',
      filename: 'data-007.csv',
      duplicates: '3',
    },
    {
      id: '018e0f13-123c-4cda-be45-c09fa8879eb8',
      uploadDate: new Date(),
      uploadUser: 'Tim',
      filename: 'data-008.csv',
      duplicates: '12',
    },
    {
      id: '018e0f13-123c-4cda-be45-c09fa8879eb9',
      uploadDate: new Date(),
      uploadUser: 'Ben',
      filename: 'data-009.csv',
      duplicates: '0',
    },
    {
      id: '018e0f13-123c-4cda-be45-c09fa8879e10',
      uploadDate: new Date(),
      uploadUser: 'Richard',
      filename: 'data-010.csv',
      duplicates: '6',
    },
  ],
  meta: {
    page: 1,
    pageSize: 10,
    totalRows: 10,
    totalPages: 1,
    sortBy: null,
    sortDirection: SortDirection.Asc,
  },
};
