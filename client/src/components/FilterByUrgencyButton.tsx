import * as React from 'react';
import { HourglassIcon } from 'lucide-react';

import { Button } from './ui/button';

interface FilterByUrgencyButtonProps {
  filterName: string;
  label: string;
  currentFilters: Record<string, string>;
  setCurrentFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const FilterByUrgencyButton = ({
  filterName,
  label,
  currentFilters,
  setCurrentFilters,
}: FilterByUrgencyButtonProps) => {
  const handleClick = () => {
    if (currentFilters[filterName]) {
      setCurrentFilters((old) => ({ ...old, [filterName]: '' }));
    } else {
      setCurrentFilters((old) => ({ ...old, [filterName]: 'true' }));
    }
  };

  const isFilterActive = !!currentFilters[filterName];

  return (
    <Button variant={isFilterActive ? 'destructive' : 'outline'} onClick={handleClick} className="border-dashed">
      <HourglassIcon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
};
