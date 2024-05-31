import { useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { PAGE_TYPE } from '@/helpers/constants';

export const useIdFromParams = () => {
  const params = useParams();
  const location = useLocation();

  const id = useMemo(() => {
    const lastItem = location.pathname.split('/').pop();

    if (params.id === 'new' || lastItem === 'new') {
      return PAGE_TYPE.Create;
    }
    return params.id || '';
  }, [params.id, location.pathname]);

  const isCreate = useMemo(() => {
    return id === PAGE_TYPE.Create;
  }, [id]);

  return { id, isCreate };
};

export const formatCurrency = ({ value, fractionDigits = 0 }: { value: number; fractionDigits?: number }) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fractionDigits,
  }).format(value);
};

export const capitalizeFirstLetter = (str: string): string => {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};

export const createDownloadLink = (url: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const shortenId = (id: string | undefined) => {
  return id ? id.substring(id.length - 6) : '';
};
