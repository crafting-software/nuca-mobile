import * as LocationProvider from 'expo-location';
import React, { useContext, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { EdgeInsets, Marker, Region } from 'react-native-maps';
import { Caption, FAB, TextInput, Title, useTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import currentLocationIcon from '../assets/current-location.png';
import { Appbar } from '../components/Appbar';
import { MapContext } from '../context';
import { getHotspotMarker } from '../models/Hotspot';
import { getFormattedAddress, Location } from '../models/Location';

const intialRegion: Region = {
  latitude: 46.77293258116839,
  longitude: 23.587688864363546,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const findCurrentLocation = async (): Promise<Location> => {
  const { status } = await LocationProvider.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access location was denied.');
  }

  const position = await LocationProvider.getCurrentPositionAsync();
  let location: Location = {
    ...position.coords,
  };

  const place = await LocationProvider.reverseGeocodeAsync(position.coords);
  place.find(address => {
    location = { ...address, ...location };
  });

  return location;
};

export const MapScreen = () => {
  const { hotspots } = useContext(MapContext);
  const [location, setLocation] = useState<Location>();
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();

  const searchForAddress = async (address: string): Promise<void> => {
    try {
      const [{ latitude, longitude }] = await LocationProvider.geocodeAsync(
        address
      );

      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
      });
    } catch (e) {
      alert('Address not found');
    }
  };

  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = getStyles(theme, insets);

  return (
    <>
      <Appbar />
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          // use intial region + animateToRegion instead of region as react state because
          // gestures don't work well https://github.com/react-native-maps/react-native-maps/issues/3639
          initialRegion={intialRegion}
          showsUserLocation
          style={styles.map}
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
              image={getHotspotMarker(h)}
              onPress={() => navigation.navigate('Modal2')}
            />
          ))}
        </MapView>
        <TextInput
          outlineColor={theme.colors.disabled}
          mode="outlined"
          style={styles.searchInput}
          autoCorrect={false}
          placeholder="Caută"
          autoComplete={false}
          right={<TextInput.Icon name="magnify" color={theme.colors.primary} />}
          returnKeyType="search"
          onSubmitEditing={async ({ nativeEvent: { text } }) =>
            searchForAddress(text)
          }
        />
      </View>
      <TouchableOpacity
        style={styles.addLocationButton}
        activeOpacity={0.9}
        onPress={() => {}}
      >
        <View style={styles.addLocationButtonLabelContainer}>
          <Caption style={styles.addLocationButtonLabel}>
            ADAUGĂ ZONĂ DE INTERES
          </Caption>
          <Title style={styles.addLocationButtonLabelIcon}>+</Title>
        </View>
      </TouchableOpacity>
      <FAB
        style={styles.currentLocationButton}
        icon={currentLocationIcon}
        small
        onPress={async () => {
          const location = await findCurrentLocation();
          setLocation(location);

          mapRef.current?.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0,
            longitudeDelta: 0,
          });
        }}
      />
      <Text style={styles.currentLocationLabel}>
        {!!location && getFormattedAddress(location)}
      </Text>
    </>
  );
};

const getStyles = (theme: Theme, insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
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
    addLocationButton: {
      position: 'absolute',
      bottom: Math.max(20, insets.bottom as number),
      left: 20,
      backgroundColor: theme.colors.text,
      borderRadius: theme.roundness,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12,

      elevation: 6,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.2,
    },
    addLocationButtonLabelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addLocationButtonLabel: {
      color: theme.colors.background,
      fontSize: 12,
      fontFamily: 'Nunito_700Bold',
      letterSpacing: 0.2,
    },
    addLocationButtonLabelIcon: {
      marginLeft: 8,
      color: theme.colors.background,
      fontSize: 24,
      fontFamily: 'Nunito_700Bold',
    },
    currentLocationLabel: {
      fontSize: 20,
      backgroundColor: 'orange',
      width: '100%',
      position: 'absolute',
      marginBottom: 100,
      right: 0,
      bottom: 0,
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
  });
