import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const maxWidth = 640;

export const layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  isWideDevice: width >= maxWidth,
  tabIndicatorLevel: 99,
  tabIndicatorElevation: 9,
  tabBarHeight: 56,
  maxWidth,
  paddingHorizontal: Math.max((width - maxWidth) / 2, 0),
};

export const dropdownListMaxHeight = Dimensions.get('window').height * 0.4;
export const dropdownDebounceTime = 1000;
export const dropdownInputHeight = 50;
