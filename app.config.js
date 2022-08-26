export default {
  expo: {
    name: 'nuca-mobile',
    slug: 'nuca-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'nuca-mobile',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'App requires geolocation to retrieve the current location in order to be easier to mark the hotspots.',
        NSLocationAlwaysUsageDescription:
          'App requires geolocation to retrieve the current location in order to be easier to mark the hotspots.',
        NSLocationWhenInUseUsageDescription:
          'App requires geolocation to retrieve the current location in order to be easier to mark the hotspots.',
        NSPhotoLibraryAddUsageDescription:
          'Photo library access is required to share photos of cats.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      permissions: [
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'CAMERA',
        'WRITE_EXTERNAL_STORAGE',
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        'expo-image-picker',
        {
          photosPermission:
            'Photo library access is required to share photos of cats.',
        },
      ],
    ],
    extra: {
      releaseChannel: process.env.RELEASE_CHANNEL,
    },
  },
};
