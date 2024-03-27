import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useNucaTheme as useTheme } from '../hooks/useNucaTheme';

export const FullScreenActivityIndicator = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const getStyles = (theme: NucaCustomTheme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      backgroundColor: theme.colors.backdrop,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
