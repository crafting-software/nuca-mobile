import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CatCard } from '../components/CatCard';
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
      {/* <Title style={styles.title}>Intră în cont</Title>
      <Button
        style={styles.button}
        icon="map"
        mode="contained"
        onPress={() => navigation.navigate('Main')}
      >
        Intră în cont
      </Button> */}
      <CatCard
        cat={{
          sex: 'F',
          notes: 'Nothing to see here',
          checkInDate: new Date(),
          checkOutDate: new Date(),
          isSterilized: true,
          capturedBy: { name: 'Ionel' },
          media: [
            'https://picsum.photos/200/300?random=1',
            'https://picsum.photos/200/300?random=2',
          ],
        }}
        index={1}
      ></CatCard>
    </View>
  );
};
