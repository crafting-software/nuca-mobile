import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
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

const isValueAnObject = (value: any) =>
  value && typeof value === 'object' && !(value instanceof File);
const isValueADate = (value: any) =>
  moment(value, 'YYYY-MM-DD', true).isValid() ||
  moment.utc(value, 'ddd MMM DD YYYY HH:mm:ss', true).isValid();
const isValueAnArray = (value: any) => Array.isArray(value);
const isValueUndefined = (value: any) => value !== undefined;

const objectToFormData = (
  obj: Record<string, any>,
  formData: FormData = new FormData(),
  parentKey: string = ''
): FormData =>
  Object.entries(obj).reduce((fd: FormData, [key, value]: [string, any]) => {
    const propName: string = parentKey ? `${parentKey}[${key}]` : key;

    switch (true) {
      case isValueADate(value):
        const formattedDate = moment(new Date(value)).format('YYYY-MM-DD');
        fd.append(propName, formattedDate);
        break;
      case isValueAnObject(value):
        return objectToFormData(value, fd, propName);
      case isValueAnArray(value):
        value.forEach((item: any, index: number) =>
          objectToFormData(item, fd, `${propName}[${index}]`)
        );
        break;
      case isValueUndefined(value):
        fd.append(propName, value);
        break;
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
        : await response.text();

    return { data };
  } catch (error) {
    return { error };
  }
};
