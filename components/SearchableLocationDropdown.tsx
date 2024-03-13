import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { LocationItemProps } from "../models/Hotspot";
import { searchLocations } from "../utils/hotspots";
import { 
    View, 
    StyleSheet,
    Platform,
    Dimensions,
    Text
} from "react-native";
import MapView from "react-native-maps";
import { initialLatitudeDelta, initialLongitudeDelta, deltaRatio } from "../constants/location";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme, useTheme } from "react-native-paper";
import { AutocompleteDropdown, TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { MapContext } from "../context";
import { Location } from "../models/Location";

export type SearchableLocationDropdownProps = {
  mapRef: React.RefObject<MapView>;
}

export const SearchableLocationDropdown = ({ mapRef }: SearchableLocationDropdownProps) => {
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState<TAutocompleteDropdownItem[] | null>(null);
  const searchRef = useRef<any>(null);
  const dropdownController = useRef<any>(null);
  const {
    selectedLocation,
    setSelectedLocation
  } = useContext(MapContext);

  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = getStyles(theme, insets);

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
      latitudeDelta: initialLatitudeDelta / deltaRatio,
      longitudeDelta: initialLongitudeDelta / deltaRatio,
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

  useEffect(() => {  
    const addressElements = [
      selectedLocation?.street,
      selectedLocation?.streetNumber,
      selectedLocation?.postalCode,
      selectedLocation?.city
    ].filter(x => x);
    addressElements.length > 0 &&
      dropdownController.current.setInputText(addressElements.join(', '));
  }, [selectedLocation]);
    
  return (
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

            const [latitude, longitude] = item?.id.split(';').map((x: string) => parseFloat(x));
            const selectedLocationToBeUpdated: Location = {latitude, longitude};
            setSelectedLocation(selectedLocationToBeUpdated);
            dropdownController.current.setInputText(item.title);

            animateToSelectedLocation({
                coordinates: {
                    latitude,
                    longitude
                },
                place_name: item.title
            } as LocationItemProps);
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
  );
}

const getStyles = (theme: Theme, insets: EdgeInsets) =>
  StyleSheet.create({
    locationItem: {
      paddingTop: 10,
      paddingBottom: 10
    },
    locationTitle: {
      paddingLeft: 25,
      paddingRight: 25,
    }
  });
