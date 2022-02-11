import * as LocationProvider from 'expo-location';
import { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { LatLng, Marker, Region } from 'react-native-maps';
import { FAB } from 'react-native-paper';
import {
  MainController,
  MainControllerProvider,
} from '../controllers/MainController';
import { Hotspot } from '../models/Hotspot';

const getInitialRegion = (): Region => {
  return {
    latitude: 46.77293258116839,
    longitude: 23.587688864363546,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
};

let currentRegion = getInitialRegion();

const findCurrentLocation = async () => {
  const { status } = await LocationProvider.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access location was denied');
  }

  const location = await LocationProvider.getCurrentPositionAsync({});

  const place = await LocationProvider.reverseGeocodeAsync(location.coords);

  let address;
  place.find(a => {
    address = a;
  });

  return JSON.stringify(address);
};

const MainScreenContent = () => {
  const mainController = useContext(MainController);
  const [address, setAddress] = useState('');

  return (
    <View style={styles.container}>
      <MapView
        region={currentRegion}
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
          const ad = await findCurrentLocation();
          setAddress(ad);
        }}
      ></FAB>
      <Text style={styles.currentLocationLabel}>{address}</Text>
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
