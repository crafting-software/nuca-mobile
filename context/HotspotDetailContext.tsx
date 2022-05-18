import { createContext, Dispatch, SetStateAction } from 'react';
import { defaultHotspotDetails, HotspotDetails } from '../models/Hotspot';

interface HotspotContext {
  hotspotDetails: HotspotDetails;
  setHotspotDetails: Dispatch<SetStateAction<HotspotDetails>>;
}

export const HotspotContext = createContext<HotspotContext>({
  hotspotDetails: defaultHotspotDetails,
  setHotspotDetails: () => {},
});
