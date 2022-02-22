/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
  AddHotspot: { location?: Location };
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
