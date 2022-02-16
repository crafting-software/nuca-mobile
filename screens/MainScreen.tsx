import * as LocationProvider from 'expo-location';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { LatLng, Marker, Region } from 'react-native-maps';
import { FAB } from 'react-native-paper';
import {
  MainController,
  MainControllerProvider,
} from '../controllers/MainController';
import { Hotspot } from '../models/Hotspot';
import {
  defaultLocation,
  getAddressDisplayText,
  Location,
} from '../models/Location';

const getInitialRegion = (): Region => {
  return {
    latitude: 46.77293258116839,
    longitude: 23.587688864363546,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
};

const findCurrentLocation = async (): Promise<Location> => {
  const { status } = await LocationProvider.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access location was denied');
  }

  const location = await LocationProvider.getCurrentPositionAsync({});

  const place = await LocationProvider.reverseGeocodeAsync(location.coords);

  let street;
  place.find(p => {
    street = p.street;
  });

  let streetNumber;
  place.find(p => {
    streetNumber = p.streetNumber;
  });

  let city;
  place.find(p => {
    city = p.city;
  });

  let postalCode;
  place.find(p => {
    postalCode = p.postalCode;
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    city: city ?? '',
    postalCode: postalCode ?? '',
    street: street ?? '',
    streetNumber: streetNumber ?? '',
  };
};

const MainScreenContent = () => {
  const mainController = useContext(MainController);
  const [location, setLocation] = useState<Location>(defaultLocation);

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return (
    <View style={styles.container}>
      <MapView
        region={region}
        onRegionChange={setRegion}
        initialRegion={getInitialRegion()}
        style={styles.map}
        onLongPress={e =>
          mainController.registerHotspot(
            createHotspot(e.nativeEvent.coordinate)
          )
        }
      >
        {mainController.hotspots.map((hotspot, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: hotspot.latitude,
              longitude: hotspot.longitude,
            }}
            title={hotspot.name}
            description={hotspot.description}
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
        {getAddressDisplayText(location)}
      </Text>
    </View>
  );
};

export const MainScreen = () => {
  return (
    <MainControllerProvider>
      <MainScreenContent />
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
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
