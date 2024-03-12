import {
  castToHotspot,
  castToHotspotDetails,
  Hotspot,
  HotspotDetails,
  LocationItemProps,
  toApiModel,
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
  const { error, data } = await makeRequest({
    path: `/hotspots/${hotspotId}`,
    method: 'DELETE',
  });

  if (error) {
    console.error('delete hotspot failed', error);
    return { success: false };
  }

  return { success: true };
};

export const searchLocations = async (address: string, proximityPolicy: 'ip' | 'coordinate' | 'none') => {
  try {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    const server = "https://api.mapbox.com/search/geocode/v6/forward";
    const search_query = encodeURI(address);
    const access_token = 'pk.eyJ1IjoiY3JhZnRpbmdtYXBib3hlcyIsImEiOiJjbHRtc2xoZTAxcDd4Mm1wNmtycG4xdGE0In0.jaf4MwDHD_EY4LbZj0fYVw';

    const response = await fetch(`${server}?q=${search_query}&proximity=${proximityPolicy}&access_token=${access_token}`, {
      method: 'GET',
      headers: requestHeaders,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const isNotSignedIn = response.status === 401;

      return { error: errorText || response, isNotSignedIn };
    }

    const data = await response.json();
    const results: LocationItemProps[] = data['features']?.map((x: any) => ({
      place_name: x.properties.name + ", " + x.properties.place_formatted,
      coordinates: {
        latitude: x.properties.coordinates.latitude,
        longitude: x.properties.coordinates.longitude
      }
    }))

    return results;
  } catch (error) {
    return { error };
  }
}