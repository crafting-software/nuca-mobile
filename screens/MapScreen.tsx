import { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Details } from 'react-native-maps';
import { Caption, FAB, Title } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import currentLocationIcon from '../assets/current-location.png';
import { Appbar } from '../components/Appbar';
import { FullScreenActivityIndicator } from '../components/FullScreenActivityIndicator';
import { Marker } from '../components/Marker';
import { SearchableLocationDropdown } from '../components/SearchableLocationDropdown';
import { initialLatitude, initialLongitude } from '../constants/location';
import { MapContext } from '../context';
import { findCurrentLocation } from '../context/MapContext';
import { useNucaTheme as useTheme } from '../hooks/useNucaTheme';
import { getHotspotMarker, Hotspot } from '../models/Hotspot';
import { EdgeInsets, Region } from '../types';
import SnackbarManager from '../utils/SnackbarManager';
import { loadHotspots } from '../utils/hotspots';

export const MapScreen = () => {
  const {
    hotspots,
    setHotspots,
    selectedLocation,
    setSelectedLocation,
    region,
    setRegion,
  } = useContext(MapContext);
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = getStyles(theme, insets);

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

  const onMapRateLimitExceeded = () => {
    SnackbarManager.error(
      'HotspotFormScreen',
      'A apărut o problemă, așteptați câteva momente și încercați din nou.'
    );
  };

  const onRegionChange = (region: Region, _details: Details) =>
    setRegion(region);

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
          showsUserLocation
          showsMyLocationButton={false}
          onRegionChangeComplete={onRegionChange}
          onMapReady={() => setIsMapReady(true)}
          style={styles.map}
        >
          {hotspots.map((h: Hotspot) => (
            <Marker
              key={`${h.latitude} ${h.longitude}`}
              coordinate={{
                latitude: h.latitude,
                longitude: h.longitude,
              }}
              passthroughKey={h.id}
              height={styles.marker.height}
              width={styles.marker.width}
              isMapReady={isMapReady}
              imageSource={getHotspotMarker(h)}
              onPress={() =>
                navigation.navigate('HotspotDetail', { hotspotId: h.id })
              }
            />
          ))}
        </MapView>
        <View style={styles.searchInput}>
          <SearchableLocationDropdown ref={mapRef} />
        </View>
      </View>
      <TouchableOpacity
        style={styles.addLocationButton}
        activeOpacity={0.9}
        onPress={() => {
          navigation.navigate('AddHotspot', {
            location: selectedLocation,
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
          setSelectedLocation(location);

          mapRef.current?.animateToRegion({
            latitude: location?.latitude || initialLatitude,
            longitude: location?.longitude || initialLongitude,
            latitudeDelta: 0,
            longitudeDelta: 0,
          });
        }}
      />
      {isLoading && <FullScreenActivityIndicator />}
    </>
  );
};

const getStyles = (theme: NucaCustomTheme, insets: EdgeInsets) =>
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
      height: 40,
    },
    marker: {
      width: 40,
      height: 40,
    },
    locationItem: {
      paddingTop: 10,
      paddingBottom: 10,
    },
    locationTitle: {
      paddingLeft: 25,
      paddingRight: 25,
    },
  });
