import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getEnvConfig = () => {
  const releaseChannel =
    Platform.OS === 'web'
      ? Constants.manifest?.extra?.releaseChannel
      : Constants.manifest?.releaseChannel;

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

const isDevelopment = environment === 'development';

export { server, environment, isDevelopment };
