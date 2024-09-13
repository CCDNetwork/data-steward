import { Settings } from '@/services/settings/types';

export const defaultSettingsFormValues: Omit<Settings, 'id'> = {
  deploymentCountry: '',
  deploymentName: '',
  adminLevel1Name: '',
  adminLevel2Name: '',
  adminLevel3Name: '',
  adminLevel4Name: '',
  metabaseUrl: '',
};
