import AppLoading from 'expo-app-loading';
import * as SecureStore from 'expo-secure-store';
import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Button, TextInput, Title, useTheme } from 'react-native-paper';
import catLady from '../assets/cat-lady.png';
import { AuthContext } from '../context';
import { RootStackScreenProps } from '../types';

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

export const AuthenticationScreen = ({
  navigation,
}: RootStackScreenProps<'Authentication'>) => {
  const { auth, setAuth } = useContext(AuthContext);
  if (auth.inProgress) return <AppLoading />;

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const authString = await SecureStore.getItemAsync('auth');

        if (!authString) {
          setAuth({ token: '', userName: '', inProgress: false });
        } else {
          const { token, userName } = JSON.parse(authString);
          setAuth({ token, userName, inProgress: false });
        }
      } catch (e) {
        alert('restoring auth token failed');
        setAuth({ token: '', userName: '', inProgress: false });
      }
    };

    restoreAuth();
  }, []);

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [inProgress, setInProgress] = useState(false);

  const [isInvalidUserName, setIsInvalidUserName] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);

  const signIn = async () => {
    if (!userName) setIsInvalidUserName(true);
    if (!password) setIsInvalidPassword(true);

    if (!userName || !password) return;

    setInProgress(true);
    // TODO: call real login here
    await new Promise(r => setTimeout(r, 2000));
    await SecureStore.setItemAsync(
      'auth',
      JSON.stringify({ userName, token: password })
    );
    setAuth({ userName, token: password, inProgress: false });
  };

  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image style={styles.image} source={catLady} resizeMode="contain" />
      <Title style={styles.title}>Intră în cont</Title>
      <TextInput
        disabled={inProgress}
        outlineColor={theme.colors.disabled}
        mode="outlined"
        style={styles.input}
        placeholder="Utilizator"
        value={userName}
        onChangeText={setUserName}
        autoComplete={false}
        left={<TextInput.Icon name="account" color={theme.colors.primary} />}
        returnKeyType="next"
        error={isInvalidUserName}
        onChange={() => setIsInvalidUserName(false)}
      />
      <TextInput
        disabled={inProgress}
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
    </KeyboardAvoidingView>
  );
};
