import { useContext, useEffect, useRef } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import { Caption, FAB, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import currentLocationIcon from '../assets/current-location.png';
import markerNewImage from '../assets/marker-new.png';
import { Appbar } from '../components/Appbar';
import { SearchableLocationDropdown } from '../components/SearchableLocationDropdown';
import {
  deltaRatio,
  initialLatitudeDelta,
  initialLongitudeDelta,
} from '../constants/location';
import { MapContext } from '../context';
import { findCurrentLocation, findPlace } from '../context/MapContext';
import { useNucaTheme as useTheme } from '../hooks/useNucaTheme';
import { Marker } from '../maps';
import { getHotspotMarker } from '../models/Hotspot';
import { getFormattedAddress, Location } from '../models/Location';
import { EdgeInsets, RootStackScreenProps } from '../types';
import SnackbarManager from '../utils/SnackbarManager';
import { findPlaceDetails } from '../utils/hotspots';

export const ChooseLocationScreen = ({
  route,
}: RootStackScreenProps<'ChooseLocation'>) => {
  const {
    hotspots,
    setSelectedLocation,
    setSelectedAddress,
    selectedLocation,
    region,
  } = useContext(MapContext);

  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = getStyles(theme, insets);

  const animateMapToRegion = (_location: Location) => {
    mapRef.current?.animateToRegion({
      latitude: _location.latitude,
      longitude: _location.longitude,
      latitudeDelta: initialLatitudeDelta / deltaRatio,
      longitudeDelta: initialLongitudeDelta / deltaRatio,
    });
  };

  const onMapRateLimitExceeded = () => {
    SnackbarManager.error(
      'ChooseLocationScreen',
      'A apărut o problemă, așteptați câteva momente și încercați din nou.'
    );
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
          showsUserLocation
          showsMyLocationButton={false}
          style={styles.map}
          //am incercat si cu asta, asta merge, dar nu face ceea ce vrem noi
          onRegionChangeComplete={async region => {
            const { latitude, longitude } = region;
            const isSameMarker =
              selectedLocation?.longitude === longitude &&
              selectedLocation?.latitude === latitude;

            if (!isSameMarker) {
              const location = await findPlace(
                latitude,
                longitude,
                onMapRateLimitExceeded
              );
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
              const identifyLocation =
                Platform.OS === 'web' ? findPlaceDetails : findPlace;
              const location = await identifyLocation(
                latitude,
                longitude,
                onMapRateLimitExceeded
              );
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
                setSelectedLocation(undefined);
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
          <SearchableLocationDropdown ref={mapRef} />
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
              icon={'check'}
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
          const location = await findCurrentLocation(onMapRateLimitExceeded);
          if (!!location) animateMapToRegion(location);
        }}
      />
    </>
  );
};

const getStyles = (theme: NucaCustomTheme, insets: EdgeInsets) =>
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
