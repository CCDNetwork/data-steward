import { TableColumn } from '@/components/DataTable/types';
import { Switch } from '@/components/ui/switch';

export const columns = ({
  selectedIds,
  onTableToggleClick,
}: {
  selectedIds: string[];
  onTableToggleClick: (duplicateId: string) => void;
}): TableColumn<any>[] => [
  {
    accessorKey: 'familyName',
    id: 'familyName',
    header: 'Name',
    cell: ({ row }) => {
      const { familyName, firstName } = row.original;
      return (
        <>
          {firstName} {familyName}
        </>
      );
    },
  },
  {
    accessorKey: '',
    id: 'usedForDeduplication',
    header: () => <div className="text-right">Enabled</div>,
    cell: ({ row }) => {
      const { id: duplicateId } = row.original;
      const isChecked = selectedIds.includes(duplicateId);

      return (
        <div className="text-right">
          <Switch checked={isChecked} onClick={() => onTableToggleClick(duplicateId)} />
        </div>
      );
    },
  },
];
