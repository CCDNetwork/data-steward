import { Control } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { SentReferralFormData } from '../../validations';

interface Props {
  control: Control<SentReferralFormData, any>;
  isCaregiverInformed: string;
  currentFormCaregiverContactPreference: string;
  disabled: boolean;
}

export const MinorForm = ({ control, isCaregiverInformed, currentFormCaregiverContactPreference, disabled }: Props) => {
  return (
    <>
      <CardDescription>
        Remember: if it is not appropriate to involve the child’s caregiver (for instance if the caregiver is involved
        in the abuse), informed assent should be sought from the younger child
      </CardDescription>

      <FormField
        control={control}
        name="isSeparated"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Is child separated or unaccompanied</FormLabel>
              <FormDescription>Description text</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="caregiver"
          render={({ field }) => (
            <FormItem>
              <FormLabel requiredField>Name of primary caregiver</FormLabel>
              <FormControl>
                <Input
                  id="caregiver"
                  required
                  className=""
                  placeholder="Caregiver name"
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="relationshipToChild"
          render={({ field }) => (
            <FormItem>
              <FormLabel requiredField>Relationship to child</FormLabel>
              <FormControl>
                <Input
                  id="relationshipToChild"
                  required
                  className=""
                  placeholder="Relationship"
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="caregiverContactPreference"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Contact preference</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue="email"
                value={field.value}
                className="flex flex-col space-y-1"
                disabled={disabled}
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="email" />
                  </FormControl>
                  <FormLabel className="font-normal">Email</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="phone" />
                  </FormControl>
                  <FormLabel className="font-normal">Phone</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="visit" />
                  </FormControl>
                  <FormLabel className="font-normal">Visit</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="caregiverEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel requiredField={currentFormCaregiverContactPreference === 'email'}>Email</FormLabel>
              <FormControl>
                <Input
                  id="caregiverEmail"
                  placeholder="email@example.com"
                  type="email"
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="caregiverPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel requiredField={currentFormCaregiverContactPreference === 'phone'}>Phone</FormLabel>
              <FormControl>
                <Input id="caregiverPhone" placeholder="Phone" type="tel" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="isCaregiverInformed"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Is caregiver informed of referral?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col space-y-1"
                disabled={disabled}
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="true" />
                  </FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="false" />
                  </FormControl>
                  <FormLabel className="font-normal">No (provide explanation)</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="caregiverExplanation"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                id="caregiverExplanation"
                placeholder="Explanation..."
                disabled={isCaregiverInformed === 'true' || disabled}
                maxLength={200}
                limitCounterEnabled
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="caregiverNote"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special note or specific need</FormLabel>
            <FormControl>
              <Textarea
                id="caregiverNote"
                placeholder="Enter..."
                maxLength={200}
                limitCounterEnabled
                {...field}
                disabled={disabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
