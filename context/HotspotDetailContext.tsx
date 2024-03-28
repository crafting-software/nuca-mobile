import { createContext, Dispatch, SetStateAction } from 'react';
import { defaultHotspotDetails, HotspotDetails } from '../models/Hotspot';
import { Cat } from '../models/Cat';

interface HotspotContext {
  hotspotDetails: HotspotDetails;
  newSterilizedCats: Cat[];
  newUnsterilizedCats: Cat[];
  shouldCatDetailsBeSaved: boolean;
  shouldSterilizedCatBeEdited: boolean[];
  shouldUnsterilizedCatBeEdited: boolean[];
  setHotspotDetails: Dispatch<SetStateAction<HotspotDetails>>;
  setNewSterilizedCats: Dispatch<SetStateAction<Cat[]>>;
  setNewUnsterilizedCats: Dispatch<SetStateAction<Cat[]>>;
  setShouldSterilizedCatBeEdited: Dispatch<SetStateAction<boolean[]>>;
  setShouldUnsterilizedCatBeEdited: Dispatch<SetStateAction<boolean[]>>;
  setShouldCatDetailsBeSaved: Dispatch<SetStateAction<boolean>>;
}

export const HotspotContext = createContext<HotspotContext>({
  hotspotDetails: defaultHotspotDetails,
  newSterilizedCats: [],
  newUnsterilizedCats: [],
  shouldCatDetailsBeSaved: false,
  shouldSterilizedCatBeEdited: [],
  shouldUnsterilizedCatBeEdited: [],
  setHotspotDetails: () => {},
  setNewSterilizedCats: () => {},
  setNewUnsterilizedCats: () => {},
  setShouldCatDetailsBeSaved: () => {},
  setShouldSterilizedCatBeEdited: () => {},
  setShouldUnsterilizedCatBeEdited: () => {}
});
