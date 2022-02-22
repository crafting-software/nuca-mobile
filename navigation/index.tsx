import { useContext } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context';
import { AddHotspotScreen } from '../screens/AddHotspotScreen';
import { AuthenticationScreen } from '../screens/AuthenticationScreen';
import { HotspotDetailScreen } from '../screens/HotspotDetailScreen';
import { MapScreen } from '../screens/MapScreen';
import { NotFoundScreen } from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { auth } = useContext(AuthContext);
  const isAuthenticated = !!auth.token;
  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="Main"
            component={MapScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddHotspot"
            component={AddHotspotScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NotFound"
            component={NotFoundScreen}
            options={{ title: 'Oops!', headerShown: false }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Authentication"
          component={AuthenticationScreen}
          options={{ headerShown: false }}
        />
      )}

      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="HotspotDetail"
          component={HotspotDetailScreen}
          options={{ headerShown: false }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
