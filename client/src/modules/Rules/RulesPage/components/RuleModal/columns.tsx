import { TableColumn } from '@/components/DataTable/types';
import { BeneficiaryAttribute } from '@/services/beneficiaryAttribute';
import { Switch } from '@/components/ui/switch';

export const columns = ({
  ruleBeneficiaryAttributeIds,
  onTableToggleClick,
}: {
  ruleBeneficiaryAttributeIds: number[];
  onTableToggleClick: (beneficiaryAttributeId: number) => void;
}): TableColumn<BeneficiaryAttribute>[] => [
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
    accessorKey: '',
    id: 'usedForDeduplication',
    header: () => <div className="text-right">Enabled</div>,
    cell: ({ row }) => {
      const { id: beneficiaryAttributeId } = row.original;
      const isChecked = ruleBeneficiaryAttributeIds.includes(beneficiaryAttributeId);

      return (
        <div className="text-right">
          <Switch checked={isChecked} onClick={() => onTableToggleClick(beneficiaryAttributeId)} />
        </div>
      );
    },
  },
];
