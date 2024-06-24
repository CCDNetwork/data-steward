import { useEffect, useState } from 'react';
import { EditIcon, PlusSquareIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { defaultRuleFormValues } from '@/modules/Rules/const';
import { RulesForm, RulesFormSchema } from '@/modules/Rules/validation';
import { useAttributeGroup, useAttributeGroupsMutation } from '@/services/attributeGroups/api';
import { useBeneficiaryAttributes } from '@/services/beneficiaryAttribute';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/DataTable';

import { columns } from './columns';
import { dataToRuleFormValues } from './transformations';

export const RuleModal = ({ attributeGroupId }: { attributeGroupId?: string }) => {
  const [open, setOpen] = useState<boolean>(false);

  const { data: beneficiaryAttributesData, isLoading } = useBeneficiaryAttributes({ queryEnabled: open });
  const { data: attributeGroupData } = useAttributeGroup({
    id: attributeGroupId ?? '',
    queryEnabled: open,
  });
  const { createAttributeGroup, editAttributeGroup } = useAttributeGroupsMutation();

  const form = useForm<RulesForm>({
    defaultValues: defaultRuleFormValues,
    resolver: zodResolver(RulesFormSchema),
  });

  const { control, handleSubmit, reset, watch, setValue } = form;

  const currentBeneficiaryAttributeIdsFormValue = watch('beneficiaryAttributeIds');

  useEffect(() => {
    if (attributeGroupData) {
      reset(dataToRuleFormValues(attributeGroupData));
    }
  }, [attributeGroupData, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (attributeGroupId) {
      try {
        await editAttributeGroup.mutateAsync({ attributeFormData: values, attributeGroupId });
        toast({
          title: 'Success!',
          variant: 'default',
          description: 'Rule successfully updated.',
        });
        setOpen(false);
      } catch (error: any) {
        toast({
          title: 'Something went wrong!',
          variant: 'destructive',
          description: error.response?.data?.errorMessage || 'An error occured while updating rule.',
        });
      }
      return;
    }
    try {
      await createAttributeGroup.mutateAsync(values);
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Rule successfully created.',
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'An error occured while creating new rule.',
      });
    }
  });

  const onTableToggleClick = (beneficiaryAttributeId: number) => {
    const existingBeneficiaryAttributeId = currentBeneficiaryAttributeIdsFormValue.includes(beneficiaryAttributeId);

    if (existingBeneficiaryAttributeId) {
      setValue(
        'beneficiaryAttributeIds',
        currentBeneficiaryAttributeIdsFormValue.filter((i) => i !== beneficiaryAttributeId),
      );
    } else {
      setValue('beneficiaryAttributeIds', [...currentBeneficiaryAttributeIdsFormValue, beneficiaryAttributeId]);
    }
  };

  const onOpenChange = () => {
    setOpen((old) => !old);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {!attributeGroupId ? (
          <Button variant="outline">
            <>
              <PlusSquareIcon className="mr-2 w-5 h-5" />
              Create new
            </>
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <EditIcon className="w-5 h-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[512px]">
        <DialogHeader>
          <DialogTitle>{`${!attributeGroupId ? 'Create a new rule' : 'Edit rule'}`}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel requiredField>Rule name</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="Enter name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="beneficiaryAttributeIds"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-0.5">
                      <FormLabel>Rule attributes</FormLabel>
                      <FormDescription>Pick the attributes for this rule</FormDescription>
                    </div>
                    <FormControl>
                      <DataTable
                        data={beneficiaryAttributesData ?? []}
                        isQueryLoading={isLoading}
                        columns={columns({
                          ruleBeneficiaryAttributeIds: field.value,
                          onTableToggleClick,
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active?</FormLabel>
                      <FormDescription>Enable to activate this rule to be used for deduplication</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="useFuzzyMatch"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Fuzzy matching?</FormLabel>
                      <FormDescription>Enable to set this rule to be used with fuzzy matching</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <div>
                <Button
                  type="submit"
                  onClick={onSubmit}
                  isLoading={createAttributeGroup.isLoading || editAttributeGroup.isLoading}
                  disabled={createAttributeGroup.isLoading || editAttributeGroup.isLoading}
                  className="w-full mt-2"
                >
                  {!attributeGroupId ? 'Create' : 'Save changes'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
