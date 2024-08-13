import * as z from 'zod';

import { requiredSafeHtmlString, safeHtmlString } from '@/helpers/common';

export const TemplateFormSchema = z.object({
  name: requiredSafeHtmlString('Template name is required'),
  firstName: safeHtmlString,
  familyName: safeHtmlString,
  gender: safeHtmlString,
  dateofBirth: safeHtmlString,
  hhid: safeHtmlString,
  mobilePhoneID: safeHtmlString,
  govIDType: safeHtmlString,
  govIDNumber: safeHtmlString,
  otherIDType: safeHtmlString,
  otherIDNumber: safeHtmlString,
  assistanceDetails: safeHtmlString,
  activity: safeHtmlString,
  currency: safeHtmlString,
  currencyAmount: safeHtmlString,
  startDate: safeHtmlString,
  endDate: safeHtmlString,
  frequency: safeHtmlString,
  adminLevel1: safeHtmlString,
  adminLevel2: safeHtmlString,
  adminLevel3: safeHtmlString,
  adminLevel4: safeHtmlString,
});

export type TemplateForm = z.infer<typeof TemplateFormSchema>;
