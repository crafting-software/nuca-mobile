import { Platform } from 'react-native';
import MapView, { Marker as NativeMarker } from 'react-native-maps';

/* @ts-ignore */
export const Marker = Platform.OS === 'web' ? MapView.Marker : NativeMarker;
