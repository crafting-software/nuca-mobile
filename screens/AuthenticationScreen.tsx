import AppLoading from 'expo-app-loading';
import * as SecureStore from 'expo-secure-store';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput as NativeTextInput,
} from 'react-native';
import {
  Button,
  Snackbar,
  TextInput,
  Title,
  useTheme,
} from 'react-native-paper';
import catLady from '../assets/cat-lady.png';
import { AuthContext } from '../context';
import { signIn as serverSignIn } from '../utils/sign-in';

const getStyles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    container: {
      margin: 20,
      flex: 1,
      justifyContent: 'center',
    },
    image: {
      margin: 40,
      maxWidth: '90%',
      maxHeight: '30%',
    },
    button: {
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

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const authString = await SecureStore.getItemAsync('auth');

        if (!authString) {
          setAuth({ token: '', username: '', inProgress: false });
        } else {
          const { token, username } = JSON.parse(authString);
          setAuth({ token, username, inProgress: false });
        }
      } catch (e) {
        alert('restoring auth token failed');
        setAuth({ token: '', username: '', inProgress: false });
      }
    };

    restoreAuth();
  }, []);

  const signIn = async () => {
    if (!username) setIsInvalidUserName(true);
    if (!password) setIsInvalidPassword(true);

    if (!username || !password) return;

    setInProgress(true);
    const { success, message, token } = await serverSignIn(username, password);

    if (success) {
      await SecureStore.setItemAsync(
        'auth',
        JSON.stringify({ username, token })
      );
      setAuth({ username, token, inProgress: false });
    } else {
      setLoginFailedVisible(true);
      setInProgress(false);
    }
  };

  const theme = useTheme();
  const styles = getStyles(theme);
  const passRef = useRef<NativeTextInput>(null);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image style={styles.image} source={catLady} resizeMode="contain" />
      <Title style={styles.title}>Intră în cont</Title>
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
        left={<TextInput.Icon name="account" color={theme.colors.primary} />}
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
  );
};
