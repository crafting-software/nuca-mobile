import { ReactNode, useMemo, useState } from 'react';
import {
  defaultHotspotDetails,
  Hotspot,
  HotspotDetails,
} from '../models/Hotspot';
import { Auth, AuthContext } from './AuthContext';
import { HotspotContext } from './HotspotDetailContext';
import { MapContext } from './MapContext';

export * from './AuthContext';
export * from './MapContext';
export * from '../models/Hotspot';

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

export const HotspotContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [hotspotDetails, setHotspotDetails] = useState<HotspotDetails>(
    defaultHotspotDetails
  );

  const hotspotDetailsValue = useMemo(
    () => ({ hotspotDetails, setHotspotDetails }),
    [hotspotDetails]
  );

  return (
    <HotspotContext.Provider value={hotspotDetailsValue}>
      {children}
    </HotspotContext.Provider>
  );
};
