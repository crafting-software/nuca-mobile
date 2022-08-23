/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Location } from './models/Location';

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export type EdgeInsets = {
  top: Number;
  right: Number;
  bottom: Number;
  left: Number;
};

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
  };
  HotspotDetail: { hotspotId: string };
  NotFound: undefined;
  ChooseLocation: { region: Region; location?: Location };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
