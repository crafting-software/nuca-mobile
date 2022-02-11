import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackScreenProps } from '../types';

export const AuthenticationScreen = ({
  navigation,
}: RootStackScreenProps<'Authentication'>) => {
  return (
    <View
      style={{
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}
    >
      <TouchableOpacity
        style={{ width: 200, height: 100, backgroundColor: 'red' }}
        onPress={() => navigation.navigate('Main')}
      >
        <Text>Go to main</Text>
      </TouchableOpacity>
    </View>
  );
};
