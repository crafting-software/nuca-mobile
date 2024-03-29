import * as LocationProvider from 'expo-location';
import { createContext, Dispatch, SetStateAction } from 'react';
import { Region } from 'react-native-maps';
import { googleMapsApiKey } from '../config';
import {
  initialLatitude,
  initialLatitudeDelta,
  initialLongitude,
  initialLongitudeDelta,
} from '../constants/location';
import { Hotspot } from '../models/Hotspot';
import { Location } from '../models/Location';

interface MapContext {
  hotspots: Hotspot[];
  setHotspots: Dispatch<SetStateAction<Hotspot[]>>;
  selectedLocation?: Location;
  setSelectedLocation: Dispatch<SetStateAction<Location | undefined>>;
  selectedAddress?: string;
  setSelectedAddress: Dispatch<SetStateAction<string | undefined>>;
  region: Region;
  setRegion: Dispatch<SetStateAction<Region>>;
}

export const MapContext = createContext<MapContext>({
  hotspots: [],
  region: {
    latitude: initialLatitude,
    longitude: initialLongitude,
    latitudeDelta: initialLatitudeDelta,
    longitudeDelta: initialLongitudeDelta,
  },
  setHotspots: () => {},
  setSelectedLocation: () => {},
  setSelectedAddress: () => {},
  setRegion: () => {},
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
    LocationProvider.setGoogleApiKey(googleMapsApiKey);
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
        postalCode: address.postalCode,
      };
    });

    return location;
  } catch (e) {
    if ((e as Error).message.includes('too many requests')) {
      onRateLimitExceeded();
    }
  }
};
