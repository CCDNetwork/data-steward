import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { Loader2, Settings } from 'lucide-react';

import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { APP_ROUTE } from '@/helpers/constants';
import { useAuth } from '@/providers/GlobalProvider';
import { useSettings, useSettingsMutation } from '@/services/settings/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { SettingsFormData, SettingsFormSchema } from './validations';
import { COUNTRIES_LIST, defaultSettingsFormValues } from './const';

export const SettingsPage = () => {
  const { isLoggedIn, user, logoutUser } = useAuth();

  const { data: settingsData, isLoading: settingsLoading } = useSettings({});

  const { updateSettings } = useSettingsMutation();

  const form = useForm<SettingsFormData>({
    defaultValues: defaultSettingsFormValues,
    resolver: zodResolver(SettingsFormSchema),
  });

  const { control, formState, handleSubmit, reset } = form;

  useEffect(() => {
    if (settingsData) {
      reset(settingsData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsData]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateSettings.mutateAsync(values);
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Settings successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description:
          error.response?.data?.errorMessage || 'Something went wrong',
      });
    }
  });

  if (!isLoggedIn) {
    return <Navigate to={APP_ROUTE.SignIn} replace />;
  }

  if (isLoggedIn && !user.isSuperAdmin) {
    return <Navigate to={APP_ROUTE.Dashboard} replace />;
  }

  if (settingsLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Loader2 className="w-10 h-10 lg:w-20 lg:h-20 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[100svh] w-screen">
      <div className="relative p-6 pt-10 rounded-lg sm:border sm:border-border max-w-3xl w-full">
        <div className="inline-flex items-center sm:absolute w-full sm:justify-start justify-center sm:w-fit sm:left-10 sm:-top-4 font-semibold text-xl sm:text-md sm:pt-0 pt-6 sm:pb-0 pb-6 bg-background sm:px-1">
          <Settings className="size-7 mr-2" /> Deployment Settings
        </div>
        <Form {...form}>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="deploymentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deployment Name</FormLabel>
                    <FormControl>
                      <Input
                        id="deploymentName"
                        placeholder="e.g. CCD Data Portal"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="deploymentCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deployment Country</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COUNTRIES_LIST.map(({ name, code }) => (
                            <SelectItem key={code} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="adminLevel1Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Level 1 Name</FormLabel>
                    <FormControl>
                      <Input
                        id="adminLevel1Name"
                        placeholder="Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="adminLevel2Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Level 2 Name</FormLabel>
                    <FormControl>
                      <Input
                        id="adminLevel2Name"
                        placeholder="Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="adminLevel3Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Level 3 Name</FormLabel>
                    <FormControl>
                      <Input
                        id="adminLevel3Name"
                        placeholder="Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="adminLevel4Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Level 4 Name</FormLabel>
                    <FormControl>
                      <Input
                        id="adminLevel4Name"
                        placeholder="Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name="metabaseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metabase Iframe URL</FormLabel>
                  <FormControl>
                    <Input
                      id="metabaseUrl"
                      maxLength={100}
                      placeholder="URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="flex justify-between p-0">
              <Button
                type="button"
                variant="link"
                className="px-0"
                onClick={logoutUser}
                isLoading={formState.isSubmitting}
                disabled={formState.isSubmitting}
              >
                &larr; Back to Sign In
              </Button>
              <Button
                type="button"
                onClick={onSubmit}
                isLoading={formState.isSubmitting}
                disabled={formState.isSubmitting}
              >
                Save settings
              </Button>
            </CardFooter>
          </div>
        </Form>
      </div>
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
    </div>
  );
};
