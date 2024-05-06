import { Handbook } from '@/services/handbooks';

import { HandbookForm } from '../validation';

export const dataToHandbookForm = (data: Handbook): HandbookForm => {
  return {
    title: data.title,
    content: data.content,
  };
};
