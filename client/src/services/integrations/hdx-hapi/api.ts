import { useQuery } from '@tanstack/react-query';

import axios from 'axios';
import { resToAdminLevel1, resToAdminLevel2 } from './transformations';
import { AdminLevel1, AdminLevel2 } from './types';

enum QueryKeys {
  HdxHapiAppIdentifier = 'hdx_hapi_app_identifier',
  AdminLevel1 = 'admin_level_1',
  AdminLevel2 = 'admin_level_2',
}

const generateAppIdentifier = async ({
  application,
  email,
}: {
  application: string;
  email: string;
}): Promise<{ encoded_app_identifier: string }> => {
  const resp = await axios.get(
    `https://hapi.humdata.org/api/v1/encode_app_identifier?application=${application}&email=${email}`
  );

  return resp.data;
};

const getUkraineAdminLvl1Data = async ({
  APP_IDENTIFIER,
}: {
  APP_IDENTIFIER: string;
}): Promise<AdminLevel1[]> => {
  const resp = await axios.get(
    `https://hapi.humdata.org/api/v1/metadata/admin1?location_code=UKR&output_format=json&app_identifier=${APP_IDENTIFIER}`
  );

  return resp.data.data.map(resToAdminLevel1);
};

const getUkraineAdminLvl2Data = async ({
  APP_IDENTIFIER,
}: {
  APP_IDENTIFIER: string;
}): Promise<AdminLevel2[]> => {
  const resp = await axios.get(
    `https://hapi.humdata.org/api/v1/metadata/admin2?location_code=UKR&output_format=json&app_identifier=${APP_IDENTIFIER}`
  );

  return resp.data.data.map(resToAdminLevel2);
};

export const useHdxHapiGenerateAppIdentifier = ({
  application,
  email,
}: {
  application: string;
  email: string;
}) => {
  return useQuery([QueryKeys.HdxHapiAppIdentifier, application, email], () =>
    generateAppIdentifier({ application, email })
  );
};

export const useUkraineAdminLevel1Data = ({
  APP_IDENTIFIER,
}: {
  APP_IDENTIFIER: string;
}) => {
  return useQuery(
    [QueryKeys.AdminLevel1],
    () => getUkraineAdminLvl1Data({ APP_IDENTIFIER }),
    {
      enabled: !!APP_IDENTIFIER,
    }
  );
};

export const useUkraineAdminLevel2Data = ({
  APP_IDENTIFIER,
}: {
  APP_IDENTIFIER: string;
}) => {
  return useQuery(
    [QueryKeys.AdminLevel2],
    () => getUkraineAdminLvl2Data({ APP_IDENTIFIER }),
    {
      enabled: !!APP_IDENTIFIER,
    }
  );
};
