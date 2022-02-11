import React, { useState } from 'react';
<<<<<<< HEAD
import { Image, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Button, TextInput, Title, useTheme } from 'react-native-paper';
=======
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, Title, useTheme, TextInput } from 'react-native-paper';
>>>>>>> master
import catLady from '../assets/cat-lady.png';
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
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

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
        outlineColor={theme.colors.disabled}
        mode="outlined"
        style={styles.input}
        placeholder="Utilizator"
        value={userName}
        onChangeText={setUserName}
        autoComplete={false}
        left={<TextInput.Icon name="account" color={theme.colors.primary} />}
      />
      <TextInput
        outlineColor={theme.colors.disabled}
        mode="outlined"
        secureTextEntry
        style={styles.input}
        placeholder="Parola"
        value={password}
        onChangeText={setPassword}
        autoComplete={false}
        left={<TextInput.Icon name="lock" color={theme.colors.primary} />}
      />
      <Button
        uppercase={false}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        icon="arrow-right"
        mode="contained"
        onPress={() => navigation.navigate('Main')}
      >
        Intră în cont
      </Button>
    </KeyboardAvoidingView>
  );
};
