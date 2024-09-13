import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { resToSettings, settingsToReq } from './transformations';
import { Settings } from './types';
import { api } from '../api';

enum QueryKeys {
  Settings = 'settings_query',
}

//
// API calls
//

const fetchSettings = async (): Promise<Settings> => {
  const resp = await api.get('/settings');
  return resToSettings(resp.data);
};

const putSettings = async (
  payload: Omit<Settings, 'id'>
): Promise<Settings> => {
  const resp = await api.put(`/settings`, settingsToReq(payload));
  return resToSettings(resp.data);
};

//
// GET hooks
//

export const useSettings = ({
  queryEnabled = true,
  onSuccessCallback,
}: {
  queryEnabled?: boolean;
  onSuccessCallback?: (data: Settings) => void;
}) => {
  return useQuery([QueryKeys.Settings], () => fetchSettings(), {
    onSuccess: (data) => onSuccessCallback?.(data),
    enabled: queryEnabled,
  });
};

//
// Mutation hooks
//

export const useSettingsMutation = () => {
  const queryClient = useQueryClient();

  return {
    updateSettings: useMutation(putSettings, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.Settings]),
    }),
  };
};
