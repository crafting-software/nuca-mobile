import { createContext, Dispatch, SetStateAction } from 'react';
import { defaultHotspotDetails, HotspotDetails } from '../models/Hotspot';
import { Cat } from '../models/Cat';

interface HotspotContext {
  hotspotDetails: HotspotDetails;
  setHotspotDetails: Dispatch<SetStateAction<HotspotDetails>>;
  newSterilizedCats: Cat[];
  setNewSterilizedCats: Dispatch<SetStateAction<Cat[]>>;
  newUnsterilizedCats: Cat[];
  setNewUnsterilizedCats: Dispatch<SetStateAction<Cat[]>>;
}

export const HotspotContext = createContext<HotspotContext>({
  hotspotDetails: defaultHotspotDetails,
  newSterilizedCats: [],
  newUnsterilizedCats: [],
  setHotspotDetails: () => {},
  setNewSterilizedCats: () => {},
  setNewUnsterilizedCats: () => {},
});
