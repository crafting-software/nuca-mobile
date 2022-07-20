import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { server } from '../config';

const getAuthorizationHeader = async () => {
  if (Platform.OS === 'web') {
    const value = await AsyncStorage.getItem('auth');
    const { token = '' } = value ? JSON.parse(value) : {};
    return token;
  } else {
    const authString = await SecureStore.getItemAsync('auth');
    const { token = '' } = authString ? JSON.parse(authString) : {};
    return token;
  }
};

export const makeRequest = async ({
  path,
  method = 'GET',
  body,
}: {
  path: string;
  method: string;
  body?: Record<string, any>;
}) => {
  try {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');

    const token = await getAuthorizationHeader();

    if (!!token) requestHeaders.set('Authorization', `Bearer ${token}`);

    const response = await fetch(`${server}/api${path}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const isNotSignedIn = response.status === 401;

      return { error: errorText || response, isNotSignedIn };
    }

    const contentType = response.headers.get('content-type');
    const data =
      contentType && contentType.includes('application/json')
        ? await response.json()
        : response.text();

    return { data };
  } catch (error) {
    return { error };
  }
};
