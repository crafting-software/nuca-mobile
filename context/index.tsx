import { useState, useMemo, ReactNode } from 'react';
import { Hotspot } from '../models/Hotspot';
import { mockData } from '../models/Hotspot';
import { AuthContext, Auth } from './AuthContext';
import { MapContext } from './MapContext';

export { AuthContext, Auth, MapContext, Hotspot };

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth>({ inProgress: false });

  const authValue = useMemo(() => ({ auth, setAuth }), [auth]);

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export const MapContextProvider = ({ children }: { children: ReactNode }) => {
  const [hotspots, setHotspots] = useState<Hotspot[]>(mockData);

  const hotspotsValue = useMemo(() => ({ hotspots, setHotspots }), [hotspots]);

  return (
    <MapContext.Provider value={hotspotsValue}>{children}</MapContext.Provider>
  );
};
