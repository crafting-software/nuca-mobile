/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { Region } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HotspotDetails } from './models/Hotspot';
import { Location } from './models/Location';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Authentication: undefined;
  Main: undefined;
  Modal: undefined;
  AddHotspot: {
    region: Region;
    location?: Location;
    isUpdate?: boolean;
    hotspotDetails?: HotspotDetails;
  };
  HotspotDetail: { hotspotId: string };
  NotFound: undefined;
  ChooseLocation: { region: Region; location?: Location };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
