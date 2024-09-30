import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ButtonWithDropdownProps {
  buttonLabel: string;
  onButtonClick: () => void;
  dropdownOptions: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }[];
}

export const ButtonWithDropdown: React.FC<ButtonWithDropdownProps> = ({
  buttonLabel,
  dropdownOptions,
  onButtonClick,
}) => {
  return (
    <div className="flex">
      <Button
        type="button"
        variant="default"
        className="rounded-tr-none rounded-br-none"
        onClick={onButtonClick}
      >
        {buttonLabel}
      </Button>
      <span className="w-[1px] bg-primary/80" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="icon"
            className="rounded-tl-none rounded-bl-none"
          >
            <ChevronDown className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {dropdownOptions.map((dropdownItem, idx) => (
            <DropdownMenuItem key={idx} onClick={dropdownItem.onClick}>
              <div className="flex items-center">
                {dropdownItem.icon}
                {dropdownItem.label}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
