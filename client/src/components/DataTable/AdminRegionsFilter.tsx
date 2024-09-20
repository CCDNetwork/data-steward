import { useState } from 'react';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import { AdministrativeRegion } from '@/services/administrativeRegions/types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/GlobalProvider';
import {
  getAdministrativeRegionById,
  useAdminRegionsInfinite,
} from '@/services/administrativeRegions';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { AsyncSelect } from '../AsyncSelect';

export const AdminRegionsFilter = ({
  currentFilters,
  setCurrentFilters,
}: React.HTMLAttributes<HTMLDivElement> & {
  currentFilters: Record<string, string>;
  setCurrentFilters: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}) => {
  const { deploymentSettings } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabledInputNames, setDisabledInputNames] = useState<string[]>([]);

  const form = useForm<{ [key: string]: AdministrativeRegion | null }>({
    defaultValues: {
      administrativeRegion1: null,
      administrativeRegion2: null,
      administrativeRegion3: null,
      administrativeRegion4: null,
    },
  });

  const { control, watch, reset, getValues, setValue } = form;

  const regions = [
    'administrativeRegion1',
    'administrativeRegion2',
    'administrativeRegion3',
    'administrativeRegion4',
  ];

  const [
    currentFormAdministrativeRegion1,
    currentFormAdministrativeRegion2,
    currentFormAdministrativeRegion3,
    currentFormAdministrativeRegion4,
  ] = watch(regions);

  const onApplyFilters = () => {
    setCurrentFilters((old) => ({
      ...old,
      administrativeRegion1Id: currentFormAdministrativeRegion1?.id ?? '',
      administrativeRegion2Id: currentFormAdministrativeRegion2?.id ?? '',
      administrativeRegion3Id: currentFormAdministrativeRegion3?.id ?? '',
      administrativeRegion4Id: currentFormAdministrativeRegion4?.id ?? '',
    }));
    setOpen(false);
  };

  const onClearFilters = () => {
    setCurrentFilters((old) => ({
      ...old,
      administrativeRegion1Id: '',
      administrativeRegion2Id: '',
      administrativeRegion3Id: '',
      administrativeRegion4Id: '',
    }));
    setOpen(false);
    setDisabledInputNames([]);
    setTimeout(() => reset(), 150);
  };
  const filterNames = [
    'administrativeRegion1Id',
    'administrativeRegion2Id',
    'administrativeRegion3Id',
    'administrativeRegion4Id',
  ];

  const currentlyAppliedCount = Object.keys(currentFilters).filter(
    (i) => filterNames.includes(i) && currentFilters[i]
  ).length;

  const propagateParentRegion = async (adminLevel: AdministrativeRegion) => {
    if (!adminLevel.parentId) return;
    if (adminLevel.level === 1 || adminLevel.level > 4) return;
    if (
      getValues(`administrativeRegion${adminLevel.level - 1}`)?.id ===
      adminLevel.parentId
    )
      return;
    setIsLoading(true);

    const parentEntity = await getAdministrativeRegionById(adminLevel.parentId);

    setValue(`administrativeRegion${parentEntity.level}`, parentEntity);
    setDisabledInputNames((old) => [
      ...old,
      `administrativeRegion${parentEntity.level}`,
    ]);

    setIsLoading(false);
    propagateParentRegion(parentEntity);
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen((old) => !old)}>
      <DialogTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className="relative border-dashed w-fit justify-start text-left font-medium"
        >
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          Filter by Region
          {currentlyAppliedCount > 0 && (
            <span className="rounded-full size-4 bg-red-500 absolute -top-2 -right-2 p-2 flex items-center justify-center text-white text-[11px] font-semibold">
              {currentlyAppliedCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px] !overflow-visible"
        disableBackdropClose
      >
        {isLoading && (
          <div className="absolute animate-opacity backdrop-blur-sm w-full rounded-lg z-[1] h-full flex items-center justify-center flex-col gap-2">
            <Loader2 className="size-10 animate-spin" />
            <p className="font-medium pl-2">Please wait...</p>
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Apply region filters</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          <AsyncSelect
            label={deploymentSettings?.adminLevel1Name ?? 'Admin Level 1'}
            name="administrativeRegion1"
            control={control}
            useInfiniteQueryFunction={useAdminRegionsInfinite}
            useSearchTextQueryFilter
            queryFilters={{
              level: '1',
              id: currentFormAdministrativeRegion2?.parentId ?? '',
            }}
            labelKey="name"
            valueKey="id"
            disabled={
              disabledInputNames.includes('administrativeRegion1') &&
              !!currentFormAdministrativeRegion2
            }
          />

          <AsyncSelect
            label={deploymentSettings?.adminLevel2Name ?? 'Admin Level 2'}
            name="administrativeRegion2"
            control={control}
            useInfiniteQueryFunction={useAdminRegionsInfinite}
            useSearchTextQueryFilter
            queryFilters={{
              level: '2',
              id: currentFormAdministrativeRegion3?.parentId ?? '',
              parentId: currentFormAdministrativeRegion1?.id ?? '',
            }}
            labelKey="name"
            valueKey="id"
            onChangeCallback={propagateParentRegion}
            disabled={
              disabledInputNames.includes('administrativeRegion2') &&
              !!currentFormAdministrativeRegion3
            }
          />
          <AsyncSelect
            label={deploymentSettings?.adminLevel3Name ?? 'Admin Level 3'}
            name="administrativeRegion3"
            control={control}
            useInfiniteQueryFunction={useAdminRegionsInfinite}
            useSearchTextQueryFilter
            queryFilters={{
              level: '3',
              id: currentFormAdministrativeRegion4?.parentId ?? '',
              parentId: currentFormAdministrativeRegion2?.id ?? '',
            }}
            labelKey="name"
            valueKey="id"
            onChangeCallback={propagateParentRegion}
            disabled={
              disabledInputNames.includes('administrativeRegion3') &&
              !!currentFormAdministrativeRegion4
            }
          />
          <AsyncSelect
            label={deploymentSettings?.adminLevel4Name ?? 'Admin Level 4'}
            name="administrativeRegion4"
            control={control}
            useInfiniteQueryFunction={useAdminRegionsInfinite}
            useSearchTextQueryFilter
            queryFilters={{
              level: '4',
              parentId: currentFormAdministrativeRegion3?.id ?? '',
            }}
            labelKey="name"
            valueKey="id"
            onChangeCallback={propagateParentRegion}
          />
        </div>
        <DialogFooter className="mt-2">
          <div className="w-full flex justify-between flex-col sm:flex-row gap-3">
            <Button type="button" onClick={onClearFilters} variant="secondary">
              Clear filters
            </Button>
            <Button type="button" onClick={onApplyFilters}>
              Apply
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
