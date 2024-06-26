import * as SecureStore from 'expo-secure-store';
import { useContext, useState } from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import {
  Appbar as PaperAppbar,
  Divider,
  IconButton,
  Menu,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/logo.png';
import { AuthContext } from '../context';
import { useNucaTheme as useTheme } from '../hooks/useNucaTheme';
import { EdgeInsets } from '../types';

export const Appbar = ({
  forDetailScreen = false,
  showConfirmationModal,
}: {
  forDetailScreen?: boolean;
  showConfirmationModal?: () => void;
}) => {
  const { setAuth } = useContext(AuthContext);
  const signOut = () => {
    if (Platform.OS === 'web') {
      AsyncStorage.removeItem('auth');
    } else {
      SecureStore.deleteItemAsync('auth');
    }
    setAuth({ username: '', token: '', inProgress: false });
  };

  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = getStyles(theme, insets);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const navigation = useNavigation();

  const defaultAppbarContent = (
    <>
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
          leadingIcon="file-chart-outline"
          onPress={() => {
            navigation.navigate('ReportGeneration');
            setIsMenuOpen(false);
          }}
          title="Generare raport"
        />
        <Divider />
        <Menu.Item
          leadingIcon="exit-to-app"
          onPress={() => {
            signOut();
            setIsMenuOpen(false);
          }}
          title="Ieșire din cont"
        />
      </Menu>
    </>
  );
  const detailScreenAppbarContent = (
    <IconButton
      icon="close"
      iconColor={theme.colors.text}
      size={24}
      onPress={() =>
        showConfirmationModal
          ? showConfirmationModal()
          : navigation.navigate('Main')
      }
    />
  );
  return (
    <PaperAppbar
      style={[styles.defaultBar, forDetailScreen ? styles.detailScreenBar : {}]}
    >
      {forDetailScreen ? detailScreenAppbarContent : defaultAppbarContent}
    </PaperAppbar>
  );
};

const getStyles = (theme: NucaCustomTheme, insets: EdgeInsets) =>
  StyleSheet.create({
    defaultBar: {
      paddingTop: insets.top as number,
      paddingHorizontal: 16,
      height: Platform.OS === 'web' ? 64 : 100,
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background,
    },
    detailScreenBar: {
      paddingHorizontal: 0,
      backgroundColor: theme.colors.surface,
    },
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
