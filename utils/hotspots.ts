import { camelCase } from 'lodash';
import { Hotspot, HotspotStatus } from '../context';
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

  const hotspots = data.map(
    ({
      id,
      latitude,
      longitude,
      status,
    }: {
      id: string;
      latitude: string;
      longitude: string;
      status: string;
    }) => ({
      id,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      status: HotspotStatus[camelCase(status) as keyof typeof HotspotStatus],
    })
  );
  return { success: true, hotspots };
};
