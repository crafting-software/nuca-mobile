import { mapboxApiKey, mapboxGeocodingServerAddress } from '../config';
import {
  castToHotspot,
  castToHotspotDetails,
  Hotspot,
  HotspotDetails,
  LocationItemProps,
  toApiModel,
} from '../models/Hotspot';
import {
  Location,
  MapboxLocationFeature,
  MapboxLocationFeatureProperties,
  convertRawMapboxResponseToEntity,
} from '../models/Location';
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

export const searchLocations = async (
  address: string,
  proximityPolicy: 'ip' | 'coordinate' | 'none'
) => {
  try {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    const server = mapboxGeocodingServerAddress;
    const search_query = encodeURI(address);
    const access_token = mapboxApiKey;

    const response = await fetch(
      `${server}/forward?q=${search_query}&proximity=${proximityPolicy}&access_token=${access_token}`,
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
    const mapboxFeatures = convertRawMapboxResponseToEntity(data?.features);
    const results: LocationItemProps[] = mapboxFeatures
      ?.map((x: MapboxLocationFeature) => x.properties)
      .map((x: MapboxLocationFeatureProperties) => ({
        placeName: x.name + ', ' + x.placeFormatted,
        coordinates: {
          latitude: x.coordinates.latitude,
          longitude: x.coordinates.longitude,
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
    requestHeaders.set('Content-Type', 'application/json');
    const server = mapboxGeocodingServerAddress;
    const access_token = mapboxApiKey;

    const response = await fetch(
      `${server}/reverse?longitude=${long}&latitude=${lat}&access_token=${access_token}`,
      {
        method: 'GET',
        headers: requestHeaders,
      }
    );

    const data = await response.json();
    const mapboxFeatures = convertRawMapboxResponseToEntity(data?.features);
    const streetFeature = mapboxFeatures?.find((x: MapboxLocationFeature) =>
      ['street', 'address'].includes(x.properties.featureType)
    );
    const postalCodeFeature = data?.features?.find(
      (x: MapboxLocationFeature) => x.properties.featureType === 'postcode'
    );
    const placeFeature = data?.features?.find(
      (x: MapboxLocationFeature) => x.properties.featureType === 'place'
    );
    const streetName =
      streetFeature?.properties?.context?.address?.streetName ||
      streetFeature?.properties?.name;

    const location: Location = {
      latitude: lat,
      longitude: long,
      street: streetName,
      streetNumber: streetFeature?.properties?.context?.address?.addressNumber,
      postalCode: postalCodeFeature?.properties?.name,
      city: placeFeature?.properties?.name,
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
