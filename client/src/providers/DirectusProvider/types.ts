export interface HomepageData {
  id: number;
  homepage_id: number;
  admin: string;
  dashboard: string;
  handbook: string;
  deduplication: string;
  handbook_entries: string;
  languages_code: string;
  manage_duplicates: string;
  manage_received: string;
  manage_sent: string;
  manage_templates: string;
  organisations: string;
  referrals: string;
  rules: string;
  users: string;
}

export interface DirectusSchema {
  ['homepage_translations']: HomepageData[];
}
