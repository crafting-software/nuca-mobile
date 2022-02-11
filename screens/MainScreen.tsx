import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';

export const MainScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        initialRegion={getInitialRegion()}
        style={styles.map}
        onLongPress={e => alert(JSON.stringify(e.nativeEvent.position.x))}
      />
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
    height: '50%',
  },
});
