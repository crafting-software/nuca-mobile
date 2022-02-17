import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { Hotspot } from '../models/Hotspot';

interface MapContext {
  hotspots: Hotspot[];
  setHotspots: Dispatch<SetStateAction<Hotspot[]>>;
}

export const MapContext = createContext<MapContext>({
  hotspots: [],
  setHotspots: () => {},
});
