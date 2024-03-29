import { cn } from '@/helpers/utils';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DynamicMobileHamburger = ({ isOpen, setIsOpen }: Props) => {
  const baseHamburgerStyles = 'h-0.5 w-6 my-0.5 rounded-full bg-white transition ease transform duration-300';

  return (
    <div className="-mr-2 flex md:hidden">
      <button
        className="flex flex-col h-10 w-10 rounded justify-center items-center group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={cn(baseHamburgerStyles, {
            'rotate-45 translate-y-1.5': isOpen,
          })}
        />
        <div
          className={cn(baseHamburgerStyles, {
            'opacity-0': isOpen,
            'opacity-100': !isOpen,
          })}
        />
        <div
          className={cn(baseHamburgerStyles, {
            '-rotate-45 -translate-y-1.5': isOpen,
          })}
        />
      </button>
    </div>
  );
};
