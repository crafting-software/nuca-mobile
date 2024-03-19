import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const googleMapsApiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
export const mapboxApiKey = Constants.expoConfig?.extra?.mapboxApiKey;
export const mapboxGeocodingServerAddress =
  'https://api.mapbox.com/search/geocode/v6';

const getEnvConfig = () => {
  const releaseChannel =
    Platform.OS === 'web'
      ? Constants.expoConfig?.extra?.webReleaseChannel
      : Constants.expoConfig?.extra?.mobileReleaseChannel;

  if (releaseChannel === 'prod') {
    const server = 'https://api.nuca.craftingsoftware.com';
    return {
      server,
      environment: 'prod',
    };
  }

  const devHost = 'http://localhost:4000';

  return {
    server: devHost,
    environment: 'dev',
  };
};

const { server, environment } = getEnvConfig();

const isDevelopment = environment === 'dev';

export { server, environment, isDevelopment };
