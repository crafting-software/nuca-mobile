import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Hotspot, mockData as HotspotMockData } from '../models/Hotspot';

export const hotspots: Hotspot[] = HotspotMockData;

export const MainScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        initialRegion={getInitialRegion()}
        style={styles.map}
        onLongPress={e => alert(JSON.stringify(e.nativeEvent.position.x))}
      >
        {hotspots.map((hotspot, index) => (
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
    </View>
  );
};

const getInitialRegion = (): Region => {
  return {
    latitude: 46.77293258116839,
    longitude: 23.587688864363546,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
};

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
});
