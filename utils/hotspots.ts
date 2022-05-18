import {
  castToHotspot,
  castToHotspotDetails,
  Hotspot,
  HotspotDetails,
  toApiModel,
  toUpdateApiModel,
} from '../models/Hotspot';
import { makeRequest } from './server';

export const loadHotspots = async (): Promise<{
  success: boolean;
  hotspots: Hotspot[];
}> => {
  const { error, data } = await makeRequest({
    path: '/hotspots',
    method: 'GET',
  });

  if (error) {
    console.log('loading hotspots failed', error);
    return { success: false, hotspots: [] };
  }

  return { success: true, hotspots: data.map(castToHotspot) };
};

export const loadHotspotDetails = async (
  hotspotId: string
): Promise<{
  success: boolean;
  hotspotDetails?: HotspotDetails;
}> => {
  const { error, data } = await makeRequest({
    path: `/hotspots/${hotspotId}`,
    method: 'GET',
  });

  if (error) {
    console.log('loading hotspots failed', error);
    return { success: false };
  }

  return { success: true, hotspotDetails: castToHotspotDetails(data) };
};

export const updateHotspot = async (
  hotspotDetails: HotspotDetails
): Promise<{
  success: boolean;
  hotspotDetails?: HotspotDetails;
}> => {
  const { error, data } = await makeRequest({
    path: `/hotspots/${hotspotDetails.id}`,
    method: 'PATCH',
    body: toUpdateApiModel(hotspotDetails),
  });

  if (error) {
    console.error('update hotspot failed', error);
    return { success: false };
  }

  return { success: true, hotspotDetails: castToHotspotDetails(data) };
};

export const addHotspot = async (
  hotspotDetails: HotspotDetails
): Promise<{
  success: boolean;
  hotspotDetails?: HotspotDetails;
}> => {
  const { error, data } = await makeRequest({
    path: '/hotspots',
    method: 'POST',
    body: toApiModel(hotspotDetails),
  });

  if (error) {
    console.error('create hotspot failed', error);
    return { success: false };
  }

  return { success: true, hotspotDetails: castToHotspotDetails(data) };
};
