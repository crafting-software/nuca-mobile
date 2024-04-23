import { Image, ImageSourcePropType } from 'react-native';
import MapView, { Marker as NativeMarker } from 'react-native-maps';
import { isWeb } from '../utils/platform';

type PinProps = { height: number; width: number; image: ImageSourcePropType };

type MarkerProps = {
  passthroughKey?: any;
  coordinate: { latitude: number; longitude: number };
  height: number;
  width: number;
  imageSource: ImageSourcePropType | string;
  onPress?: () => any;
  isMapReady?: boolean;
};
export const Marker = ({
  coordinate,
  height,
  width,
  passthroughKey,
  imageSource,
  onPress,
  isMapReady,
}: MarkerProps) => {
  return isWeb() ? (
    // @ts-ignore
    <MapView.Marker
      coordinate={coordinate}
      key={passthroughKey}
      icon={{
        // @ts-ignore
        scaledSize: new google.maps.Size(width, height),
        url: imageSource,
      }}
      onPress={onPress}
    />
  ) : (
    <NativeMarker
      coordinate={coordinate}
      key={passthroughKey}
      onPress={onPress}
      tracksViewChanges={!isMapReady}
    >
      <Pin
        image={imageSource as ImageSourcePropType}
        height={height}
        width={width}
      />
    </NativeMarker>
  );
};

const Pin = ({ image, height, width }: PinProps) => (
  <Image source={image} style={{ height, width }} />
);
