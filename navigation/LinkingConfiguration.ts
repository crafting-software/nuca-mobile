/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */
import * as Linking from 'expo-linking';
import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Authentication: 'authentication',
      Main: 'main',
      AddHotspot: 'addHotspot',
      Modal: 'modal',
      NotFound: '*',
      ChoooseLocation: 'chooseLocation',
    },
  },
};

export default linking;
