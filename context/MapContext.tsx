import * as LocationProvider from 'expo-location';
import { createContext, Dispatch, SetStateAction } from 'react';
import { Hotspot } from '../models/Hotspot';
import { Location } from '../models/Location';

interface MapContext {
  hotspots: Hotspot[];
  setHotspots: Dispatch<SetStateAction<Hotspot[]>>;
}

export const MapContext = createContext<MapContext>({
  hotspots: [],
  setHotspots: () => {},
});

export const findCurrentLocation = async (): Promise<Location> => {
  const { status } = await LocationProvider.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access location was denied.');
  }

  const position = await LocationProvider.getCurrentPositionAsync();
  let location: Location = {
    ...position.coords,
  };

  const place = await LocationProvider.reverseGeocodeAsync(position.coords);
  place.find(address => {
    location = { ...address, ...location };
  });

  return location;
};
