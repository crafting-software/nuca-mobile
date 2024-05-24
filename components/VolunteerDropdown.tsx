import { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Text, TextInput } from 'react-native';
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
  AutocompleteDropdownRef,
} from 'react-native-autocomplete-dropdown';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  dropdownDebounceTime,
  dropdownInputHeight,
  dropdownListMaxHeight,
} from '../constants/layout';
import { useNucaTheme as useTheme } from '../hooks/useNucaTheme';
import { User } from '../models/User';
import { loadUsersRequest } from '../utils/users';

type VolunteerDropdownProps = {
  volunteer?: User;
  onSelect: (selectedVolunteer?: User) => void;
};

export const VolunteerDropdown = ({
  volunteer,
  onSelect,
}: VolunteerDropdownProps) => {
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState<
    TAutocompleteDropdownItem[] | null
  >(null);
  const searchRef = useRef<TextInput>(null);
  const dropdownController = useRef<AutocompleteDropdownRef | undefined>();
  const [selectedVolunteer, setSelectedVolunteer] = useState<User | undefined>(
    volunteer
  );

  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = getStyles(theme, insets);

  const encodeUserDetailsAsString = (user?: User) =>
    `${user?.id};${user?.email};${user?.phone};${user?.username}`;
  const decodeUserDetailsFromId = (userId: string) => userId.split(';');

  const getSuggestions = useCallback(async (query: string) => {
    setLoading(true);
    const { success, users: volunteers } = await loadUsersRequest();
    if (!success) alert('Failed to load users');

    const tokenizedQuery = query.split(' ');
    const queryRegexPattern = tokenizedQuery.reduce((acc, x) => acc + '|' + x);
    const regex = new RegExp(queryRegexPattern, 'i');
    const relevantVolunteers = volunteers.filter((x: User) =>
      x.name.match(regex)
    );

    type UserIdNamePair = { id: string; title: string };

    setSuggestionsList(
      relevantVolunteers
        .map((item: User) => ({
          id: encodeUserDetailsAsString(item),
          title: item.name,
        }))
        .sort((a: UserIdNamePair, b: UserIdNamePair) =>
          a.title.localeCompare(b.title)
        )
    );
    setLoading(false);
  }, []);

  const onClearPress = useCallback(() => {
    setSuggestionsList(null);
    setSelectedVolunteer(undefined);
    onSelect(undefined);
    dropdownController?.current?.open();
  }, []);

  const onBlur = () =>
    dropdownController &&
    dropdownController?.current?.setItem({
      id: encodeUserDetailsAsString(selectedVolunteer),
      title: selectedVolunteer?.name || null,
    });

  const onFocus = () => setSelectedVolunteer(undefined);

  const onOpenSuggestionsList = useCallback((_isOpened: boolean) => {}, []);

  const VolunteerItem = ({ title }: TAutocompleteDropdownItem) => (
    <View style={styles.volunteerItem}>
      <Text style={styles.volunteerName}>{title}</Text>
    </View>
  );

  const setController = (controller: AutocompleteDropdownRef) => {
    dropdownController.current = controller;
  };

  const setSelectedSuggestedVolunteer = (item: TAutocompleteDropdownItem) => {
    if (!item) return;

    const volunteerName = item.title || '';
    const [id, email, phone, username] = decodeUserDetailsFromId(item.id);
    const selectedVolunteerToBeUpdated: User = {
      name: volunteerName,
      id: id,
      email: email,
      phone: phone,
      username: username,
    };
    setSelectedVolunteer(selectedVolunteerToBeUpdated);
    onSelect(selectedVolunteerToBeUpdated);
    dropdownController.current?.setInputText(volunteerName);
  };

  const renderVolunteerItem = (
    item: TAutocompleteDropdownItem,
    _title: string
  ) => <VolunteerItem {...item} />;

  useEffect(() => {
    selectedVolunteer
      ? dropdownController.current?.setInputText(selectedVolunteer.name)
      : getSuggestions('');
  }, [selectedVolunteer]);

  return (
    <AutocompleteDropdown
      ref={searchRef}
      controller={setController}
      direction={Platform.select({ ios: 'down' })}
      dataSet={suggestionsList}
      onChangeText={getSuggestions}
      onSelectItem={setSelectedSuggestedVolunteer}
      debounce={dropdownDebounceTime}
      suggestionsListMaxHeight={dropdownListMaxHeight}
      onFocus={onFocus}
      onBlur={onBlur}
      onClear={onClearPress}
      onOpenSuggestionsList={onOpenSuggestionsList}
      loading={loading}
      textInputProps={{
        placeholder: 'Caută numele voluntarului',
        autoCorrect: false,
        autoCapitalize: 'none',
        style: styles.textInputStyle,
      }}
      rightButtonsContainerStyle={styles.rightButtonsContainerStyle}
      inputContainerStyle={styles.inputContainerStyle}
      suggestionsListContainerStyle={styles.suggestionsListContainerStyle}
      containerStyle={styles.containerStyle}
      renderItem={renderVolunteerItem}
      inputHeight={dropdownInputHeight}
      emptyResultText="Niciun rezultat gǎsit!"
      useFilter={false}
      closeOnBlur={false}
      showClear={true}
    />
  );
};

const getStyles = (theme: NucaCustomTheme, _insets: EdgeInsets) =>
  StyleSheet.create({
    volunteerItem: {
      paddingTop: 15,
      paddingBottom: 15,
    },
    volunteerName: {
      paddingLeft: 25,
      paddingRight: 25,
    },
    textInputStyle: {
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.background,
      color: theme.colors.placeholder,
      paddingLeft: 18,
    },
    rightButtonsContainerStyle: {
      right: 20,
      height: 30,
      alignSelf: 'center',
    },
    inputContainerStyle: {
      backgroundColor: theme.colors.background,
      borderRadius: 25,
    },
    suggestionsListContainerStyle: {
      backgroundColor: theme.colors.background,
      borderRadius: 25,
    },
    containerStyle: {
      flexGrow: 1,
      flexShrink: 1,
      borderColor: theme.colors.disabled,
      borderRadius: theme.roundness,
      borderWidth: 1,
    },
  });
