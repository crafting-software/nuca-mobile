export type Location = {
  latitude: number;
  longitude: number;
  city?: string | null;
  postalCode?: string | null;
  street?: string | null;
  streetNumber?: string | null;
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
