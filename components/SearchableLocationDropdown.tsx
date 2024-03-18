import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, Platform, Text, TextInput } from 'react-native';
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
  AutocompleteDropdownRef,
} from 'react-native-autocomplete-dropdown';
import MapView from 'react-native-maps';
import { Theme, useTheme } from 'react-native-paper';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  dropdownDebounceTime,
  dropdownInputHeight,
  dropdownListMaxHeight,
} from '../constants/layout';
import {
  initialLatitudeDelta,
  initialLongitudeDelta,
  deltaRatio,
} from '../constants/location';
import { MapContext } from '../context';
import { LocationItemProps } from '../models/Hotspot';
import { Location } from '../models/Location';
import { searchLocations } from '../utils/hotspots';
import SnackbarManager from '../utils/SnackbarManager';

export const SearchableLocationDropdown = forwardRef(
  (_props, ref: React.ForwardedRef<MapView>) => {
    const [loading, setLoading] = useState(false);
    const [suggestionsList, setSuggestionsList] = useState<
      TAutocompleteDropdownItem[] | null
    >(null);
    const searchRef = useRef<TextInput>(null);
    const dropdownController = useRef<AutocompleteDropdownRef | null>(null);
    const { selectedLocation, setSelectedLocation } = useContext(MapContext);

    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const styles = getStyles(theme, insets);

    const searchForAddress = async (address: string) => {
      try {
        return await searchLocations(address, 'ip');
      } catch (e) {
        alert('Address not found');
        return [];
      }
    };

    const getSuggestions = useCallback(async (query: string) => {
      setLoading(true);
      const locationResults = await searchForAddress(query);

      if (!Array.isArray(locationResults)) {
        SnackbarManager.error(
          "SearchableLocationDropdown.tsx",
          "A failure occured while obtaining the location search results.");
        return;
      }

      setSuggestionsList(locationResults.map((item: LocationItemProps) => ({
        id: `${item.coordinates?.latitude};${item.coordinates?.longitude}`,
        title: item.placeName,
      })));
      setLoading(false);
    }, []);

    const animateToSelectedLocation = (locationData: LocationItemProps) => {
      if (!ref || typeof ref === 'function') return;

      ref?.current?.animateToRegion({
        latitude: locationData!.coordinates!.latitude,
        longitude: locationData!.coordinates!.longitude,
        latitudeDelta: initialLatitudeDelta / deltaRatio,
        longitudeDelta: initialLongitudeDelta / deltaRatio,
      });
    };

    const onClearPress = useCallback(() => {
      setSuggestionsList(null);
    }, []);

    const onOpenSuggestionsList = useCallback((isOpened: boolean) => {}, []);

    const LocationItem = ({title}: TAutocompleteDropdownItem) => (
      <View style={styles.locationItem}>
        <Text style={styles.locationTitle}>{title}</Text>
      </View>
    );

    const setController = (controller: AutocompleteDropdownRef) => {
      dropdownController.current = controller;
    };

    const setSelectedSuggestedLocation = (item: TAutocompleteDropdownItem) => {
      if (!item) return;

      const [latitude, longitude] = item?.id
        .split(';')
        .map((x: string) => parseFloat(x));
      const selectedLocationToBeUpdated: Location = { latitude, longitude };
      setSelectedLocation(selectedLocationToBeUpdated);
      dropdownController.current?.setInputText(item.title!);

      animateToSelectedLocation({
        coordinates: { latitude, longitude },
      } as LocationItemProps);
    };

    const renderLocationItem = (
      item: TAutocompleteDropdownItem,
      _title: string
    ) => <LocationItem {...item} />;

    useEffect(() => {
      const addressElements = [
        selectedLocation?.street,
        selectedLocation?.streetNumber,
        selectedLocation?.postalCode,
        selectedLocation?.city,
      ].filter(x => x);
      addressElements.length > 0 &&
        dropdownController?.current?.setInputText(addressElements.join(', '));
    }, [selectedLocation]);

    return (
      <AutocompleteDropdown
        ref={searchRef}
        controller={setController}
        direction={Platform.select({ ios: 'down' })}
        dataSet={suggestionsList}
        onChangeText={getSuggestions}
        onSelectItem={setSelectedSuggestedLocation}
        debounce={dropdownDebounceTime}
        suggestionsListMaxHeight={dropdownListMaxHeight}
        onClear={onClearPress}
        onOpenSuggestionsList={onOpenSuggestionsList}
        loading={loading}
        textInputProps={{
          placeholder: 'Caută',
          autoCorrect: false,
          autoCapitalize: 'none',
          style: styles.textInputStyle,
        }}
        rightButtonsContainerStyle={styles.rightButtonsContainerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        suggestionsListContainerStyle={styles.suggestionsListContainerStyle}
        containerStyle={styles.containerStyle}
        renderItem={renderLocationItem}
        inputHeight={dropdownInputHeight}
        useFilter={false}
        showChevron={false}
        closeOnBlur={false}
        clearOnFocus={false}
        showClear={true}
      />
    );
  }
);

const getStyles = (theme: Theme, insets: EdgeInsets) =>
  StyleSheet.create({
    locationItem: {
      paddingTop: 10,
      paddingBottom: 10,
    },
    locationTitle: {
      paddingLeft: 25,
      paddingRight: 25,
    },
    textInputStyle: {
      borderRadius: 25,
      backgroundColor: '#ffffff',
      color: '#000',
      paddingLeft: 18,
    },
    rightButtonsContainerStyle: {
      right: 8,
      height: 30,
      alignSelf: 'center',
    },
    inputContainerStyle: {
      backgroundColor: '#ffffff',
      borderRadius: 25,
    },
    suggestionsListContainerStyle: {
      backgroundColor: '#ffffff',
      borderRadius: 25,
    },
    containerStyle: {
      flexGrow: 1,
      flexShrink: 1,
    },
  });
