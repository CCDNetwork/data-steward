import { TableColumn } from '@/components/DataTable/types';
import { BeneficiaryAttribute } from '@/services/beneficiaryAttribute';
import { Switch } from '@/components/ui/switch';

export const columns = (
  onDeduplicationToggleClick: ({ id, usedForDeduplication }: BeneficiaryAttribute) => Promise<void>,
): TableColumn<BeneficiaryAttribute>[] => [
  {
    accessorKey: 'name',
    id: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    id: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'usedForDeduplication',
    id: 'usedForDeduplication',
    header: () => <div className="text-right">Used For Deduplication</div>,
    cell: ({ row }) => {
      const { usedForDeduplication } = row.original;

      return (
        <div className="text-right">
          <Switch checked={usedForDeduplication} onClick={() => onDeduplicationToggleClick(row.original)} />
        </div>
      );
    },
  },
];
