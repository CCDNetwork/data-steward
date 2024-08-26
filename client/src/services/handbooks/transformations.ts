import { Handbook } from './types';

export const resToHandbook = (res: any): Handbook => {
  return {
    id: res.id ?? '',
    title: res.title ?? '',
    content: res.content ?? '',
    createdAt: res.createdAt ? new Date(res.createdAt) : null,
    updatedAt: res.updatedAt ? new Date(res.updatedAt) : null,
  };
};

export const handbookToReq = (
  data: any,
): Omit<Handbook, 'id' | 'createdAt' | 'updatedAt'> => {
  const req: any = {
    title: data.title,
    content: data.content,
  };

  return req;
};
