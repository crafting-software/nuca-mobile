import * as LocationProvider from 'expo-location';
import React, { createContext, useState } from 'react';
import { DefaultProps } from '../libs/common';
import { Hotspot, mockData as HotspotMockData } from '../models/Hotspot';
import { Location } from '../models/Position';

export interface MainControllerValue {
  readonly hotspots: Hotspot[];

  readonly registerHotspot: (hotspot: Hotspot) => void;

  readonly getCurrentLocation: () => Promise<Location>;
}

export const MainController = createContext<MainControllerValue>(
  {} as MainControllerValue
);

export const MainControllerProvider = ({ children }: DefaultProps) => {
  const [hotspots, setHotspots] = useState<Hotspot[]>(HotspotMockData);

  const registerHotspot = (newHotspot: Hotspot) => {
    setHotspots([...hotspots, newHotspot]);
  };

  const getCurrentLocation = async (): Promise<Location> => {
    let { status } = await LocationProvider.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
    }

    let location = await LocationProvider.getCurrentPositionAsync({});
    alert(JSON.stringify(location));
    return {
      address: 'unknown',
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  return (
    <MainController.Provider
      value={{ hotspots, registerHotspot, getCurrentLocation }}
    >
      {children}
    </MainController.Provider>
  );
};
