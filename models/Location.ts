export type Location = {
  latitude: number;
  longitude: number;
  city?: string | null;
  postalCode?: string | null;
  street?: string | null;
  streetNumber?: string | null;
};

export const getFormattedAddress = (location: Location): string => {
  return `${location.street} ${location.streetNumber}, ${location.postalCode} ${location.city}`
    .replace('  ', ' ')
    .trim();
};
