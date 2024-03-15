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

const objectToFormData = (
  obj: Record<string, any>,
  formData: FormData = new FormData(),
  parentKey: string = ''
): FormData =>
  Object.entries(obj).reduce((fd: FormData, [key, value]: [string, any]) => {
    const propName: string = parentKey ? `${parentKey}[${key}]` : key;

    if (typeof value === 'object' && !(value instanceof File)) {
      return objectToFormData(value, fd, propName);
    } else if (Array.isArray(value)) {
      value.forEach((item: any, index: number) =>
        objectToFormData(item, fd, `${propName}[${index}]`)
      );
    } else {
      if (value !== undefined) fd.append(propName, value);
    }

    return fd;
  }, formData);

const buildRequestBody = (
  body: Record<string, any>,
  sendAsFormData: boolean
) => {
  if (sendAsFormData) {
    return objectToFormData(body);
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

    const headersObj =
      headers || sendAsFormData ? {} : { 'Content-Type': 'application/json' };

    Object.entries(headersObj).forEach(([key, value]) =>
      requestHeaders.set(key, value)
    );

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
