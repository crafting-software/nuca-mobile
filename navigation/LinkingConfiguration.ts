/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */
import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['/'],
  config: {
    screens: {
      Authentication: 'authentication',
      Main: 'main',
      AddHotspot: 'addHotspot',
      HotspotDetail: 'hotspotDetail',
      ReportGeneration: 'reportGeneration',
      NotFound: '*',
      ChooseLocation: 'chooseLocation',
    },
  },
};

export default linking;
