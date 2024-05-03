import { useEffect, useMemo } from 'react';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

import { useSearchParams } from 'react-router-dom';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MetaData, SortDirection } from '@/helpers/pagination';
import { Pagination } from '@/components/DataTable/Pagination';
import { Skeleton } from '@/components/ui/skeleton';

import { Input } from '@/components/ui/input';
import { TableColumn } from '@/components/DataTable/types';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/helpers/utils';

interface DataTableProps<TData, TValue> {
  data: TData[];
  currentPage?: number;
  pagination?: MetaData;
  columns: TableColumn<TValue>[];
  isQueryLoading: boolean;
  onRowClick?: (row: TValue) => void;
  pageClicked?: (newPage: number) => void;
  pageSizeClicked?: (newPageSize: number) => void;
  onSearchChange?: (searchValue: string) => void;
  headerClicked?: (accessorKey: string, sortDirection: SortDirection) => void;
}

export function DataTable<TData, TValue>({
  data,
  pagination,
  currentPage,
  columns,
  isQueryLoading,
  onRowClick,
  pageClicked,
  pageSizeClicked,
  onSearchChange,
  headerClicked,
}: DataTableProps<TData, TValue>) {
  const [searchParams] = useSearchParams();

  const currentQueryPageSize = searchParams.get('pageSize');

  const tableData = useMemo(
    () => (isQueryLoading ? Array(Number(currentQueryPageSize) || 10).fill({}) : data),
    [isQueryLoading, currentQueryPageSize, data],
  );

  const tableColumns = useMemo(
    () =>
      isQueryLoading
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton className="w-[100%] h-10" />,
          }))
        : columns,
    [isQueryLoading, columns],
  );

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const onHeaderClicked = (column: any) => {
    if (headerClicked && column.columnDef?.isSortable) {
      const sort = pagination?.sortDirection === SortDirection.Desc ? SortDirection.Asc : SortDirection.Desc;
      headerClicked(column.id, sort);
    }
  };

  useEffect(() => {
    if (currentPage && pagination && pageClicked && pagination?.totalPages < currentPage) {
      pageClicked(pagination.totalPages || 1);
    }
  }, [currentPage, pageClicked, pagination]);

  return (
    <div>
      {onSearchChange && (
        <div className="pb-4">
          <Input
            type="search"
            placeholder="Search..."
            className="sm:max-w-[250px] w-full"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange?.(e.target.value)}
          />
        </div>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="truncate">
                {headerGroup.headers.map((header) => {
                  // @ts-ignore
                  return header.column.columnDef.isSortable ? (
                    <TableHead key={header.id}>
                      <div>
                        <Button
                          variant="ghost"
                          className="p-0 hover:bg-transparent"
                          onClick={() => (table.getRowModel().rows.length > 0 ? onHeaderClicked(header.column) : null)}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                          <ChevronsUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </TableHead>
                  ) : (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn('truncate', { 'cursor-pointer': !!onRowClick })}
                  onClick={() => (onRowClick ? onRowClick(row.original) : null)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {data.length > 0 && pagination && currentPage && pageClicked && pageSizeClicked && (
        <Pagination
          currentPage={currentPage}
          pagination={pagination}
          pageClicked={pageClicked}
          pageSizeClicked={pageSizeClicked}
          key={`${pagination.totalPages}-${pagination.pageSize}`}
        />
      )}
    </div>
  );
}
