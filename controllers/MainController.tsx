import React, { createContext, useState } from 'react';
import { DefaultProps } from '../libs/common';
import { Hotspot, mockData as HotspotMockData } from '../models/Hotspot';

export interface MainControllerValue {
  readonly hotspots: Hotspot[];
  readonly registerHotspot: (hotspot: Hotspot) => void;
}

export const MainController = createContext<MainControllerValue>(
  {} as MainControllerValue
);

export const MainControllerProvider = ({ children }: DefaultProps) => {
  const [hotspots, setHotspots] = useState<Hotspot[]>(HotspotMockData);

  const registerHotspot = (newHotspot: Hotspot) => {
    setHotspots([...hotspots, newHotspot]);
  };

  return (
    <MainController.Provider
      value={{
        hotspots,
        registerHotspot,
      }}
    >
      {children}
    </MainController.Provider>
  );
};
