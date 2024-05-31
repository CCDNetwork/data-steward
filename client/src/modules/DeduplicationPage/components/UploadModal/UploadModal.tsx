import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTemplatesInfinite } from '@/services/templates/api';
import { Form } from '@/components/ui/form';
import { AsyncSelect } from '@/components/AsyncSelect';
import { useAuth } from '@/providers/GlobalProvider';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

import { DeduplicationUploadForm, DeduplicationUploadFormSchema } from './validation';
import { toast } from '@/components/ui/use-toast';
import { Upload } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

interface Props {
  isOpen: boolean;
  deduplicationType: 'single' | 'multiple';
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UploadModal = ({ isOpen, deduplicationType, setIsOpen }: Props) => {
  const queryClient = useQueryClient();
  const { organization, token } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<DeduplicationUploadForm>({
    defaultValues: {
      template: undefined,
    },
    mode: 'onChange',
    resolver: zodResolver(DeduplicationUploadFormSchema),
  });

  const { control, reset } = form;

  const handleUploadClick = async () => {
    try {
      const isFormValid = await form.trigger('template');
      if (!isFormValid) return;

      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      fileInput.click();
    } catch {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: 'Please try again.',
      });
    }
  };

  const onOpenChange = () => {
    setIsOpen((old) => !old);
    reset();
  };

  const handleUploadChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'single' | 'multiple') => {
    setIsLoading(true);
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('templateID', form.getValues('template.id'));

      try {
        const response = await axios.post(`${API_URL}/api/v1/deduplication/deduplicate`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'organization-id': organization?.id,
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'deduplication.' + file.name.split('.').pop());
        document.body.appendChild(link);
        link.click();
        link.remove();

        if (type === 'multiple') {
          queryClient.invalidateQueries(['deduplication-listings']);
        }

        toast({
          title: 'Success!',
          variant: 'default',
          description: 'Deduplication successful',
        });
      } catch (error: any) {
        toast({
          title: 'An error has occured!',
          variant: 'destructive',
          description: error.response?.data?.errorMessage || 'Something went wrong while deduplicating.',
        });
      }

      e.target.value = '';
    }

    onOpenChange();
    setTimeout(() => setIsLoading(false), 300);
  };

  const modalTitle = deduplicationType === 'single' ? 'Internal Deduplication' : 'Registry Deduplication';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] overflow-visible">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>Choose a template and upload your dataset</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form>
            <div className="grid grid-cols-1 gap-4">
              <AsyncSelect
                label="Template"
                name="template"
                control={control}
                useInfiniteQueryFunction={useTemplatesInfinite}
                labelKey="name"
                valueKey="id"
              />
              <Button
                type="button"
                variant="outline"
                isLoading={isLoading}
                disabled={isLoading}
                onClick={handleUploadClick}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload your file
              </Button>
            </div>
          </form>
        </Form>
        <input
          type="file"
          className="hidden"
          id="file-input"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUploadChange(e, deduplicationType)}
        />
      </DialogContent>
    </Dialog>
  );
};
