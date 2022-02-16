export type Location = {
  latitude: number;
  longitude: number;
  city: string;
  postalCode: string;
  street: string;
  streetNumber: string;
};

export const defaultLocation: Location = {
  latitude: -1,
  longitude: -1,
  city: '',
  postalCode: '',
  street: '',
  streetNumber: '',
};

export const getAddressDisplayText = (location: Location): string => {
  return `${location.street} ${location.streetNumber} ${location.city} ${location.postalCode}`.trim();
};
