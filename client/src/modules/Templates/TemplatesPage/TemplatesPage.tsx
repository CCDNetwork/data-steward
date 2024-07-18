import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { useTemplateMutation, useTemplates } from '@/services/templates/api';
import { Template } from '@/services/templates';
import { APP_ROUTE } from '@/helpers/constants';
import { toast } from '@/components/ui/use-toast';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';

import { columns } from './columns';
import { CreateTemplateModal } from './components';
import { useTemplatesProvider } from '../TemplatesProvider';

export const TemplatesPage = () => {
  const navigate = useNavigate();
  const { pagination } = useTemplatesProvider();
  const { currentPage, onPageChange, onPageSizeChange, onSortChange, onSearchChange } = pagination;

  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);

  const { data: templates, isLoading } = useTemplates(pagination);
  const { deleteTemplate } = useTemplateMutation();

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;

    try {
      await deleteTemplate.mutateAsync(templateToDelete.id);
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Template successfully deleted!',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Failed to delete template.',
      });
    }
    setTemplateToDelete(null);
  };

  const onTemplateRowClick = (templateRow: Template) => navigate(`${APP_ROUTE.Templates}/${templateRow.id}`);

  console.log('templates', templates);

  return (
    <PageContainer
      pageTitle="Manage Templates"
      pageSubtitle="On this page you can create and edit Templates which allow you to upload your data to the platform easily."
      headerNode={<CreateTemplateModal />}
      breadcrumbs={[{ href: `${APP_ROUTE.Templates}`, name: 'Manage Templates' }]}
    >
      <DataTable
        data={templates?.data ?? []}
        pagination={templates?.meta}
        isQueryLoading={isLoading}
        currentPage={currentPage}
        pageClicked={onPageChange}
        pageSizeClicked={onPageSizeChange}
        headerClicked={onSortChange}
        onSearchChange={onSearchChange}
        columns={columns(setTemplateToDelete, onTemplateRowClick)}
      />
      <ConfirmationDialog
        open={!!templateToDelete}
        title="Delete Template"
        body={`Are you sure you want to delete "${templateToDelete?.name}" template?`}
        onAction={handleDeleteTemplate}
        confirmButtonLoading={deleteTemplate.isLoading}
        actionButtonVariant="destructive"
        onCancel={() => setTemplateToDelete(null)}
      />
    </PageContainer>
  );
};
