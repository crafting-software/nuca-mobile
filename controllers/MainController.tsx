import * as LocationProvider from 'expo-location';
import React, { createContext, useState } from 'react';
import { DefaultProps } from '../libs/common';
import { Hotspot, mockData as HotspotMockData } from '../models/Hotspot';
import { Location } from '../models/Location';

export interface MainControllerValue {
  readonly hotspots: Hotspot[];
  readonly registerHotspot: (hotspot: Hotspot) => void;

  readonly currentLocation: Location;
  readonly findCurrentLocation: () => void;
  readonly findCurrentLocationAndAddress: () => void;
}

export const MainController = createContext<MainControllerValue>(
  {} as MainControllerValue
);

export const MainControllerProvider = ({ children }: DefaultProps) => {
  const [hotspots, setHotspots] = useState<Hotspot[]>(HotspotMockData);
  const [currentLocation, setCurrentLocation] = useState<Location>({
    address: '',
    latitude: -1,
    longitude: -1,
  });

  const registerHotspot = (newHotspot: Hotspot) => {
    setHotspots([...hotspots, newHotspot]);
  };

  const findCurrentLocation = async () => {
    let { status } = await LocationProvider.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
    }

    let location = await LocationProvider.getCurrentPositionAsync({});

    alert(`LOCATION OBJECT IS ${JSON.stringify(location)}`);
    setCurrentLocation({
      address: '',
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    alert(`LOCATION IS ${JSON.stringify(currentLocation)}`);
  };

  const findCurrentLocationAndAddress = async () => {
    await findCurrentLocation();

    if (currentLocation === null) {
      alert('Location and address could not be retrieved');
      return;
    }

    let place = await LocationProvider.reverseGeocodeAsync({
      latitude: currentLocation!.latitude,
      longitude: currentLocation!.longitude,
    });

    alert(`GEOCODE OBJECT IS ${JSON.stringify(place)}`);

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

    currentLocation!.address =
      `${street} ${streetNumber}, ${city}, ${postalCode}`.trim();

    setCurrentLocation(currentLocation);

    alert(`LOCATION AND ADDRESS ARE ${JSON.stringify(currentLocation)}`);
  };

  return (
    <MainController.Provider
      value={{
        hotspots,
        currentLocation,
        registerHotspot,
        findCurrentLocation,
        findCurrentLocationAndAddress,
      }}
    >
      {children}
    </MainController.Provider>
  );
};
