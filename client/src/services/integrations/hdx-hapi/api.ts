import { useQuery } from '@tanstack/react-query';

import axios from 'axios';

enum QueryKeys {
  HdxHapiAppIdentifier = 'hdx_hapi_app_identifier',
}

const generateAppIdentifier = async ({
  application,
  email,
}: {
  application: string;
  email: string;
}): Promise<{ encoded_app_identifier: string }> => {
  const resp = await axios.get(
    `https://hapi.humdata.org/api/v1/encode_app_identifier?application=${application}&email=${email}`,
  );

  return resp.data;
};

export const useHdxHapiGenerateAppIdentifier = ({ application, email }: { application: string; email: string }) => {
  return useQuery([QueryKeys.HdxHapiAppIdentifier, application, email], () =>
    generateAppIdentifier({ application, email }),
  );
};
