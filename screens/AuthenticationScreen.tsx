import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { RootStackScreenProps } from '../types';

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 64,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    width: '100%',
    marginBottom: 26,
  },
});

export const AuthenticationScreen = ({
  navigation,
}: RootStackScreenProps<'Authentication'>) => {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Intră în cont</Title>
      <Button
        style={styles.button}
        icon="map"
        mode="contained"
        onPress={() => navigation.navigate('Main')}
      >
        Intră în cont
      </Button>
    </View>
  );
};
