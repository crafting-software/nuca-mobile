import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const mapboxApiKey = 'pk.eyJ1IjoiY3JhZnRpbmdtYXBib3hlcyIsImEiOiJjbHRtc2xoZTAxcDd4Mm1wNmtycG4xdGE0In0.jaf4MwDHD_EY4LbZj0fYVw';
export const mapboxGeocodingServerAddress = 'https://api.mapbox.com/search/geocode/v6/forward';

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
