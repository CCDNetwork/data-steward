import { useMemo } from 'react';
import { usePagination } from '@mantine/hooks';

import { PageSize } from '@/components/DataTable/PageSize';
import { MetaData } from '@/helpers/pagination';
import { Separator } from '@/components/ui/separator';
import {
  PaginationContent,
  PaginationItem,
  Pagination as PaginationContainer,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationLastPage,
  PaginationFirstPage,
} from '@/components/ui/pagination';

interface PaginationProps {
  pagination: MetaData;
  currentPage: number;
  pageClicked: (newPage: number) => void;
  pageSizeClicked: (newPageSize: number) => void;
}

export const Pagination = ({ pagination, currentPage, pageClicked, pageSizeClicked }: PaginationProps) => {
  const { totalRows, totalPages, pageSize } = pagination;

  const { range } = usePagination({
    total: totalPages,
    page: currentPage,
  });

  const resultsFrom = currentPage * pageSize - pageSize + 1;
  const resultsTo = useMemo(() => {
    const calculatedResultsTo = currentPage * pageSize;
    if (calculatedResultsTo > totalRows) {
      return totalRows;
    }
    return calculatedResultsTo;
  }, [currentPage, pageSize, totalRows]);

  return (
    <div className="py-3 flex lg:flex-row items-center lg:justify-between justify-center flex-col gap-2 px-2">
      <div className="flex items-center space-x-4">
        <div className="text-sm">
          Showing <span className="font-bold">{resultsFrom}</span> to
          <span className="font-bold"> {resultsTo}</span> of
          <span className="font-bold"> {totalRows}</span> results
        </div>
        <Separator orientation="vertical" className="h-6" />
        <PageSize pageSize={pageSize} pageSizeClicked={pageSizeClicked} />
      </div>
      <nav>
        <PaginationContainer>
          <PaginationContent>
            <PaginationItem className="md:block hidden">
              <PaginationFirstPage onClick={() => pageClicked(1)} disabled={currentPage === 1} />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious onClick={() => pageClicked(currentPage - 1)} disabled={currentPage === 1} />
            </PaginationItem>
            {range.map((pageNumber, index) => {
              if (pageNumber === 'dots') {
                return (
                  <PaginationItem key={`dots${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return (
                <PaginationItem key={pageNumber} onClick={() => pageClicked(pageNumber)}>
                  <PaginationLink isActive={pageNumber === currentPage}>{pageNumber}</PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext onClick={() => pageClicked(currentPage + 1)} disabled={currentPage === totalPages} />
            </PaginationItem>
            <PaginationItem className="md:block hidden">
              <PaginationLastPage onClick={() => pageClicked(totalPages)} disabled={currentPage === totalPages} />
            </PaginationItem>
          </PaginationContent>
        </PaginationContainer>
      </nav>
    </div>
  );
};
