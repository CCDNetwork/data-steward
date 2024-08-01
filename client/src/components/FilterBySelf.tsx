import * as React from 'react';
import { User2 } from 'lucide-react';

import { Button } from './ui/button';

interface FilterBySelfProps {
  filterName: string;
  value: string;
  label: string;
  currentFilters: Record<string, string>;
  setCurrentFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const FilterBySelf = ({ filterName, label, value, currentFilters, setCurrentFilters }: FilterBySelfProps) => {
  const handleClick = () => {
    if (currentFilters[filterName]) {
      setCurrentFilters((old) => ({ ...old, [filterName]: '' }));
    } else {
      setCurrentFilters((old) => ({ ...old, [filterName]: value }));
    }
  };

  const isFilterActive = !!currentFilters[filterName];
  return (
    <Button variant={isFilterActive ? 'default' : 'outline'} onClick={handleClick} className="border-dashed">
      <User2 className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
};
