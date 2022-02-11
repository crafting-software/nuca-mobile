import * as LocationProvider from 'expo-location';
import React, { createContext, useState } from 'react';
import { DefaultProps } from '../libs/common';
import { Hotspot, mockData as HotspotMockData } from '../models/Hotspot';
import { Location } from '../models/Location';

export interface MainControllerValue {
  readonly hotspots: Hotspot[];

  readonly registerHotspot: (hotspot: Hotspot) => void;

  readonly getCurrentLocation: () => Promise<Location>;

  readonly getCurrentLocationAndAddress: () => Promise<Location>;
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

    return {
      address: '',
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  const getCurrentLocationAndAddress = async (): Promise<Location> => {
    const currentLocation = await getCurrentLocation();
    let place = await LocationProvider.reverseGeocodeAsync({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    });

    let street;
    place.find(p => {
      street = p.street;
    });
    street = street ?? '';

    let streetNumber;
    place.find(p => {
      streetNumber = p.streetNumber;
    });
    streetNumber = streetNumber ?? '';

    let city;
    place.find(p => {
      city = p.city;
    });
    city = city ?? '';

    let postalCode;
    place.find(p => {
      postalCode = p.postalCode;
    });
    postalCode = postalCode ?? '';

    currentLocation.address =
      `${street} ${streetNumber}, ${city}, ${postalCode}`.trim();

    return currentLocation;
  };

  return (
    <MainController.Provider
      value={{
        hotspots,
        registerHotspot,
        getCurrentLocation,
        getCurrentLocationAndAddress,
      }}
    >
      {children}
    </MainController.Provider>
  );
};
