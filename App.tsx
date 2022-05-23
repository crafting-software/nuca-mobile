import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Nunito_200ExtraLight,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_400Regular_Italic,
  Nunito_500Medium,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/nunito';
import SnackbarContainer from './components/SnackbarContainer';
import {
  AuthContextProvider,
  HotspotContextProvider,
  MapContextProvider,
} from './context';
import Navigation from './navigation/index';
import { getTheme } from './theme';

export default () => {
  const [fontsLoaded] = useFonts({
    Nunito_200ExtraLight,
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_400Regular_Italic,
  });

  if (!fontsLoaded) return <AppLoading />;

  const theme = getTheme();

  return (
    <AuthContextProvider>
      <MapContextProvider>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <HotspotContextProvider>
              <Navigation />
              <StatusBar />
              <SnackbarContainer />
            </HotspotContextProvider>
          </SafeAreaProvider>
        </PaperProvider>
      </MapContextProvider>
    </AuthContextProvider>
  );
};
