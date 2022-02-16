import { Image, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import splash from '../assets/splash.png';

const screen = Dimensions.get('screen');

const styles = StyleSheet.create({
  splash: {
    width: screen.width,
    height: screen.height,
  },
});

export const SplashScreen = () => (
  <Image source={splash} resizeMode="cover" style={styles.splash} />
);
