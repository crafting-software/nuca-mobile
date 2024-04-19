export type Location = {
  latitude: number;
  longitude: number;
  city?: string | null;
  postalCode?: string | null;
  street?: string | null;
  streetNumber?: string | null;
};

export type GeocodeMapsCoForwardEntity = {
  place_id: number;
  boundingbox?: number[];
  lat: string;
  lon: string;
  display_name?: string;
  class?: string;
  type?: string;
  importance?: number;
};

export type GeocodeMapsCoReverseEntity = {
  place_id: number;
  lat: string;
  lon: string;
  display_name?: string;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    municipality?: string;
    county?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox: number[];
};

export const getFormattedAddress = (location: Location): string => {
  const textOrDefault = (value: string | null | undefined) => value ?? '';

  const street = `${textOrDefault(location.street)} ${textOrDefault(
    location.streetNumber
  )}`.trim();

  return `${street} ${street ? ',' : ''} ${textOrDefault(
    location.postalCode
  )} ${textOrDefault(location.city)}`.trim();
};
