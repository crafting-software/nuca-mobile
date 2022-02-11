import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Caption } from 'react-native-paper';
import { RootStackScreenProps } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const AuthenticationScreen = ({
  navigation,
}: RootStackScreenProps<'Authentication'>) => {
  return (
    <View style={styles.container}>
      <Button
        icon="map"
        mode="contained"
        onPress={() => navigation.navigate('Main')}
      >
        Login
      </Button>
      <Caption>Open up App.tsx to start working on your app!</Caption>
    </View>
  );
};
