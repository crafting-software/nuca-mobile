import { Region } from 'react-native-maps';
import {
  initialLatitude,
  initialLatitudeDelta,
  initialLongitude,
  initialLongitudeDelta,
} from '../constants/location';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  defaultHotspotDetails,
  Hotspot,
  HotspotDetails,
} from '../models/Hotspot';
import { Location } from '../models/Location';
import { Auth, AuthContext } from './AuthContext';
import { HotspotContext } from './HotspotDetailContext';
import { MapContext } from './MapContext';
import { Cat } from '../models/Cat';

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
  const [selectedLocation, setSelectedLocation] = useState<
    Location | undefined
  >();
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>();
  const [region, setRegion] = useState<Region>({
    latitude: initialLatitude,
    longitude: initialLongitude,
    latitudeDelta: initialLatitudeDelta,
    longitudeDelta: initialLongitudeDelta,
  });

  const value = useMemo(
    () => ({
      hotspots,
      selectedLocation,
      selectedAddress,
      region,
      setHotspots,
      setSelectedLocation,
      setSelectedAddress,
      setRegion,
    }),
    [hotspots, selectedLocation, selectedAddress, region]
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const HotspotContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [hotspotDetails, setHotspotDetails] = useState<HotspotDetails>(
    defaultHotspotDetails
  );
  const [newSterilizedCats, setNewSterilizedCats] = useState<Cat[]>([]);
  const [newUnsterilizedCats, setNewUnsterilizedCats] = useState<Cat[]>([]);

  const hotspotDetailsValue = useMemo(
    () => ({ 
      hotspotDetails, 
      newSterilizedCats,
      newUnsterilizedCats,
      setHotspotDetails,
      setNewSterilizedCats,
      setNewUnsterilizedCats
    }),
    [hotspotDetails, newSterilizedCats, newUnsterilizedCats]
  );

  useEffect(() => {
    console.log("HotspotContextProvider --> newSterilizedCats: ", newSterilizedCats);
  }, [newSterilizedCats]);

  useEffect(() => {
    console.log("HotspotContextProvider --> newUnsterilizedCats: ", newUnsterilizedCats);
  }, [newUnsterilizedCats]);

  return (
    <HotspotContext.Provider value={hotspotDetailsValue}>
      {children}
    </HotspotContext.Provider>
  );
};
