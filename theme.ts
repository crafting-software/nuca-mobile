import { configureFonts, DefaultTheme } from 'react-native-paper';
import { Fonts } from 'react-native-paper/lib/typescript/types';

export const fontDefinition = {
  regular: {
    fontFamily: 'Nunito_400Regular',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'Nunito_500Medium',
    fontWeight: 'normal',
  },
  bold: {
    fontFamily: 'Nunito_700Bold',
    fontWeight: 'normal',
  },
  light: {
    fontFamily: 'Nunito_300Light',
    fontWeight: 'normal',
  },
  thin: {
    fontFamily: 'Nunito_200ExtraLight',
    fontWeight: 'normal',
  },
  italic: {
    fontFamily: 'Nunito_400Regular_Italic',
    fontStyle: 'italic',
    fontWeight: 'normal',
  },
};

export const fontConfig = {
  default: fontDefinition as Fonts,
  ios: fontDefinition as Fonts,
  android: fontDefinition as Fonts,
  web: fontDefinition as Fonts,
};

export const getTheme = () => ({
  ...DefaultTheme,
  roundness: 30,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00BAED',
    accent: '#E0D6FF',
    secondary: '#A08CDE',
    surface: '#F3F3F3',
    text: '#191F24',
    disabled: '#CEDADE',
    placeholder: '#575F65',
    error: '#FF2C52',
    onSurface: '#D9F7FF',
    notification: '#61AFC5',
    backdrop: '#FFC700',
    background: '#FFFFFF',
  },
  fonts: configureFonts(fontConfig),
});
