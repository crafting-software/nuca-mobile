import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Auth } from '../context';

export const useAuthentication = () => {
  const [auth, setAuth] = useState<Auth>({ inProgress: true });

  useEffect(() => {
    const restoreAuth = async () => {
      if (Platform.OS === 'web') {
        try {
          const value = await AsyncStorage.getItem('auth');
          if (value !== null) {
            const { token, username } = JSON.parse(value);
            setAuth({ token, username, inProgress: false });
          } else {
            setAuth({ token: '', username: '', inProgress: false });
          }
        } catch (e) {
          setAuth({ token: '', username: '', inProgress: false });
        }
      } else {
        const authString = await SecureStore.getItemAsync('auth');
        if (!authString) {
          setAuth({ token: '', username: '', inProgress: false });
        } else {
          const { token, username } = JSON.parse(authString);
          setAuth({ token, username, inProgress: false });
        }
      }
    };

    restoreAuth();
  }, []);

  return { auth, setAuth };
};
