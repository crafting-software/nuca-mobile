import Constants from 'expo-constants';

const getEnvConfig = () => {
  const { releaseChannel } = Constants.manifest || {};

  if (releaseChannel === 'prod') {
    const server = 'https://...';
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
