import { useContext } from 'react';
import { Hotspot, HotspotDetails, MapContext } from '../context';
import { HotspotContext } from '../context/HotspotDetailContext';
import { Location } from '../models/Location';
import SnackbarManager from '../utils/SnackbarManager';
import { addHotspot, updateHotspot } from '../utils/hotspots';

export type HotspotSaveProps = {
  hotspotToBeSaved: HotspotDetails;
  shouldUpdate?: boolean;
  location?: Location;
  setIsInProgress: (isInProgress: boolean) => void;
};

export const useHotspotSave = ({
  hotspotToBeSaved,
  shouldUpdate,
  location,
  setIsInProgress,
}: HotspotSaveProps) => {
  const { hotspots, setHotspots, setSelectedLocation } = useContext(MapContext);
  const { setHotspotDetails } = useContext(HotspotContext);
  const save = async (): Promise<{
    hotspot?: HotspotDetails;
  }> => {
    if (!location && !shouldUpdate) {
      SnackbarManager.error(
        'HotspotFormScreen - save func',
        'Locatia lipseste'
      );
      return { hotspot: undefined };
    }

    const submitFunc = shouldUpdate ? updateHotspot : addHotspot;
    setIsInProgress(true);

    if (!hotspotToBeSaved) {
      SnackbarManager.error(
        'HotspotFormScreen - save func',
        'Lipsesc detaliile zonei de interes.'
      );
      setIsInProgress(false);
      return { hotspot: undefined };
    }

    const { success, hotspotDetails: newHotspot } = await submitFunc(
      hotspotToBeSaved
    );

    if (!success) {
      setIsInProgress(false);
      SnackbarManager.error(
        'HotspotFormScreen - save func.',
        shouldUpdate ? 'Editare nereuşită' : 'Adăugare nereuşită'
      );
      return { hotspot: undefined };
    }

    const newHotspots = [
      ...hotspots.filter((h: Hotspot) => h.id !== newHotspot!.id),
      newHotspot!,
    ];

    setHotspotDetails(newHotspot!);
    setHotspots(newHotspots);
    setSelectedLocation(undefined);
    SnackbarManager.success(
      shouldUpdate ? 'Editare reuşită' : 'Adăugare reuşită'
    );
    setIsInProgress(false);

    return { hotspot: newHotspot };
  };

  return save;
};
