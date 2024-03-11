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

const buildRequestBody = (
  body: Record<string, any>,
  sendAsFormData: boolean
) => {
  if (sendAsFormData) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      formData.append(key, value);
    }
    return formData;
  }
  return JSON.stringify(body);
};

export const makeRequest = async ({
  path,
  method = 'GET',
  body,
  headers,
  sendAsFormData,
}: {
  path: string;
  method: string;
  body?: Record<string, any>;
  headers?: Record<string, string>;
  sendAsFormData?: boolean;
}) => {
  try {
    const requestHeaders: HeadersInit = new Headers();

    for (const [key, value] of Object.entries(
      headers || { 'Content-Type': 'application/json' }
    )) {
      requestHeaders.set(key, value);
    }

    const requestBody = body && buildRequestBody(body, sendAsFormData || false);

    const token = await getAuthorizationHeader();

    if (!!token) requestHeaders.set('Authorization', `Bearer ${token}`);

    const response = await fetch(`${server}/api${path}`, {
      method,
      headers: requestHeaders,
      body: body ? requestBody : null,
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
