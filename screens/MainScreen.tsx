import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

export const MainScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onLongPress={e => alert(JSON.stringify(e.nativeEvent.position.x))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
