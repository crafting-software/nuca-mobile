import * as LocationProvider from 'expo-location';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { LatLng, Marker, Region } from 'react-native-maps';
import { FAB } from 'react-native-paper';
import { Appbar } from '../components/Appbar';
import {
  MainController,
  MainControllerProvider,
} from '../controllers/MainController';
import { Hotspot } from '../models/Hotspot';
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
  const mainController = useContext(MainController);
  const [location, setLocation] = useState<Location>();

  const [region, setRegion] = useState(intialRegion);

  return (
    <MainControllerProvider>
      <Appbar />
      <MapView
        region={region}
        onRegionChange={setRegion}
        style={styles.map}
        onLongPress={e =>
          mainController.registerHotspot(
            createHotspot(e.nativeEvent.coordinate)
          )
        }
      >
        {mainController.hotspots.map(h => (
          <Marker
            key={`${h.latitude} ${h.longitude}`}
            coordinate={{
              latitude: h.latitude,
              longitude: h.longitude,
            }}
            title={h.name}
            description={h.description}
          />
        ))}
      </MapView>
      <FAB
        style={styles.currentLocationFab}
        icon="plus"
        onPress={async () => {
          const location = await findCurrentLocation();
          setLocation(location);
          setRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0,
            longitudeDelta: 0,
          });
        }}
      ></FAB>
      <Text style={styles.currentLocationLabel}>
        {!!location && getFormattedAddress(location)}
      </Text>
    </MainControllerProvider>
  );
};

function createHotspot(coordinate: LatLng): Hotspot {
  return {
    name: 'new hotspot',
    description: 'new hotspot description',
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    flex: 1,
  },
  currentLocationFab: {
    position: 'absolute',
    margin: 30,
    right: 0,
    bottom: 0,
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
});
