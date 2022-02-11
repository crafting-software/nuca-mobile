import React, { useContext } from 'react';
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

const MainScreenContent = () => {
  const mainController = useContext(MainController);

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
        onPress={() => mainController.findCurrentLocationAndAddress()}
      ></FAB>
      <Text style={styles.currentLocationLabel}>
        {mainController.currentLocation.address}
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
