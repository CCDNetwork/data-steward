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

export const createDownloadLink = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = objectUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Failed to download file:', error);
  }
};

export const shortenId = (id: string | undefined) => {
  return id ? id.substring(id.length - 6) : '';
};

export const appendStringToFilename = (filename: string, appendString: string) => {
  const lastDotIndex = filename.lastIndexOf('.');

  if (lastDotIndex === -1) {
    return filename;
  }

  const namePart = filename.substring(0, lastDotIndex);
  const extensionPart = filename.substring(lastDotIndex);

  const newNamePart = namePart + appendString;

  return (newNamePart + extensionPart).split(' ').join('_');
};
