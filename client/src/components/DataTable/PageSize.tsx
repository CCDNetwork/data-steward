import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const PAGE_SIZES = [10, 20, 50];

interface Props {
  pageSize: number;
  pageSizeClicked: (newPageSize: number) => void;
}

export const PageSize = ({ pageSize, pageSizeClicked }: Props) => {
  return (
    <div className="relative">
      <Select
        onValueChange={(val) => pageSizeClicked(parseInt(val, 10))}
        value={pageSize.toString()}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZES.map((pageSize) => (
            <SelectItem key={pageSize} value={pageSize.toString()}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
