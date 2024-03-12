import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions
} from 'react-native';
import MapView from 'react-native-maps';
import { Caption, FAB, Title, useTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import currentLocationIcon from '../assets/current-location.png';
import { Appbar } from '../components/Appbar';
import { FullScreenActivityIndicator } from '../components/FullScreenActivityIndicator';
import { MapContext } from '../context';
import { findCurrentLocation } from '../context/MapContext';
import { Marker } from '../maps';
import { getHotspotMarker, Hotspot, LocationItemProps } from '../models/Hotspot';
import { Location } from '../models/Location';
import { EdgeInsets, Region } from '../types';
import SnackbarManager from '../utils/SnackbarManager';
import { loadHotspots, searchLocations } from '../utils/hotspots';
import { AutocompleteDropdown, TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

export const MapScreen = () => {
  const { hotspots, setHotspots } = useContext(MapContext);
  const [location, setLocation] = useState<Location>();
  const [region, setRegion] = useState<Region>({
    latitude: 46.77293258116839,
    longitude: 23.587688864363546,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = getStyles(theme, insets);
  const searchRef = useRef<any>(null);
  const dropdownController = useRef<any>(null);
  const [suggestionsList, setSuggestionsList] = useState<TAutocompleteDropdownItem[] | null>(null);
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string>();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const { success, hotspots = [] } = await loadHotspots();
      setIsLoading(false);

      if (!success)
        SnackbarManager.error(
          'MapScreen - useEffect',
          'Failed to load hotspots'
        );
      setHotspots(hotspots);
    };
    load();
  }, []);

  const searchForAddress = async (address: string) => {
    try {
      const results: any = await searchLocations(address, 'ip');
      return results;
    } catch (e) {
      alert('Address not found');
      return [];
    }
  };

  const getSuggestions = useCallback(async (query: string) => {
    setLoading(true);
    const locationResults = await searchForAddress(query);

    const suggestions = locationResults
      .map((item: LocationItemProps) => ({
        id: `${item.coordinates?.latitude};${item.coordinates?.longitude}`,
        title: item.place_name,
      }))

    setSuggestionsList(suggestions);
    setLoading(false);
  }, []);

  const animateToSelectedLocation = (locationData: LocationItemProps) => {
    mapRef.current?.animateToRegion({
      latitude: locationData!.coordinates!.latitude,
      longitude: locationData!.coordinates!.longitude,
      latitudeDelta: region.latitudeDelta / 6,
      longitudeDelta: region.longitudeDelta / 6,
    });
  }

  const onClearPress = useCallback(() => {
    setSuggestionsList(null);
  }, []);

  const onOpenSuggestionsList = useCallback((isOpened: any) => {}, []);

  const LocationItem = ({item}: any) => (
    <View style={styles.locationItem}>
      <Text style={styles.locationTitle}>{item.title}</Text>
    </View>
  );

  const onMapRateLimitExceeded = () => {
    SnackbarManager.error(
      'HotspotFormScreen',
      'A apărut o problemă, așteptați câteva momente și încercați din nou.'
    );
  };

  return (
    <>
      <Appbar />
      <View style={styles.mapContainer}>
        <MapView
          // @ts-ignore
          options={{
            disableDefaultUI: true,
          }}
          ref={mapRef}
          // use intial region + animateToRegion instead of region as react state because
          // gestures don't work well https://github.com/react-native-maps/react-native-maps/issues/3639
          initialRegion={region}
          onRegionChange={() => {
            setRegion;
          }}
          showsUserLocation
          style={styles.map}
        >
          {hotspots.map((h: Hotspot) => (
            <Marker
              icon={
                Platform.OS === 'web'
                  ? {
                      url: getHotspotMarker(h),
                      scaledSize: new google.maps.Size(40, 40),
                      origin: new google.maps.Point(0, 0),
                      anchor: new google.maps.Point(0, 0),
                    }
                  : {}
              }
              key={`${h.latitude} ${h.longitude}`}
              coordinate={{
                latitude: h.latitude,
                longitude: h.longitude,
              }}
              onPress={() =>
                navigation.navigate('HotspotDetail', { hotspotId: h.id })
              }
            >
              <Image
                source={getHotspotMarker(h)}
                style={styles.marker}
                resizeMode="contain"
              />
            </Marker>
          ))}
        </MapView>
        <View style={styles.searchInput}>
        <AutocompleteDropdown
          ref={searchRef}
          controller={controller => {
            dropdownController.current = controller
          }}
          direction={Platform.select({ ios: 'down' })}
          dataSet={suggestionsList}
          onChangeText={getSuggestions}
          onSelectItem={item => {
            if (!item)
              return;
            setSelectedItem(item.id)
            const [latitude, longitude] = item?.id.split(';').map((x: string) => parseFloat(x))
            animateToSelectedLocation({
              coordinates: {
                latitude,
                longitude
              },
              place_name: item.title
            } as LocationItemProps)
          }}
          debounce={1000}
          suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
          onClear={onClearPress}
          onOpenSuggestionsList={onOpenSuggestionsList}
          loading={loading}
          useFilter={false}
          textInputProps={{
            placeholder: 'Caută',
            autoCorrect: false,
            autoCapitalize: 'none',
            style: {
              borderRadius: 25,
              backgroundColor: '#ffffff',
              color: '#000',
              paddingLeft: 18,
            },
          }}
          rightButtonsContainerStyle={{
            right: 8,
            height: 30,
            alignSelf: 'center',
          }}
          inputContainerStyle={{
            backgroundColor: '#ffffff',
            borderRadius: 25,
          }}
          suggestionsListContainerStyle={{
            backgroundColor: '#ffffff',
            borderRadius: 25
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1 }}
          renderItem={(item: any, title: any) => <LocationItem item={item}/> }
          inputHeight={50}
          showChevron={false}
          closeOnBlur={false}
          clearOnFocus={false}
          showClear={true}
        />
        </View>
      </View>
      <TouchableOpacity
        style={styles.addLocationButton}
        activeOpacity={0.9}
        onPress={() => {
          navigation.navigate('AddHotspot', {
            location: location,
            region: region,
          });
        }}
      >
        <View style={styles.addLocationButtonLabelContainer}>
          <Caption style={styles.addLocationButtonLabel}>
            ADAUGĂ ZONĂ DE INTERES
          </Caption>
          <Title style={styles.addLocationButtonLabelIcon}>+</Title>
        </View>
      </TouchableOpacity>
      <FAB
        style={styles.currentLocationButton}
        icon={currentLocationIcon}
        small
        onPress={async () => {
          const location = await findCurrentLocation(onMapRateLimitExceeded);
          if (!!location) {
            setLocation(location);

            mapRef.current?.animateToRegion({
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0,
              longitudeDelta: 0,
            });
          }
        }}
      />
      {isLoading && <FullScreenActivityIndicator />}
    </>
  );
};

const getStyles = (theme: Theme, insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    mapContainer: {
      position: 'relative',
      width: '100%',
      flex: 1,
    },
    map: {
      width: '100%',
      flex: 1,
    },
    currentLocationButton: {
      position: 'absolute',
      bottom: Math.max(20, insets.bottom as number),
      right: 20,
      backgroundColor: theme.colors.text,
    },
    addLocationButton: {
      position: 'absolute',
      bottom: Math.max(20, insets.bottom as number),
      left: 20,
      backgroundColor: theme.colors.text,
      borderRadius: theme.roundness,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12,

      elevation: 6,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.2,
    },
    addLocationButtonLabelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addLocationButtonLabel: {
      color: theme.colors.background,
      fontSize: 12,
      fontFamily: 'Nunito_700Bold',
      letterSpacing: 0.2,
    },
    addLocationButtonLabelIcon: {
      marginLeft: 8,
      color: theme.colors.background,
      fontSize: 24,
      fontFamily: 'Nunito_700Bold',
    },
    searchInput: {
      position: 'absolute',
      top: 20,
      left: 20,
      right: 20,
      elevation: 6,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 0.22,
      borderRadius: 30,
    },
    sheetContainer: {
      flex: 1,
      alignItems: 'center',
      height: 40
    },
    marker: {
      width: 40,
      height: 40,
    },
    locationItem: {
      paddingTop: 10,
      paddingBottom: 10
    },
    locationTitle: {
      paddingLeft: 25,
      paddingRight: 25,
    }
  });
