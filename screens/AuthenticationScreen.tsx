import AppLoading from 'expo-app-loading';
import * as SecureStore from 'expo-secure-store';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput as NativeTextInput,
  View,
} from 'react-native';
import {
  Button,
  Snackbar,
  TextInput,
  Title,
  useTheme,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import catLady from '../assets/cat-lady.png';
import { AuthContext } from '../context';
import SnackbarManager from '../utils/SnackbarManager';
import { isSmallScreen } from '../utils/helperFunc';
import { signIn2 } from '../utils/sign-in';

const getStyles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    container: {
      margin: 20,
      flex: 1,
      justifyContent: 'center',
      width: isSmallScreen() ? '95%' : '60%',
      alignContent: 'center',
      alignItems: 'center',
    },
    image: {
      margin: 40,
      maxWidth: '90%',
      maxHeight: '30%',
    },
    imageWeb: {
      margin: 40,
      minWidth: 200,
      flex: 1,
      width: '90%',
      height: '30%',
      maxHeight: 350,
    },
    button: {
      maxWidth: 336,
      marginTop: 24,
      width: '100%',
    },
    buttonContent: {
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row-reverse',
    },
    buttonLabel: {
      color: theme.colors.background,
      fontSize: 18,
      fontFamily: 'Nunito_700Bold',
    },
    title: {
      fontFamily: 'Nunito_700Bold',
      marginTop: 40,
      marginBottom: 26,
      width: '100%',
    },
    input: {
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: theme.roundness,
      marginBottom: 15,
      width: isSmallScreen() ? '100%' : '48%',
    },
    inputContainer: {
      flexDirection: isSmallScreen() ? 'column' : 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    mainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export const AuthenticationScreen = () => {
  const { auth, setAuth } = useContext(AuthContext);
  if (auth.inProgress) return <AppLoading />;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inProgress, setInProgress] = useState(false);
  const [loginFailedVisible, setLoginFailedVisible] = useState(false);

  const [isInvalidUserName, setIsInvalidUserName] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);

  const restoreAuth = async () => {
    if (Platform.OS === 'web') {
      try {
        const value = await AsyncStorage.getItem('auth');
        if (value !== null) {
          const { token, username } = JSON.parse(value);
          setAuth({ token, username, inProgress: false });
        }
      } catch (e) {
        setAuth({ token: '', username: '', inProgress: false });
      }
    } else {
      const authString = await SecureStore.getItemAsync('auth');
      if (!authString) {
        setAuth({ token: '', username: '', inProgress: false });
        SnackbarManager.error(
          'AuthenticationScreen - restoreAuth func.',
          'No values stored under that key.'
        );
      } else {
        const { token, username } = JSON.parse(authString);
        setAuth({ token, username, inProgress: false });
      }
    }
  };

  useEffect(() => {
    restoreAuth();
  }, []);

  const signIn = async () => {
    if (!username) setIsInvalidUserName(true);
    if (!password) setIsInvalidPassword(true);

    if (!username || !password) return;

    setInProgress(true);
    const { success, message, token } = await signIn2(username, password);

    if (success) {
      if (Platform.OS === 'web') {
        try {
          await AsyncStorage.setItem(
            'auth',
            JSON.stringify({ username, token })
          );
        } catch (e) {
          console.log('Failed to save to AsyncStorage');
        }
        setAuth({ username, token, inProgress: false });
      } else {
        await SecureStore.setItemAsync(
          'auth',
          JSON.stringify({ username, token })
        );
        setAuth({ username, token, inProgress: false });
      }
    } else {
      console.log('Error signIn ', message);
      setLoginFailedVisible(true);
      setInProgress(false);
    }
  };

  const theme = useTheme();
  const styles = getStyles(theme);
  const passRef = useRef<NativeTextInput>(null);

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Image
          style={isSmallScreen() ? styles.image : styles.imageWeb}
          source={catLady}
          resizeMode="contain"
        />
        <Title style={styles.title}>Intră în cont</Title>
        <View style={styles.inputContainer}>
          <TextInput
            disabled={inProgress}
            autoCapitalize="none"
            outlineColor={theme.colors.disabled}
            mode="outlined"
            style={styles.input}
            placeholder="Utilizator"
            value={username}
            onChangeText={setUsername}
            autoComplete={false}
            left={
              <TextInput.Icon name="account" color={theme.colors.primary} />
            }
            returnKeyType="next"
            error={isInvalidUserName}
            onChange={() => setIsInvalidUserName(false)}
            onSubmitEditing={() => passRef.current?.focus()}
          />
          <TextInput
            ref={passRef}
            disabled={inProgress}
            autoCapitalize="none"
            outlineColor={theme.colors.disabled}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            placeholder="Parola"
            value={password}
            onChangeText={setPassword}
            autoComplete={false}
            left={<TextInput.Icon name="lock" color={theme.colors.primary} />}
            returnKeyType="go"
            onSubmitEditing={signIn}
            error={isInvalidPassword}
            onChange={() => setIsInvalidUserName(false)}
          />
        </View>
        <Button
          disabled={inProgress}
          loading={inProgress}
          uppercase={false}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          icon="arrow-right"
          mode="contained"
          onPress={signIn}
        >
          Intră în cont
        </Button>
        <Snackbar
          visible={loginFailedVisible}
          onDismiss={() => setLoginFailedVisible(false)}
        >
          Autentificare nereușită!
        </Snackbar>
      </KeyboardAvoidingView>
    </View>
  );
};
