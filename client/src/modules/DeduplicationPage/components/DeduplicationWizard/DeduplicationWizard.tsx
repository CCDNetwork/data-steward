import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircleIcon,
  Download,
  FileSpreadsheet,
  FileSpreadsheetIcon,
  Loader2,
  PaperclipIcon,
} from 'lucide-react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTemplatesInfinite } from '@/services/templates/api';
import { Form } from '@/components/ui/form';
import { AsyncSelect } from '@/components/AsyncSelect';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  DeduplicationDataset,
  SameOrgDedupeResponse,
  SystemOrgDedupeResponse,
  useDeduplicationMutation,
} from '@/services/deduplication';
import { useAuth } from '@/providers/GlobalProvider';
import { cn } from '@/helpers/utils';
import { appendStringToFilename, createDownloadLink } from '@/helpers/common';
import { DataTable } from '@/components/DataTable';

import { DeduplicationUploadForm, DeduplicationUploadFormSchema } from './validation';
import { AnimationWrapper, DeduplicationError, DeduplicationSteps, DeduplicationSuccess } from './components';
import { BENEFICIARY_FIELDS, WIZARD_STEP } from './const';
import { columns } from './columns';
import { useDeduplicationProvider } from '../../DeduplicationPageProvider';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// TODO: Ivan -> Clean the wizard-mvp up and separate each step inside their own components
export const DeduplicationWizard = ({ isOpen, setIsOpen }: Props) => {
  const { organization } = useAuth();
  const { deduplicationWizardError, setDeduplicationWizardError } = useDeduplicationProvider();
  const [currentStep, setCurrentStep] = useState<number>(WIZARD_STEP.FILE_UPLOAD);
  const [fileToUpload, setFileToUpload] = useState<File | undefined>(undefined);
  const [internalFileDedupResponse, setInternalFileDedupResponse] = useState<DeduplicationDataset | null>(null);
  const [sameOrgDedupResponse, setSameOrgDedupResponse] = useState<SameOrgDedupeResponse | null>(null);
  const [systemOrgDedupResponse, setSystemOrgDedupResponse] = useState<SystemOrgDedupeResponse | null>(null);

  const { deduplicateFile, deduplicateSameOrganization, deduplicateSystemOrganizations, deduplicateFinish } =
    useDeduplicationMutation();

  const form = useForm<DeduplicationUploadForm>({
    defaultValues: {
      template: undefined,
    },
    mode: 'onChange',
    resolver: zodResolver(DeduplicationUploadFormSchema),
  });

  const { control, reset, watch } = form;
  const currentTemplate = watch('template');

  const handleChooseFileClick = async () => {
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

    setTimeout(() => {
      reset();
      // check these 3
      setFileToUpload(undefined);
      setInternalFileDedupResponse(null);
      setCurrentStep(WIZARD_STEP.FILE_UPLOAD);
      setDeduplicationWizardError(undefined);
    }, 300);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileToUpload(file);
    e.target.value = '';
  };

  const handleInternalFileDeduplication = async () => {
    if (!fileToUpload) return;

    try {
      const resp = await deduplicateFile.mutateAsync({ file: fileToUpload, templateId: currentTemplate.id });
      setInternalFileDedupResponse(resp);
    } catch (error: any) {
      toast({
        title: 'An error has occured!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Something went wrong, please try again.',
      });
    }
  };

  const handleSameOrganizationDeduplication = async () => {
    try {
      const resp = await deduplicateSameOrganization.mutateAsync({
        fileId: internalFileDedupResponse?.file.id ?? '',
        templateId: currentTemplate.id,
      });
      setSameOrgDedupResponse(resp);
    } catch (error: any) {
      toast({
        title: 'An error has occured!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Something went wrong, please try again.',
      });
    }
  };

  const handleSystemOrganizationsDeduplication = async () => {
    try {
      const resp = await deduplicateSystemOrganizations.mutateAsync({
        fileId: internalFileDedupResponse?.file.id ?? '',
        templateId: currentTemplate.id,
      });
      setSystemOrgDedupResponse(resp);
    } catch (error: any) {
      toast({
        title: 'An error has occured!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Something went wrong, please try again.',
      });
    }
  };

  const handleWizardFinish = async () => {
    try {
      await deduplicateFinish.mutateAsync({
        fileId: internalFileDedupResponse?.file.id ?? '',
        templateId: currentTemplate.id,
      });
      setCurrentStep(WIZARD_STEP.SUCCESSS);
    } catch (error: any) {
      toast({
        title: 'An error has occured!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Something went wrong, please try again.',
      });
    }
  };

  const handleContinueClick = async () => {
    if (currentStep !== WIZARD_STEP.REGISTRY_DEDUPLICATION) {
      setCurrentStep((prev) => ++prev);
    }

    switch (currentStep) {
      case WIZARD_STEP.FILE_UPLOAD:
        await handleInternalFileDeduplication();
        break;
      case WIZARD_STEP.INTERNAL_FILE_DEDUPLICATION:
        await handleSameOrganizationDeduplication();
        break;
      case WIZARD_STEP.ORGANIZATION_DEDUPLICATION:
        await handleSystemOrganizationsDeduplication();
        break;
      case WIZARD_STEP.REGISTRY_DEDUPLICATION:
        await handleWizardFinish();
        break;
    }
  };

  const isContinueButtonDisabled = useMemo(() => {
    if (currentStep === WIZARD_STEP.FILE_UPLOAD && (!fileToUpload || !currentTemplate)) {
      return true;
    }

    if (currentStep === WIZARD_STEP.INTERNAL_FILE_DEDUPLICATION && internalFileDedupResponse?.duplicates) {
      return true;
    }

    return false;
  }, [currentStep, fileToUpload, currentTemplate, internalFileDedupResponse]);

  const isWizardProcessing =
    deduplicateFile.isLoading ||
    deduplicateSameOrganization.isLoading ||
    deduplicateSystemOrganizations.isLoading ||
    deduplicateFinish.isLoading;

  const handleDownloadDuplicatesFile = (url: string, filename: string) => {
    createDownloadLink(url, filename);
  };

  const duplicateFileName = appendStringToFilename(internalFileDedupResponse?.file.name ?? '-', '-duplicates');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-4" showCloseButton={false} disableBackdropClose>
        {deduplicationWizardError ? (
          <DeduplicationError onOpenChange={onOpenChange} errorMessage={deduplicationWizardError.message} />
        ) : (
          <>
            {currentStep !== WIZARD_STEP.SUCCESSS ? (
              <>
                <div className="border rounded-lg flex flex-col">
                  <DeduplicationSteps currentStep={currentStep} />
                  <div
                    className={cn('flex flex-col items-center p-4 py-8 min-h-[410px]', {
                      'pt-0': currentStep !== WIZARD_STEP.FILE_UPLOAD,
                    })}
                  >
                    {currentStep !== WIZARD_STEP.FILE_UPLOAD && (
                      <div className="flex w-full flex-col justify-center items-center mx-auto text-sm py-4 mb-6 border-b max-w-[500px]">
                        <div className="flex flex-col w-full gap-1">
                          <div className="flex justify-between">
                            <span>Uploaded file:</span>
                            <p className="flex items-center rounded-md gap-1.5 px-2 py-0.5 bg-muted">
                              <FileSpreadsheet className="w-4 h-4" />
                              {fileToUpload?.name ?? ''}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <span>Selected template:</span>
                            <p className="flex rounded-md px-2 py-0.5 bg-muted">{currentTemplate.name ?? ''}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      <div className="flex items-center h-full">
                        {currentStep === WIZARD_STEP.FILE_UPLOAD && (
                          <AnimationWrapper key={WIZARD_STEP.FILE_UPLOAD}>
                            <Form {...form}>
                              <form>
                                <div className="grid grid-cols-1 place-items-center mx-auto max-w-[400px] divide-y">
                                  <div className="pb-4 flex flex-col gap-1 text-center">
                                    <h1 className="font-semibold tracking-tight text-2xl">
                                      Welcome to the deduplication wizard
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                      {"Let's start the deduplication process."}
                                    </p>
                                  </div>
                                  <div className="py-4">
                                    <AsyncSelect
                                      label="Select the template that describes your dataset"
                                      labelClassName="pb-1.5"
                                      name="template"
                                      requiredField
                                      control={control}
                                      useInfiniteQueryFunction={useTemplatesInfinite}
                                      labelKey="name"
                                      valueKey="id"
                                    />
                                    <p className="text-xs text-muted-foreground pt-1.5">
                                      Templates map column header names to the platform’s data standard. If you are
                                      unsure which template applies to you, ask your colleagues or contact the platform
                                      admin.
                                    </p>
                                  </div>
                                  <div className="pt-4 w-full">
                                    {fileToUpload ? (
                                      <div className="flex flex-col items-center justify-center border bg-muted py-3.5 rounded-lg transition-all duration-150 animate-appear">
                                        <p className="text-xs text-muted-foreground font-medium">Selected file</p>
                                        <div className="flex gap-2 items-center">
                                          <FileSpreadsheetIcon className="w-5 h-5" />
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
                                          Make sure you’re uploading an Excel file (.xlsx, .xls), and that the file is a
                                          simple spreadsheet with a single page of column headers and rows. (Maximum of
                                          4,000 rows) The file should not have images, charts, or custom formatting.
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </form>
                            </Form>
                          </AnimationWrapper>
                        )}
                        {currentStep === WIZARD_STEP.INTERNAL_FILE_DEDUPLICATION && (
                          <AnimationWrapper key={WIZARD_STEP.INTERNAL_FILE_DEDUPLICATION}>
                            {deduplicateFile.isLoading ? (
                              <div className="flex flex-col items-center justify-center gap-4 max-w-[400px] mx-auto">
                                <Loader2 className="w-16 h-16 animate-spin" />
                                <p className="text-center text-sm">
                                  The platform is checking the uploaded file for double entries...
                                </p>
                                <span className="flex flex-col gap-1">
                                  <p className="text-sm text-center text-red-500 font-medium">
                                    Warning: Do Not Refresh the Page
                                  </p>
                                  <p className="text-xs text-center text-muted-foreground">
                                    Please do not refresh the wizard until the check process of the file is complete.
                                    Refreshing the page will interrupt the process and you will need to start over from
                                    the beginning. Thank you for your patience.
                                  </p>
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2 max-w-[500px] mx-auto">
                                {!internalFileDedupResponse?.duplicates ? (
                                  <div className="flex flex-col items-center justify-center gap-4 text-sm">
                                    <CheckCircleIcon className="w-16 h-16 text-green-600" />
                                    <p className="pb-4">
                                      The platform has found no duplicate records within this file.
                                    </p>
                                    <p>
                                      Next, we will check data from the uploaded file against records previously
                                      uploaded by{' '}
                                      <span className="px-1 border border-border rounded py-0.5 bg-muted font-semibold">
                                        {organization?.name ?? '-'}
                                      </span>
                                      , to see if there are “organisational duplicates“.
                                    </p>
                                    <p className="text-xs text-muted-foreground max-w-[500px] pt-6">
                                      <strong>Note: </strong>
                                      Organisational duplicates are beneficiary data uploaded by your organisation that
                                      matches data in your file. We check for that before adding your data to the
                                      registry.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center gap-2">
                                    <AlertTriangle className="w-16 h-16 text-yellow-500" />
                                    <p className="text-sm">
                                      The platform has found{' '}
                                      <span className="px-1 border border-border rounded py-0.5 bg-muted font-bold">
                                        {internalFileDedupResponse.duplicates}
                                      </span>{' '}
                                      duplicate records within this file. Please make sure there are no duplicate
                                      records and start the wizard again.
                                    </p>
                                    <p className="text-sm">
                                      To assist you, we created a version of your file with a “Duplicate” column. You
                                      can download it below.
                                    </p>

                                    <div className="flex flex-col gap-4">
                                      <div className="flex gap-2">
                                        <p className="px-2 py-1 rounded-md bg-muted w-full flex items-center justify-center border border-border">
                                          <FileSpreadsheetIcon className="w-4 h-4 mr-1.5" />
                                          <p className="max-w-[250px] truncate text-sm">{duplicateFileName}</p>
                                        </p>
                                        <Button
                                          variant="destructive"
                                          onClick={() =>
                                            handleDownloadDuplicatesFile(
                                              internalFileDedupResponse?.file.url ?? '',
                                              duplicateFileName,
                                            )
                                          }
                                        >
                                          <Download className="w-5 h-5 mr-2" />
                                          Download
                                        </Button>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        For privacy reasons, the platform will not keep any information about the file
                                        you uploaded once you exit the wizard.
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </AnimationWrapper>
                        )}
                        {currentStep === WIZARD_STEP.ORGANIZATION_DEDUPLICATION && (
                          <AnimationWrapper key={WIZARD_STEP.ORGANIZATION_DEDUPLICATION}>
                            {deduplicateSameOrganization.isLoading ? (
                              <div className="flex flex-col items-center justify-center gap-4 max-w-[400px] mx-auto">
                                <Loader2 className="w-16 h-16 animate-spin" />
                                <p className="text-center text-sm">
                                  The platform is checking the uploaded file for organisational duplicates...
                                </p>
                                <span className="flex flex-col gap-1">
                                  <p className="text-sm text-center text-red-500 font-medium">
                                    Warning: Do Not Refresh the Page
                                  </p>
                                  <p className="text-xs text-center text-muted-foreground">
                                    Please do not refresh the wizard until the check process of the file is complete.
                                    Refreshing the page will interrupt the process and you will need to start over from
                                    the beginning. Thank you for your patience.
                                  </p>
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2 max-w-[500px] mx-auto">
                                <div className="flex flex-col items-center justify-center gap-4 text-sm">
                                  <CheckCircleIcon className="w-16 h-16 text-green-600" />
                                  <p className="pb-4 text-center">
                                    Out of the{' '}
                                    <span className="px-1 border border-border rounded py-0.5 bg-muted font-bold">
                                      {sameOrgDedupResponse?.totalRecords}
                                    </span>{' '}
                                    beneficiary records, the platform has found{' '}
                                    <span className="px-1 border border-border rounded py-0.5 bg-muted font-bold">
                                      {sameOrgDedupResponse?.identicalRecords}
                                    </span>{' '}
                                    identicals records,{' '}
                                    <span className="px-1 border border-border rounded py-0.5 bg-muted font-bold">
                                      {sameOrgDedupResponse?.potentialDuplicateRecords}
                                    </span>{' '}
                                    potential duplicates and will upload{' '}
                                    <span className="px-1 border border-border rounded py-0.5 bg-muted font-bold">
                                      {(sameOrgDedupResponse?.totalRecords ?? 0) -
                                        (sameOrgDedupResponse?.potentialDuplicateRecords ?? 0) -
                                        (sameOrgDedupResponse?.identicalRecords ?? 0)}
                                    </span>{' '}
                                    new beneficiaries.
                                  </p>
                                  <p>
                                    Next, we will add your data to the registry and check for potential duplicates with
                                    other organisations’ records.
                                  </p>
                                </div>
                              </div>
                            )}
                          </AnimationWrapper>
                        )}
                        {currentStep === WIZARD_STEP.REGISTRY_DEDUPLICATION && (
                          <AnimationWrapper key={WIZARD_STEP.REGISTRY_DEDUPLICATION}>
                            {deduplicateSystemOrganizations.isLoading ? (
                              <div className="flex flex-col items-center justify-center gap-4 max-w-[400px] mx-auto">
                                <Loader2 className="w-16 h-16 animate-spin" />
                                <p className="text-center text-sm">
                                  The platform is adding the uploaded data to the registry and checking for
                                  duplicates...
                                </p>
                                <span className="flex flex-col gap-1">
                                  <p className="text-sm text-center text-red-500 font-medium">
                                    Warning: Do Not Refresh the Page
                                  </p>
                                  <p className="text-xs text-center text-muted-foreground">
                                    Please do not refresh the wizard until the check process of the file is complete.
                                    Refreshing the page will interrupt the process and you will need to start over from
                                    the beginning. Thank you for your patience.
                                  </p>
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2 max-w-[500px] mx-auto">
                                {!systemOrgDedupResponse?.duplicates ? (
                                  <div className="flex flex-col items-center justify-center gap-4 text-sm">
                                    <CheckCircleIcon className="w-16 h-16 text-green-600" />
                                    <p className="pb-4">The platform has found no duplicates in the registry.</p>
                                    <p>Your beneficiary data has been successfully added to the registry.</p>
                                    <p className="text-muted-foreground">
                                      Finish the wizard to import the beneficiaries.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center gap-2">
                                    <AlertTriangle className="w-16 h-16 text-yellow-500" />
                                    <p className="text-sm">
                                      The platform has found{' '}
                                      <span className="px-1 border border-border rounded py-0.5 bg-muted font-bold">
                                        {systemOrgDedupResponse.duplicates}
                                      </span>{' '}
                                      potential duplicates between your upload and the registry.
                                    </p>
                                    <div className="max-w-[500px] w-full">
                                      <DataTable
                                        data={systemOrgDedupResponse?.duplicateBeneficiaries ?? []}
                                        isQueryLoading={false}
                                        columns={columns}
                                        hiddenColumns={Object.fromEntries(
                                          BENEFICIARY_FIELDS.filter(
                                            (i) => !systemOrgDedupResponse.ruleFields.includes(i),
                                          ).map((item) => [item, false]),
                                        )}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </AnimationWrapper>
                        )}
                      </div>
                    </AnimatePresence>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" type="button" disabled={isWizardProcessing} onClick={onOpenChange}>
                    Close
                  </Button>
                  <Button
                    variant="default"
                    type="button"
                    isLoading={currentStep === WIZARD_STEP.REGISTRY_DEDUPLICATION && deduplicateFinish.isLoading}
                    disabled={isContinueButtonDisabled || isWizardProcessing}
                    onClick={handleContinueClick}
                  >
                    {currentStep === WIZARD_STEP.REGISTRY_DEDUPLICATION ? 'Finish' : 'Continue'}
                  </Button>
                </div>
              </>
            ) : (
              <DeduplicationSuccess onOpenChange={onOpenChange} />
            )}
          </>
        )}
        <input
          type="file"
          className="hidden"
          id="file-input"
          accept=".xlsx,.xls"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e)}
        />
      </DialogContent>
    </Dialog>
  );
};
