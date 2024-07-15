import { Control } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { HOUSEHOLDS_VULNERABILITY_CRITERIA } from '@/services/referrals/const';

interface Props {
  control: Control<any, any>;
  disabled: boolean;
}

export const MpcaSpecificForm = ({ control, disabled }: Props) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="displacementStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel requiredField>Displacement status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select displacement status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="idp">IDP</SelectItem>
                  <SelectItem value="nonDisplaced">Non-displaced</SelectItem>
                  <SelectItem value="returnee">Returnee</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="householdSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel requiredField>Household size</FormLabel>
              <FormControl>
                <Input id="householdSize" placeholder="Number" type="number" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="householdMonthlyIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel requiredField>Household monthly income</FormLabel>
              <FormControl>
                <Input id="householdMonthlyIncome" placeholder="Number" type="number" {...field} disabled={disabled} />
              </FormControl>
              <FormDescription>Includes income of all household members, inclusive of social benefits</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Separator />
      <div>
        <FormField
          control={control}
          name="householdsVulnerabilityCriteria"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Household vulnerability criteria</FormLabel>
              </div>
              {HOUSEHOLDS_VULNERABILITY_CRITERIA.map((item) => (
                <FormField
                  key={item.id}
                  control={control}
                  name="householdsVulnerabilityCriteria"
                  render={({ field }) => {
                    return (
                      <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            disabled={disabled}
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(field.value?.filter((value: any) => value !== item.id));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
