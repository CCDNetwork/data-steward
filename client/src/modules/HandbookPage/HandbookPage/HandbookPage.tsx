import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { APP_ROUTE } from '@/helpers/constants';
import { toast } from '@/components/ui/use-toast';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { Handbook } from '@/services/handbooks';
import { useHandbookMutation, useHandbooks } from '@/services/handbooks/api';
import { Button } from '@/components/ui/button';

import { columns } from './columns';
import { useHandbookProvider } from '../HandbookProvider';

export const HandbookPage = () => {
  const navigate = useNavigate();
  const { pagination } = useHandbookProvider();
  const { currentPage, onPageChange, onPageSizeChange, onSortChange, onSearchChange } = pagination;

  const [handbookToDelete, setHandbookToDelete] = useState<Handbook | null>(null);

  const { data: handbooksData, isLoading } = useHandbooks(pagination);
  const { deleteHandbook } = useHandbookMutation();

  const handleDeleteHandbook = async () => {
    if (!handbookToDelete) return;

    try {
      await deleteHandbook.mutateAsync(handbookToDelete.id);
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Handbook successfully deleted!',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Failed to delete handbook.',
      });
    }
    setHandbookToDelete(null);
  };

  const onHandbookRowClick = (handbookRow: Handbook) => navigate(`${APP_ROUTE.Handbook}/${handbookRow.id}`);

  return (
    <PageContainer
      pageTitle="Handbook"
      pageSubtitle="Handbook entries"
      headerNode={
        <Button type="button" onClick={() => navigate(`${APP_ROUTE.Handbook}/new`)}>
          Create
        </Button>
      }
      breadcrumbs={[{ href: `${APP_ROUTE.Handbook}`, name: 'Handbook entries' }]}
    >
      <DataTable
        data={handbooksData?.data ?? []}
        pagination={handbooksData?.meta}
        isQueryLoading={isLoading}
        currentPage={currentPage}
        pageClicked={onPageChange}
        pageSizeClicked={onPageSizeChange}
        headerClicked={onSortChange}
        onSearchChange={onSearchChange}
        onRowClick={onHandbookRowClick}
        columns={columns(setHandbookToDelete)}
      />
      <ConfirmationDialog
        open={!!handbookToDelete}
        title="Delete Handbook"
        body={`Are you sure you want to delete "${handbookToDelete?.title}" handbook?`}
        onAction={handleDeleteHandbook}
        confirmButtonLoading={deleteHandbook.isLoading}
        actionButtonVariant="destructive"
        onCancel={() => setHandbookToDelete(null)}
      />
    </PageContainer>
  );
};
