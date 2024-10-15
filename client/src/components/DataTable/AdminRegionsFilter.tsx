import { useState } from 'react';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';

import { AdministrativeRegion } from '@/services/administrativeRegions/types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/GlobalProvider';
import { useAdminRegionsInfinite } from '@/services/administrativeRegions';

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

  const form = useForm<{ [key: string]: AdministrativeRegion[] | null }>({
    defaultValues: {
      administrativeRegion1: null,
      administrativeRegion2: null,
      administrativeRegion3: null,
      administrativeRegion4: null,
    },
  });

  const { control, watch, reset } = form;

  const regions = [
    'administrativeRegion1',
    'administrativeRegion2',
    'administrativeRegion3',
    'administrativeRegion4',
  ];

  const currentFormAdministrativeRegions = watch(regions);

  const currentAdminRegionFilters = Object.fromEntries(
    regions.map((region, index) => [
      `${region}Id[in][or]`,
      currentFormAdministrativeRegions[index]?.map((i) => i.id).join('|') ?? '',
    ])
  );

  const adminRegionFilters = Object.fromEntries(
    Object.entries(currentAdminRegionFilters)
      .filter(([, value]) => value !== '')
      .map(([key, value], idx) => [
        idx === 0 ? key.replace('[or]', '') : key,
        value,
      ])
  );

  const onApplyFilters = () => {
    setCurrentFilters((old) => {
      const oldFiltersWithoutAdminRegions = Object.fromEntries(
        Object.entries(old).filter(
          ([key]) => !key.startsWith('administrativeRegion')
        )
      );

      return {
        ...oldFiltersWithoutAdminRegions,
        ...adminRegionFilters,
      };
    });

    setOpen(false);
  };

  const onClearFilters = () => {
    setCurrentFilters((old) => {
      const filteredFilters = Object.fromEntries(
        Object.entries(old).filter(
          ([key]) => !key.startsWith('administrativeRegion')
        )
      );

      return filteredFilters;
    });
    setOpen(false);
    setTimeout(() => reset(), 150);
  };

  const currentlyAppliedCount = Object.keys(currentFilters).filter(
    (i) => i.startsWith('administrativeRegion') && currentFilters[i]
  ).length;

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
            queryFilters={{ level: '1' }}
            labelKey="name"
            valueKey="id"
            multiple
          />

          <AsyncSelect
            label={deploymentSettings?.adminLevel2Name ?? 'Admin Level 2'}
            name="administrativeRegion2"
            control={control}
            useInfiniteQueryFunction={useAdminRegionsInfinite}
            useSearchTextQueryFilter
            queryFilters={{ level: '2' }}
            labelKey="name"
            valueKey="id"
            multiple
            getOptionLabel={(region) => {
              if (region.path) {
                return region.name + ` (${region.path})`;
              }

              return region.name;
            }}
          />
          <AsyncSelect
            label={deploymentSettings?.adminLevel3Name ?? 'Admin Level 3'}
            name="administrativeRegion3"
            control={control}
            useInfiniteQueryFunction={useAdminRegionsInfinite}
            useSearchTextQueryFilter
            queryFilters={{ level: '3' }}
            labelKey="name"
            valueKey="id"
            multiple
            getOptionLabel={(region) => {
              if (region.path) {
                return region.name + ` (${region.path})`;
              }

              return region.name;
            }}
          />
          <AsyncSelect
            label={deploymentSettings?.adminLevel4Name ?? 'Admin Level 4'}
            name="administrativeRegion4"
            control={control}
            useInfiniteQueryFunction={useAdminRegionsInfinite}
            useSearchTextQueryFilter
            queryFilters={{ level: '4' }}
            labelKey="name"
            valueKey="id"
            multiple
            getOptionLabel={(region) => {
              if (region.path) {
                return region.name + ` (${region.path})`;
              }

              return region.name;
            }}
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
