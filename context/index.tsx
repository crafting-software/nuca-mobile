import { useState, useMemo, ReactNode } from 'react';
import { Hotspot, HotspotDetails, HotspotStatus } from '../models/Hotspot';
import { AuthContext, Auth } from './AuthContext';
import { MapContext } from './MapContext';

export {
  AuthContext,
  Auth,
  MapContext,
  Hotspot,
  HotspotStatus,
  HotspotDetails,
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth>({ inProgress: false });

  const authValue = useMemo(() => ({ auth, setAuth }), [auth]);

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export const MapContextProvider = ({ children }: { children: ReactNode }) => {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);

  const hotspotsValue = useMemo(() => ({ hotspots, setHotspots }), [hotspots]);

  return (
    <MapContext.Provider value={hotspotsValue}>{children}</MapContext.Provider>
  );
};
