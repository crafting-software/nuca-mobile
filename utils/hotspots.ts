import { geocodeMapsCoServerAddress, geocodingMapsCoKey } from '../config';
import {
  castToHotspot,
  castToHotspotDetails,
  Hotspot,
  HotspotDetails,
  LocationItemProps,
  toApiModel,
} from '../models/Hotspot';
import { Location } from '../models/Location';
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
    console.log('loading hotspot details failed', error);
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
    body: toApiModel(hotspotDetails),
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

export const deleteHotspot = async (
  hotspotId: string
): Promise<{
  success: boolean;
}> => {
  const { error } = await makeRequest({
    path: `/hotspots/${hotspotId}`,
    method: 'DELETE',
  });

  if (error) {
    console.error('delete hotspot failed', error);
    return { success: false };
  }

  return { success: true };
};

export const searchLocations = async (address: string) => {
  try {
    const requestHeaders: HeadersInit = new Headers();
    const server = geocodeMapsCoServerAddress;
    const search_query = encodeURI(address);
    const access_token = geocodingMapsCoKey;

    const response = await fetch(
      `${server}/search?q=${search_query}&api_key=${access_token}`,
      {
        method: 'GET',
        headers: requestHeaders,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      const isNotSignedIn = response.status === 401;

      return { error: errorText || response, isNotSignedIn };
    }

    const data = await response.json();
    const results: LocationItemProps[] = data.map((x: any) => ({
      placeName: x.display_name,
      coordinates: {
        latitude: x.lat,
        longitude: x.lon,
      },
    }));

    return results;
  } catch (error) {
    return { error };
  }
};

export const findPlaceDetails = async (
  lat: number,
  long: number,
  onRateLimitExceeded: () => void
) => {
  try {
    const requestHeaders: HeadersInit = new Headers();
    const server = geocodeMapsCoServerAddress;
    const access_token = geocodingMapsCoKey;

    const response = await fetch(
      `${server}/reverse?lat=${lat}&lon=${long}&api_key=${access_token}`,
      {
        method: 'GET',
        headers: requestHeaders,
      }
    );

    const data = await response.json();

    const location: Location = {
      latitude: lat,
      longitude: long,
      street: data?.address?.road,
      streetNumber: data?.address?.house_number,
      postalCode: data?.address?.postcode,
      city: data?.address?.city,
    };

    return location;
  } catch (e) {
    if ((e as Error).message.includes('too many requests')) {
      onRateLimitExceeded();
    }
  }
};

export const formatHotspotAddress = (
  hotspotDetails: HotspotDetails,
  shouldIncludeCoordinates: boolean
) => {
  const hotspotDetailsValues = [
    hotspotDetails.address,
    hotspotDetails.city,
    hotspotDetails.zip,
  ].concat(
    shouldIncludeCoordinates
      ? [
          hotspotDetails.latitude.toString(),
          hotspotDetails.longitude.toString(),
        ]
      : []
  );

  return hotspotDetailsValues
    .filter(x => !!x)
    .map(x => x.trim())
    .join(', ')
    .trim()
    .replace(/^, /g, '');
};
