export type Location = {
  latitude: number;
  longitude: number;
  city?: string | null;
  postalCode?: string | null;
  street?: string | null;
  streetNumber?: string | null;
};

export type RawMapboxLocationFeatureProperties = {
  context: {
    address: {
      street_name: string;
      address_number: string;
    };
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  feature_type: string;
  full_address: string;
  mapbox_id: string;
  name: string;
  place_formatted: string;
};

export type RawMapboxLocationFeature = {
  properties: RawMapboxLocationFeatureProperties;
  type: string;
};

export type MapboxLocationFeature = {
  properties: MapboxLocationFeatureProperties;
  type: string;
};

export type MapboxLocationFeatureProperties = {
  context: {
    address: {
      streetName: string;
      addressNumber: string;
    };
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  featureType: string;
  fullAddress: string;
  mapboxId: string;
  name: string;
  placeFormatted: string;
};

export const convertRawMapboxResponseToEntity: (
  features: RawMapboxLocationFeature[]
) => MapboxLocationFeature[] = features =>
  features.map((x: RawMapboxLocationFeature) => ({
    ...x,
    properties: {
      ...x.properties,
      context: {
        address: {
          streetName: x.properties.context?.address?.street_name,
          addressNumber: x.properties.context?.address?.address_number,
        },
      },
      featureType: x.properties.feature_type,
      fullAddress: x.properties.full_address,
      placeFormatted: x.properties.place_formatted,
      mapboxId: x.properties.mapbox_id,
    },
    type: x.type,
  }));

export const getFormattedAddress = (location: Location): string => {
  const textOrDefault = (value: string | null | undefined) => value ?? '';

  const street = `${textOrDefault(location.street)} ${textOrDefault(
    location.streetNumber
  )}`.trim();

  return `${street} ${street ? ',' : ''} ${textOrDefault(
    location.postalCode
  )} ${textOrDefault(location.city)}`.trim();
};
