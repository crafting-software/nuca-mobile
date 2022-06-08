import { castToCat, Cat, toCatApiModel } from '../models/Cat';
import { makeRequest } from './server';

export const addCat = async (
  cat: Cat,
  hotspotId: string
): Promise<{
  success: boolean;
  cat?: Cat;
}> => {
  const { error, data } = await makeRequest({
    path: '/cats',
    method: 'POST',
    body: toCatApiModel(cat, hotspotId),
  });

  if (error) {
    console.error('add cat failed', error);
    return { success: false };
  }

  return { success: true, cat: castToCat(data.data) };
};

export const updateCat = async (
  cat: Cat
): Promise<{
  success: boolean;
  cat?: Cat;
}> => {
  const { error, data } = await makeRequest({
    path: `/cats/${cat.id}`,
    method: 'PATCH',
    body: toCatApiModel(cat),
  });

  if (error) {
    console.error('update cat failed', error);
    return { success: false };
  }
  return { success: true, cat: castToCat(data.data) };
};

export const deleteCatRequest = async (
  catId: string
): Promise<{
  success: boolean;
}> => {
  const { error, data } = await makeRequest({
    path: `/cats/${catId}`,
    method: 'DELETE',
  });

  if (error) {
    console.error('delete cat failed', error);
    return { success: false };
  }

  return { success: true };
};
