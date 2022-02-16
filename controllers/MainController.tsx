import { createContext, useState } from 'react';
import { DefaultProps } from '../libs/common';
import { Hotspot, mockData as hotspotMockData } from '../models/Hotspot';

export type MainControllerValue = {
  hotspots: Hotspot[];
  registerHotspot: (hotspot: Hotspot) => void;
};

export const MainController = createContext<MainControllerValue>({
  hotspots: [],
  registerHotspot: () => {},
});

export const MainControllerProvider = ({ children }: DefaultProps) => {
  const [hotspots, setHotspots] = useState<Hotspot[]>(hotspotMockData);

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
