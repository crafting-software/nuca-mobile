import * as LocationProvider from 'expo-location';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TextInput as BaseTextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import { Caption, FAB, TextInput, useTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import currentLocationIcon from '../assets/current-location.png';
import markerNewImage from '../assets/marker-new.png';
import { Appbar } from '../components/Appbar';
import { MapContext } from '../context';
import { findCurrentLocation, findPlace } from '../context/MapContext';
import { Marker } from '../maps';
import { getHotspotMarker } from '../models/Hotspot';
import { getFormattedAddress, Location } from '../models/Location';
import { EdgeInsets, Region, RootStackScreenProps } from '../types';

export const ChooseLocationScreen = ({
  route,
}: RootStackScreenProps<'ChooseLocation'>) => {
  const { hotspots } = useContext(MapContext);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>();
  const [region, setRegion] = useState<Region>(route.params.region);
  const [selectedAddress, setSelectedAddress] = useState('');

  const mapRef = useRef<MapView>(null);
  const searchAddressRef = useRef<BaseTextInput>(null);
  const navigation = useNavigation();

  const searchForAddress = async (address: string): Promise<void> => {
    try {
      const [{ latitude, longitude }] = await LocationProvider.geocodeAsync(
        address
      );

      animateMapToRegion({ latitude: latitude, longitude: longitude });
    } catch (e) {
      alert('Address not found');
    }
  };

  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = getStyles(theme, insets);

  const animateMapToRegion = (_location: Location) => {
    mapRef.current?.animateToRegion({
      latitude: _location.latitude,
      longitude: _location.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    });
  };

  useEffect(() => {
    setSelectedLocation(route.params.location);
    if (route.params.location) {
      animateMapToRegion(route.params.location);
    }
  }, [route.params.location]);

  useEffect(() => {
    setSelectedAddress(
      selectedLocation ? getFormattedAddress(selectedLocation) : ''
    );
  }, [selectedLocation]);

  return (
    <>
      <Appbar forDetailScreen />
      <View style={styles.mapContainer}>
        <MapView
          // @ts-ignore
          options={{
            disableDefaultUI: true,
          }}
          ref={mapRef}
          // use intial region + animateToRegion instead of region as react state because
          // gestures don't work well https://github.com/react-native-maps/react-native-maps/issues/3639
          initialRegion={region}
          onRegionChange={() => {
            setRegion;
          }}
          showsUserLocation
          style={styles.map}
          //am incercat si cu asta, asta merge, dar nu face ceea ce vrem noi
          onRegionChangeComplete={async region => {
            console.log('Bent1 ', region);
            const { latitude, longitude } = region;
            const isSameMarker =
              selectedLocation?.longitude === longitude &&
              selectedLocation?.latitude === latitude;

            if (!isSameMarker) {
              const location = await findPlace(latitude, longitude);
              setSelectedLocation(location);
            }
          }}
          onPress={async e => {
            const getCoords = () => {
              if (Platform.OS === 'web') {
                const coords = (e as any).latLng;
                return { latitude: coords.lat(), longitude: coords.lng() };
              }
              return e.nativeEvent.coordinate;
            };

            const { latitude, longitude } = getCoords();

            const isSameMarker =
              selectedLocation?.longitude === longitude &&
              selectedLocation?.latitude === latitude;

            if (!isSameMarker) {
              const location = await findPlace(latitude, longitude);
              setSelectedLocation(location);
            }
          }}
        >
          {hotspots.map(h => (
            <Marker
              icon={
                Platform.OS === 'web'
                  ? {
                      url: getHotspotMarker(h),
                      scaledSize: new google.maps.Size(40, 40),
                      origin: new google.maps.Point(0, 0),
                      anchor: new google.maps.Point(0, 0),
                    }
                  : {}
              }
              key={`${h.latitude} ${h.longitude}`}
              coordinate={{
                latitude: h.latitude,
                longitude: h.longitude,
              }}
            >
              <Image
                source={getHotspotMarker(h)}
                style={styles.marker}
                resizeMode="contain"
              />
            </Marker>
          ))}

          {selectedLocation ? (
            <Marker
              key={`${selectedLocation.latitude} ${selectedLocation.longitude}`}
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              onPress={() => {
                setSelectedLocation(null);
              }}
            >
              <Image
                source={markerNewImage}
                style={styles.marker}
                resizeMode="contain"
              />
            </Marker>
          ) : null}
        </MapView>
        <View style={styles.searchInput}>
          <TextInput
            ref={searchAddressRef}
            multiline={false}
            dense={true}
            scrollEnabled={true}
            style={{ height: 60 }}
            blurOnSubmit={true}
            outlineColor={theme.colors.disabled}
            mode="outlined"
            autoCorrect={false}
            placeholder="Caută"
            autoComplete={false}
            right={
              <TextInput.Icon name="magnify" color={theme.colors.placeholder} />
            }
            returnKeyType="search"
            onSubmitEditing={async ({ nativeEvent: { text } }) => {
              setSelectedAddress(text);
              searchForAddress(text);
            }}
            onChangeText={text => {
              setSelectedAddress(text);
            }}
            value={selectedAddress}
          />
        </View>
      </View>

      {selectedLocation ? (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.confirmAddressButton}
          onPress={() => {
            navigation.navigate('AddHotspot', {
              location: selectedLocation,
              region: region,
            });
          }}
        >
          <Caption style={styles.confirmAddressButtonLabel}>
            CONFIRMĂ ADRESA
          </Caption>
          <View style={styles.confirmAddressButtonIconContainer}>
            <TextInput.Icon
              size={20}
              name={'check'}
              color={theme.colors.background}
            />
          </View>
        </TouchableOpacity>
      ) : null}

      <FAB
        style={styles.currentLocationButton}
        icon={currentLocationIcon}
        small
        onPress={async () => {
          const location = await findCurrentLocation();
          animateMapToRegion(location);
        }}
      />
    </>
  );
};

const getStyles = (theme: Theme, insets: EdgeInsets) =>
  StyleSheet.create({
    mapContainer: {
      position: 'relative',
      width: '100%',
      flex: 1,
    },
    map: {
      width: '100%',
      flex: 1,
    },
    currentLocationButton: {
      position: 'absolute',
      bottom: Math.max(20, insets.bottom as number),
      right: 20,
      backgroundColor: theme.colors.text,
    },
    confirmAddressButton: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: Math.max(20, insets.bottom as number),
      left: 20,
      backgroundColor: theme.colors.text,
      borderRadius: theme.roundness,
      paddingHorizontal: 12,
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,

      elevation: 6,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.2,
    },
    confirmAddressButtonLabel: {
      color: theme.colors.background,
      fontSize: 12,
      fontFamily: 'Nunito_700Bold',
      letterSpacing: 0.2,
    },
    confirmAddressButtonIconContainer: {
      width: 20,
      alignItems: 'center',
      height: 20,
      marginBottom: 10,
    },
    searchInput: {
      position: 'absolute',
      top: 20,
      left: 20,
      right: 20,
      elevation: 6,
      height: 60,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 0.22,
      borderRadius: 30,
    },
    marker: {
      width: 40,
      height: 40,
    },
  });
