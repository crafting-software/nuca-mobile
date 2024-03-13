import * as LocationProvider from 'expo-location';
import { createContext, Dispatch, SetStateAction } from 'react';
import { Hotspot } from '../models/Hotspot';
import { Location } from '../models/Location';

interface MapContext {
  hotspots: Hotspot[];
  setHotspots: Dispatch<SetStateAction<Hotspot[]>>;
  selectedLocation?: Location | null;
  setSelectedLocation: Dispatch<SetStateAction<Location | undefined | null>>;
  selectedAddress?: string;
  setSelectedAddress: Dispatch<SetStateAction<string | undefined>>;
}

export const MapContext = createContext<MapContext>({
  hotspots: [],
  setHotspots: () => {},
  setSelectedLocation: () => {},
  setSelectedAddress: () => {}
});

export const findCurrentLocation = async (
  onRateLimitExceeded: () => void
): Promise<Location | undefined> => {
  const { status } = await LocationProvider.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access location was denied.');
  }

  const position = await LocationProvider.getCurrentPositionAsync();

  return findPlace(
    position.coords.latitude,
    position.coords.longitude,
    onRateLimitExceeded
  );
};

export const findPlace = async (
  lat: number,
  long: number,
  onRateLimitExceeded: () => void
): Promise<Location | undefined> => {
  try {
    LocationProvider.setGoogleApiKey('AIzaSyDgAde1GooxomdvTUlNtsfH16NWlkdKMpg');
    const place = await LocationProvider.reverseGeocodeAsync({
      latitude: lat,
      longitude: long,
    });
    let location: Location = {
      latitude: lat,
      longitude: long,
    };

    place.find(address => {
      location = { 
        ...location,
        street: address.street,
        streetNumber: address.streetNumber,
        city: address.city,
        postalCode: address.postalCode
      };
    });

    return location;
  } catch (e) {
    if ((e as Error).message.includes('too many requests')) {
      onRateLimitExceeded();
    }
  }
};
