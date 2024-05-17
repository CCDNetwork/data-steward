import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2Icon } from 'lucide-react';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { format } from 'date-fns';

import { PageContainer } from '@/components/PageContainer';
import { APP_ROUTE } from '@/helpers/constants';
import { toast } from '@/components/ui/use-toast';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { AttributeGroup } from '@/services/attributeGroups';
import { useAttributeGroups, useAttributeGroupsMutation } from '@/services/attributeGroups/api';
import { StrictModeDroppable } from '@/components/StrictModeDroppable';
import { cn } from '@/helpers/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { RuleModal, RulesInformationBox } from './components';
import { useRulesProvider } from '../RulesProvider';

export const RulesPage = () => {
  const queryClient = useQueryClient();
  const { pagination } = useRulesProvider();

  const [ruleToDelete, setRuleToDelete] = useState<AttributeGroup | null>(null);

  const { data: attributeGroupData } = useAttributeGroups({ ...pagination, pageSize: 999 });
  const { removeAttributeGroup, reorderAttributeGroups } = useAttributeGroupsMutation();

  const handleRuleDelete = async () => {
    if (!ruleToDelete) return;

    try {
      await removeAttributeGroup.mutateAsync(ruleToDelete.id);
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Rule successfully deleted!',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Failed to delete rule.',
      });
    }
    setRuleToDelete(null);
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const updatedGroupOrderData = queryClient.setQueriesData(['attribute_groups'], (prevData: any) => {
      const updatedGroups = [...prevData.data];

      const draggedGroup = updatedGroups.splice(source.index, 1)[0];
      updatedGroups.splice(destination.index, 0, draggedGroup);

      const updatedData = {
        ...prevData,
        data: updatedGroups.map((group: AttributeGroup, index: number) => {
          return {
            ...group,
            order: index + 1,
          };
        }),
      };
      return updatedData;
    });

    try {
      await reorderAttributeGroups.mutateAsync({
        newOrderList: updatedGroupOrderData[0][1].data.map((data: any) => ({ id: data.id, order: data.order })),
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'An error occured while re-ordering rules.',
      });
    }
  };

  return (
    <PageContainer
      pageTitle="Rules"
      pageSubtitle="Rule entries"
      headerNode={<RuleModal />}
      breadcrumbs={[{ href: `${APP_ROUTE.Rules}`, name: 'Rules' }]}
    >
      <RulesInformationBox />
      <div className="border border-border rounded-md h-[calc(100svh-320px)]">
        <div className="border-b flex justify-between gap-10 text-sm h-10 px-6 items-center font-medium text-muted-foreground whitespace-nowrap no-scrollbar">
          <div className="flex gap-4">
            <span>#</span>
            <span>Name</span>
          </div>
          <span>Status</span>
          <span>Fuzzy Match</span>
          <span>Created at</span>
          <span>Updated at</span>
          <span className="pr-4">Actions</span>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="rules-droppableId">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col p-2 flex-1">
                {attributeGroupData?.data.map((attributeGroup, index) => (
                  <div key={attributeGroup.id}>
                    <Draggable draggableId={attributeGroup.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          className={cn(
                            'flex transition-colors whitespace-nowrap duration-500 justify-between items-center gap-10 border py-1 rounded-lg px-4 no-scrollbar mb-2 text-sm',
                            { 'bg-muted': snapshot.isDragging },
                          )}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <div className="flex gap-4 w-full">
                            <span>{attributeGroup.order}</span>
                            <span>{attributeGroup.name}</span>
                          </div>
                          <span className="w-full">
                            <Badge
                              className={cn(
                                'capitalize',
                                { 'bg-destructive dark:text-white hover:bg-destructive': !attributeGroup.isActive },
                                { 'bg-primary dark:text-white hover:bg-primary': attributeGroup.isActive },
                              )}
                            >
                              {attributeGroup.isActive ? 'active' : 'inactive'}
                            </Badge>
                          </span>
                          <span className="w-full">
                            <Badge
                              className={cn(
                                'capitalize',
                                {
                                  'bg-destructive dark:text-white hover:bg-destructive': !attributeGroup.useFuzzyMatch,
                                },
                                { 'bg-primary dark:text-white hover:bg-primary': attributeGroup.useFuzzyMatch },
                              )}
                            >
                              {attributeGroup.useFuzzyMatch ? 'enabled' : 'disabled'}
                            </Badge>
                          </span>
                          <span className="w-full">{format(attributeGroup.createdAt ?? '', 'PPP')}</span>
                          <span className="w-full">{format(attributeGroup.updatedAt ?? '', 'PPP')}</span>
                          <span className="flex gap-1">
                            <RuleModal attributeGroupId={attributeGroup.id} />
                            <Button variant="ghost" onClick={() => setRuleToDelete(attributeGroup)} size="icon">
                              <Trash2Icon className="w-5 h-5 text-destructive" />
                            </Button>
                          </span>
                        </div>
                      )}
                    </Draggable>
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </div>
      <ConfirmationDialog
        open={!!ruleToDelete}
        title="Delete Rule"
        body={`Are you sure you want to delete "${ruleToDelete?.name}" rule?`}
        onAction={handleRuleDelete}
        confirmButtonLoading={removeAttributeGroup.isLoading}
        actionButtonVariant="destructive"
        onCancel={() => setRuleToDelete(null)}
      />
    </PageContainer>
  );
};
