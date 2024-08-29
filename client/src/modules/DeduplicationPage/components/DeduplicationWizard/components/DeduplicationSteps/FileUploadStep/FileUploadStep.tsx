import { FileSpreadsheetIcon, PaperclipIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

import { AsyncSelect } from '@/components/AsyncSelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useTemplatesInfinite } from '@/services/templates/api';
import { toast } from '@/components/ui/use-toast';
import React from 'react';

interface Props {
  form: UseFormReturn<
    {
      template: {
        id: string;
        name: string;
      };
    },
    any,
    undefined
  >;
  fileToUpload: File | undefined;
  setFileToUpload: React.Dispatch<React.SetStateAction<File | undefined>>;
}

export const FileUploadStep: React.FC<Props> = ({
  form,
  fileToUpload,
  setFileToUpload,
}) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileToUpload(file);
    e.target.value = '';
  };

  const handleChooseFileClick = async () => {
    try {
      const isFormValid = await form.trigger('template');
      if (!isFormValid) return;

      const fileInput = document.getElementById(
        'file-input'
      ) as HTMLInputElement;
      fileInput.click();
    } catch {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: 'Please try again.',
      });
    }
  };
  return (
    <>
      <Form {...form}>
        <form>
          <div className="grid grid-cols-1 place-items-center mx-auto max-w-[400px] divide-y">
            <div className="pb-4 flex flex-col gap-1 text-center">
              <h1 className="font-semibold tracking-tight text-2xl">
                Welcome to the deduplication wizard
              </h1>
              <p className="text-sm text-muted-foreground">
                Let&apos;s start the deduplication process.
              </p>
            </div>
            <div className="py-4">
              <AsyncSelect
                label="Select the template that describes your dataset"
                labelClassName="pb-1.5"
                name="template"
                requiredField
                control={form.control}
                useInfiniteQueryFunction={useTemplatesInfinite}
                labelKey="name"
                valueKey="id"
              />
              <p className="text-xs text-muted-foreground pt-1.5">
                Templates map column header names to the platform’s data
                standard. If you are unsure which template applies to you, ask
                your colleagues or contact the platform admin.
              </p>
            </div>
            <div className="pt-4 w-full">
              {fileToUpload ? (
                <div className="flex flex-col items-center justify-center border bg-muted py-3.5 rounded-lg transition-all duration-150 animate-appear">
                  <p className="text-xs text-muted-foreground font-medium">
                    Selected file
                  </p>
                  <div className="flex gap-2 items-center">
                    <FileSpreadsheetIcon className="size-5" />
                    <p className="font-medium">{fileToUpload.name}</p>
                  </div>
                  <Button
                    onClick={() => setFileToUpload(undefined)}
                    type="button"
                    variant="link"
                    size="sm"
                    className="text-red-500 h-fit pt-1"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleChooseFileClick}
                    className="w-full"
                  >
                    <PaperclipIcon className="w-4 h-4 mr-2" />
                    Choose a file
                  </Button>
                  <p className="text-xs text-muted-foreground pt-1.5">
                    Make sure you&apos;re uploading an Excel file (.xlsx, .xls),
                    and that the file is a simple spreadsheet with a single page
                    of column headers and rows. (Maximum of 4,000 rows) The file
                    should not have images, charts, or custom formatting.
                  </p>
                </>
              )}
            </div>
          </div>
        </form>
      </Form>
      <input
        type="file"
        className="hidden"
        id="file-input"
        accept=".xlsx,.xls"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleFileChange(e)
        }
      />
    </>
  );
};
