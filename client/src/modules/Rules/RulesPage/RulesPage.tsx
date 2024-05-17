import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Trash2Icon } from 'lucide-react';
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

  const { data: attributeGroupData, isLoading } = useAttributeGroups({ ...pagination, pageSize: 999 });
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
      <table className="flex flex-col border border-border overflow-auto rounded-md h-[calc(100svh-370px)] sm:h-[calc(100svh-380px)] md:h-[calc(100svh-360px)] lg:h-[calc(100svh-320px)]">
        <thead className="min-w-[1000px] overflow-hidden border-b flex justify-between text-sm h-10 px-6 items-center font-medium text-muted-foreground whitespace-nowrap">
          <tr className="flex justify-between w-full items-center">
            <th className="flex gap-4">
              <span>#</span>
              <span>Name</span>
            </th>
            <th>Status</th>
            <th>Fuzzy Matching</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th className="pr-4">Actions</th>
          </tr>
        </thead>
        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="rules-droppableId">
            {(provided) => (
              <tbody
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-w-[1000px] h-full overflow-hidden flex flex-col p-2 flex-1"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center text-center h-full">
                    <Loader2 className="w-14 h-14 animate-spin" />
                  </div>
                ) : (
                  <>
                    {attributeGroupData?.data && attributeGroupData.data.length > 0 ? (
                      attributeGroupData?.data.map((attributeGroup, index) => (
                        <Draggable draggableId={attributeGroup.id} key={attributeGroup.id} index={index}>
                          {(provided, snapshot) => (
                            <tr
                              className={cn(
                                'flex transition-colors whitespace-nowrap duration-500 justify-between items-center border py-1 rounded-lg px-4 no-scrollbar mb-2 text-sm',
                                { 'bg-muted': snapshot.isDragging },
                              )}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <td className="flex gap-4">
                                <span>{attributeGroup.order}</span>
                                <span>{attributeGroup.name}</span>
                              </td>
                              <td>
                                <Badge
                                  className={cn(
                                    'capitalize',
                                    { 'bg-destructive dark:text-white hover:bg-destructive': !attributeGroup.isActive },
                                    { 'bg-primary dark:text-white hover:bg-primary': attributeGroup.isActive },
                                  )}
                                >
                                  {attributeGroup.isActive ? 'active' : 'inactive'}
                                </Badge>
                              </td>
                              <td>
                                <Badge
                                  className={cn(
                                    'capitalize',
                                    {
                                      'bg-destructive dark:text-white hover:bg-destructive':
                                        !attributeGroup.useFuzzyMatch,
                                    },
                                    { 'bg-primary dark:text-white hover:bg-primary': attributeGroup.useFuzzyMatch },
                                  )}
                                >
                                  {attributeGroup.useFuzzyMatch ? 'enabled' : 'disabled'}
                                </Badge>
                              </td>
                              <td>{format(attributeGroup.createdAt ?? '', 'PPP')}</td>
                              <td>{format(attributeGroup.updatedAt ?? '', 'PPP')}</td>
                              <td className="flex gap-1">
                                <RuleModal attributeGroupId={attributeGroup.id} />
                                <Button variant="ghost" onClick={() => setRuleToDelete(attributeGroup)} size="icon">
                                  <Trash2Icon className="w-5 h-5 text-destructive" />
                                </Button>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="flex justify-center items-center text-center h-full text-muted-foreground">
                        No results.
                      </div>
                    )}
                  </>
                )}

                {provided.placeholder}
              </tbody>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </table>
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
