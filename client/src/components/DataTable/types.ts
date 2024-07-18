import { ColumnDef } from '@tanstack/react-table';

export type TableColumn<T> = ColumnDef<T> & {
  isSortable?: boolean;
  headerClassName?: string;
};
