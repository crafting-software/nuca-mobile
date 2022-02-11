import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>
    </PaperProvider>
  );
};
