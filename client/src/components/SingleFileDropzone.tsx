import { useCallback } from 'react';
import { Control, useController } from 'react-hook-form';
import { FileSpreadsheetIcon, UploadCloudIcon } from 'lucide-react';
import { useDropzone, FileRejection } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { cn } from '@/helpers/utils';

import { toast } from './ui/use-toast';

interface SingleFileDropzoneProps {
  name: string;
  control: Control<any, any>;
}

export const SingleFileDropzone: React.FC<SingleFileDropzoneProps> = ({
  name,
  control,
}) => {
  const { field, fieldState } = useController({
    control,
    name,
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      field.onChange(acceptedFiles[0]);

      if (rejectedFiles && rejectedFiles.length) {
        toast({
          title: 'An error has occured',
          variant: 'destructive',
          description: rejectedFiles[0].errors?.[0].message,
        });
      }
    },
    [field]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'pplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    // maxSize: 10485760, // 10MB
    disabled: !!field.value,
  });

  const removeClicked = (ev: any) => {
    ev.preventDefault();

    field.onChange(undefined);
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 relative border-dashed bg-muted/20 rounded-xl flex items-center justify-center h-44 text-center transition-colors duration-300',
        { 'bg-primary/5': isDragActive },
        { 'hover:border-primary hover:cursor-pointer': !field.value },
        { 'border-red-500': !!fieldState.error }
      )}
    >
      <input {...getInputProps()} />
      {isDragActive && (
        <p className="text-muted-foreground">Drop your file here...</p>
      )}
      {!isDragActive && !field.value && (
        <div className="flex items-center gap-2 flex-col text-muted-foreground">
          <UploadCloudIcon className={'size-12 stroke-1'} />
          <p>Click to choose a file or drag & drop it here</p>
        </div>
      )}
      {field.value && (
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <FileSpreadsheetIcon className="size-12 stroke-1 shrink-0" />
          <span className="leading-none">{field.value.name}</span>
          <Button
            type="button"
            variant="link"
            className="hover:text-red-500 text-red-600"
            onClick={removeClicked}
          >
            Remove
          </Button>
        </div>
      )}
      {!!fieldState.error && (
        <p className="text-destructive absolute -bottom-7 left-0 text-[0.8rem] mt-2 font-medium">
          File is required
        </p>
      )}
    </div>
  );
};
