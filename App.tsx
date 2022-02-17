import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Nunito_200ExtraLight,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_700Bold,
  Nunito_400Regular_Italic,
} from '@expo-google-fonts/nunito';
import { AuthContextProvider, MapContextProvider } from './context';
import Navigation from './navigation/index';
import { getTheme } from './theme';

export default () => {
  const [fontsLoaded] = useFonts({
    Nunito_200ExtraLight,
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_400Regular_Italic,
  });

  if (!fontsLoaded) return <AppLoading />;

  const theme = getTheme();

  return (
    <AuthContextProvider>
      <MapContextProvider>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <Navigation />
            <StatusBar />
          </SafeAreaProvider>
        </PaperProvider>
      </MapContextProvider>
    </AuthContextProvider>
  );
};
