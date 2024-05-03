import { cn } from '@/helpers/utils';
import { useTheme } from '@/providers/ThemeProvider';
import MDEditor, { MDEditorProps } from '@uiw/react-md-editor';
import { Control, useController } from 'react-hook-form';

interface Props extends MDEditorProps {
  label?: string;
  labelClassName?: string;
  name: string;
  control: Control<any, any>;
}

export const MarkdownEditor: React.FC<Props> = ({ name, control, className, label, labelClassName, ...props }) => {
  const { theme } = useTheme();

  const { field, fieldState } = useController({ name, control });

  return (
    <div data-color-mode={theme}>
      {label && (
        <label
          htmlFor={name}
          className={cn('block text-sm mb-2 font-medium', { 'text-red-500': !!fieldState.error }, labelClassName)}
        >
          {label}
        </label>
      )}
      <MDEditor value={field.value} onChange={field.onChange} className={className} {...props} />
      {!!fieldState.error && <p className="text-red-500 text-[0.8rem] mt-2 font-medium">{fieldState.error.message}</p>}
    </div>
  );
};
