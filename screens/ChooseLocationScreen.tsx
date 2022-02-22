import * as LocationProvider from 'expo-location';
import { useContext, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { EdgeInsets, Marker, Region } from 'react-native-maps';
import { Caption, FAB, TextInput, useTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import currentLocationIcon from '../assets/current-location.png';
import { SecondaryAppbar } from '../components/SecondaryAppbar';
import { MapContext } from '../context';
import { findCurrentLocation, findPlace } from '../context/MapContext';
import { getHotspotMarker } from '../models/Hotspot';
import {
  defaultLocation,
  getFormattedAddress,
  Location,
} from '../models/Location';
import { RootStackScreenProps } from '../types';

const intialRegion: Region = {
  latitude: 46.77293258116839,
  longitude: 23.587688864363546,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const ChooseLocationScreen = ({
  route,
}: RootStackScreenProps<'ChooseLocation'>) => {
  const { hotspots } = useContext(MapContext);
  const [selectedLocation, setSelectedLocation] = useState<Location>();

  const canConfirmAddress = selectedLocation !== defaultLocation;

  const mapRef = useRef<MapView>(null);
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

  return (
    <>
      <SecondaryAppbar onBackPressed={() => navigation.goBack()} />
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          // use intial region + animateToRegion instead of region as react state because
          // gestures don't work well https://github.com/react-native-maps/react-native-maps/issues/3639
          initialRegion={intialRegion}
          showsUserLocation
          style={styles.map}
          onPress={async e => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
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
              key={`${h.latitude} ${h.longitude}`}
              coordinate={{
                latitude: h.latitude,
                longitude: h.longitude,
              }}
              title={h.name}
              description={h.description}
              onPress={() => navigation.navigate('Modal')}
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
                setSelectedLocation(defaultLocation);
              }}
            />
          ) : null}
        </MapView>
        <TextInput
          multiline={true}
          outlineColor={theme.colors.disabled}
          mode="outlined"
          style={styles.searchInput}
          autoCorrect={false}
          placeholder="Caută"
          autoComplete={false}
          right={
            <TextInput.Icon name="magnify" color={theme.colors.placeholder} />
          }
          returnKeyType="search"
          onSubmitEditing={async ({ nativeEvent: { text } }) =>
            searchForAddress(text)
          }
          value={selectedLocation && getFormattedAddress(selectedLocation)}
        />
      </View>

      {canConfirmAddress ? (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.confirmAddressButton}
          onPress={() => {
            navigation.navigate('AddHotspot', { location: selectedLocation });
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
      paddingHorizontal: 8,

      shadowColor: theme.colors.text,
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.2,
    },
    marker: {
      width: 40,
      height: 40,
    },
  });
