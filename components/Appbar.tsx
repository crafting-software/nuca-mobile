import * as SecureStore from 'expo-secure-store';
import { useContext, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import {
  Appbar as PaperAppbar,
  Divider,
  Menu,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import logo from '../assets/logo.png';
import { AuthContext } from '../context';

export const Appbar = () => {
  const { setAuth } = useContext(AuthContext);
  const signOut = () => {
    SecureStore.deleteItemAsync('auth');
    setAuth({ userName: '', token: '', inProgress: false });
  };

  const { top } = useSafeAreaInsets();
  const theme = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <PaperAppbar
      style={{
        paddingTop: top,
        backgroundColor: theme.colors.background,
        ...styles.bar,
      }}
    >
      <Image source={logo} style={styles.logo} />
      <Menu
        contentStyle={styles.menu}
        visible={isMenuOpen}
        onDismiss={() => setIsMenuOpen(false)}
        anchor={
          <PaperAppbar.Action icon="menu" onPress={() => setIsMenuOpen(true)} />
        }
      >
        <Menu.Item
          icon="file-chart-outline"
          onPress={() => {}}
          title="Generare raport"
        />
        <Divider />
        <Menu.Item
          icon="exit-to-app"
          onPress={signOut}
          title="Ieșire din cont"
        />
      </Menu>
    </PaperAppbar>
  );
};

const styles = StyleSheet.create({
  bar: {
    height: 'auto',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  logo: { width: 75, height: 30 },
  menu: {
    borderRadius: 4,
  },
});
