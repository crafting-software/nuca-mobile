import { capitalize } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {
  Button,
  Caption,
  Headline,
  TextInput,
  Title,
} from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import currentLocationIcon from '../assets/current-location.png';
import mapPinIcon from '../assets/map-pin.png';
import { Appbar } from '../components/Appbar';
import { FooterScreens, FooterView } from '../components/Footer';
import { FullScreenActivityIndicator } from '../components/FullScreenActivityIndicator';
import { InputField } from '../components/InputField';
import { NucaModal } from '../components/NucaModal';
import { VolunteerDropdown } from '../components/VolunteerDropdown';
import {
  allowedNumberOfCharactersOverLimit,
  maximumAddressDetailsLength,
  maximumKeyContactIndividualNameLength,
  maximumNotesLength,
  maximumPhoneNumberInputLength,
} from '../constants/inputLimits';
import { findCurrentLocation, MapContext } from '../context';
import { HotspotContext } from '../context/HotspotDetailContext';
import { useHotspotSave } from '../hooks/useHotspotSave';
import { useNucaTheme as useTheme } from '../hooks/useNucaTheme';
import {
  defaultHotspotDetails,
  Hotspot,
  HotspotDetails,
  HotspotStatus,
  hotspotStatusList,
} from '../models/Hotspot';
import { getFormattedAddress, Location } from '../models/Location';
import { User } from '../models/User';
import { Region, RootStackParamList, RootStackScreenProps } from '../types';
import SnackbarManager from '../utils/SnackbarManager';
import { isSmallScreen } from '../utils/helperFunc';
import { deleteHotspot, formatHotspotAddress } from '../utils/hotspots';

const getStyles = (theme: NucaCustomTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    modalWrapperStyle: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalWrapperContainerStyle: {
      shadowOffset: {
        width: 0,
        height: 0,
      },
    },
    form: {
      padding: 20,
      width: isSmallScreen() ? '100%' : '80%',
    },
    screenTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    screenTitleIcon: {
      fontSize: 28,
      fontFamily: 'Nunito_700Bold',
      color: theme.colors.text,
    },
    screenTitleLabel: {
      fontSize: 18,
      marginStart: 8,
      textAlignVertical: 'bottom',
      fontFamily: 'Nunito_700Bold',
      color: theme.colors.text,
    },
    screenTitleLabelTitle: {
      marginStart: 8,
      textAlignVertical: 'bottom',
      fontFamily: 'Nunito_700Bold',
      color: theme.colors.text,
    },
    locationButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationButtonIcon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
      tintColor: theme.colors.text,
    },
    locationButtonLabel: {
      fontSize: 12,
      marginStart: 4,
      fontFamily: 'Nunito_700Bold',
      color: theme.colors.text,
    },
    locationButtonsContainer: {
      marginTop: 30,
      flexDirection: 'row',
    },
    leftLocationButtonContainer: {
      width: '50%',
      flexDirection: 'row',
    },
    rightLocationButtonContainer: {
      justifyContent: 'flex-end',
      width: '50%',
      flexDirection: 'row',
    },
    inputField: {
      marginTop: 20,
    },
    textInputTitle: {
      color: theme.colors.text,
      fontSize: 12,
      marginTop: 20,
      fontFamily: 'Nunito_700Bold',
      textTransform: 'uppercase',
    },
    catsCountContainer: {
      flexDirection: 'row',
      marginTop: 20,
    },
    catsCountLeftItem: {
      width: '50%',
      paddingEnd: 10,
    },
    catsCountRightItem: {
      width: '50%',
      paddingStart: 10,
    },
    catCategoriesContainer: {
      flexDirection: 'row',
      paddingTop: 24,
      paddingBottom: 24,
      alignItems: 'center',
    },
    catCategoryTitleIcon: {
      backgroundColor: theme.colors.text,
    },
    catCategoryTitleLabel: {
      fontSize: 18,
      fontFamily: 'Nunito_700Bold',
      color: theme.colors.text,
      marginStart: 8,
    },
    catCategoryAddButton: {
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      position: 'absolute',
      margin: 1,
      right: 0,
    },
    saveButton: {
      height: 64,
      maxWidth: 340,
      minWidth: isSmallScreen() ? 64 : 340,
    },
    deleteButton: {
      height: 64,
      backgroundColor: theme.colors.surface,
      color: 'black',
      minWidth: isSmallScreen() ? 64 : 340,
      maxWidth: 340,
      marginRight: isSmallScreen() ? 0 : 12,
      marginBottom: 10,
    },
    saveButtonContent: {
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row-reverse',
    },
    saveButtonLabel: {
      color: theme.colors.background,
      fontSize: 18,
      fontFamily: 'Nunito_700Bold',
    },
    snackLabel: {
      color: theme.colors.background,
      fontSize: 16,
      fontFamily: 'Nunito_700Bold',
    },
    deleteButtonLabel: {
      color: theme.colors.text,
      fontSize: 18,
      fontFamily: 'Nunito_700Bold',
    },
    catLadyImage: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
    dropdownButton: {
      width: '100%',
      borderRadius: theme.roundness,
      height: 60,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor: theme.colors.disabled,
      marginTop: 5,
    },
    dropdownText: {
      fontSize: 15,
      textAlign: 'left',
      paddingHorizontal: 20,
      fontFamily: 'Nunito_400Regular',
      color: theme.colors.text,
    },
    statusDropdown: {
      borderRadius: theme.roundness,
    },
    statusDropdownButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
    },
    statusButtonText: {
      fontSize: 15,
      textAlign: 'left',
      justifyContent: 'center',
      paddingHorizontal: 8,
      fontFamily: 'Nunito_400Regular',
      color: theme.colors.text,
    },
    statusRow: {
      borderTopWidth: 0.2,
      color: theme.colors.text,
    },
    statusRowText: {
      textAlign: 'left',
      justifyContent: 'center',
      paddingHorizontal: 18,
      paddingVertical: 18,
      fontSize: 15,
      fontFamily: 'Nunito_400Regular',
    },
    arrowIcon: {
      alignItems: 'center',
      marginRight: 25,
      marginTop: '50%',
    },
    imageView: {
      marginTop: 32,
    },
    image: {
      paddingTop: 12,
      height: 375,
      minHeight: 430,
      flex: 1,
      width: undefined,
    },
    addressTitle: {
      fontSize: 18,
      fontFamily: 'Nunito_700Bold',
      lineHeight: 26,
      flexShrink: 1,
      marginRight: 20,
    },
    volunteerDropdownButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
    },
    volunteerDropdownButton: {
      width: '100%',
      borderRadius: theme.roundness,
      height: 60,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor: theme.colors.disabled,
      paddingLeft: 10,
    },
    separator: {
      borderColor: theme.colors.disabled,
      borderWidth: 0.7,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      height: 4,
      marginBottom: 16,
      marginTop: 16,
    },
  });

export const HotspotFormScreen = ({
  route,
}: RootStackScreenProps<'AddHotspot'>) => {
  const { hotspots, setHotspots } = useContext(MapContext);
  const [isInProgress, setIsInProgress] = useState(false);
  const [numberOfInvalidInputsInForm, setNumberOfInvalidInputsInForm] =
    useState(0);
  const [isConfirmationModalVisible, setConfirmationModalVisibility] =
    useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const theme = useTheme();
  const styles = getStyles(theme);

  const isUpdate = route.params.isUpdate;
  const location = route.params.location;

  const { hotspotDetails } = useContext(HotspotContext);
  const [temporaryHotspotDetails, setTemporaryHotspotDetails] =
    useState<HotspotDetails>(hotspotDetails);

  const hideConfirmationModalAndExit = () => {
    setConfirmationModalVisibility(false);
    navigation.goBack();
  };
  const dismissConfirmationModal = () => setConfirmationModalVisibility(false);
  const showConfirmationModal = () => {
    setConfirmationModalVisibility(true);
    return true;
  };

  const initializeTemporaryHotspotDetails = () =>
    setTemporaryHotspotDetails(
      !isUpdate ? defaultHotspotDetails : hotspotDetails
    );

  useEffect(() => {
    initializeTemporaryHotspotDetails();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      showConfirmationModal
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (location)
      setTemporaryHotspotDetails({
        ...temporaryHotspotDetails,
        city: location.city || '',
        zip: location.postalCode || '',
        address:
          (location.street || ' ') + ' ' + (location.streetNumber || ' '),
        latitude: location.latitude,
        longitude: location.longitude,
      });
  }, [location]);

  const deleteH = async () => {
    setIsInProgress(true);
    const { success } = await deleteHotspot(hotspotDetails.id);

    if (success) {
      setIsInProgress(false);
      SnackbarManager.success('Ștergere reuşită');

      setHotspots(hotspots.filter((h: Hotspot) => h.id !== hotspotDetails.id));
      navigation.navigate('Main');
    } else {
      setIsInProgress(false);
      SnackbarManager.error(
        'HotspotFormScreen - delete func.',
        'Ștergere nereuşită, verifică dacă ai sters profilele pisicilor asociate zonei de interes'
      );
    }
  };

  const address = formatHotspotAddress(hotspotDetails, true);

  const save = useHotspotSave({
    hotspotToBeSaved: temporaryHotspotDetails,
    shouldUpdate: isUpdate,
    location,
    setIsInProgress,
  });

  const saveAndNavigateToDetailScreen = async () => {
    if (numberOfInvalidInputsInForm) {
      isConfirmationModalVisible && dismissConfirmationModal();
      SnackbarManager.error(
        'HotspotFormScreen - save func.',
        'Formularul este încă invalid. Verifică dacă datele introduse corespund restricțiilor menționate.'
      );
      return;
    }

    const { hotspot: newHotspot } = await save();
    !isUpdate
      ? navigation.replace('HotspotDetail', { hotspotId: newHotspot!.id })
      : navigation.navigate('HotspotDetail', { hotspotId: newHotspot!.id });
  };

  return (
    <>
      <NucaModal
        leftButtonHandler={hideConfirmationModalAndExit}
        rightButtonHandler={saveAndNavigateToDetailScreen}
        leftButtonMessage={'Renunță'}
        rightButtonMessage={'Salvează'}
        leftButtonIcon={'cancel'}
        rightButtonIcon={'pencil'}
        caption={
          'Ești sigur că vrei să ieși? Modificările tale nu vor fi salvate.'
        }
        visible={isConfirmationModalVisible}
        onDismiss={dismissConfirmationModal}
      />
      <Appbar forDetailScreen showConfirmationModal={showConfirmationModal} />
      <View style={styles.container}>
        <ScrollView>
          <View
            style={{
              alignItems: 'center',
            }}
          >
            <View style={styles.form}>
              {!isUpdate ? (
                <AddLocation
                  routeLocation={route.params.location}
                  routeRegion={route.params.region}
                />
              ) : (
                <Title style={styles.addressTitle}>{address}</Title>
              )}
              <InputField
                label="Detalii adresă"
                placeholder="Nume"
                inputFieldStyle={{ marginTop: 54 }}
                value={temporaryHotspotDetails.description}
                onTextInputChangeText={text =>
                  setTemporaryHotspotDetails({
                    ...temporaryHotspotDetails,
                    description: text,
                  })
                }
                maximumLength={
                  maximumAddressDetailsLength +
                  allowedNumberOfCharactersOverLimit
                }
                onTextInputValidateText={(text: string) =>
                  text.length <= maximumAddressDetailsLength
                }
                invalidValueErrorMessage={`Detaliile adresei trebuie să nu depășească ${maximumAddressDetailsLength} de caractere.`}
                infoMessage={`Maxim ${maximumAddressDetailsLength} de caractere`}
                onInvalidInput={() =>
                  setNumberOfInvalidInputsInForm(
                    numberOfInvalidInputsInForm + 1
                  )
                }
                onValidInput={() =>
                  setNumberOfInvalidInputsInForm(
                    numberOfInvalidInputsInForm > 0
                      ? numberOfInvalidInputsInForm - 1
                      : 0
                  )
                }
              />
              <Caption style={styles.textInputTitle}>STATUS</Caption>
              <SelectDropdown
                data={hotspotStatusList}
                defaultValue={temporaryHotspotDetails.status}
                renderButton={(selectedItem: any, isOpened: boolean) => (
                  <View style={styles.statusDropdownButtonContainer}>
                    <View style={styles.dropdownButton}>
                      <Text style={styles.dropdownText}>
                        {capitalize(selectedItem)}
                      </Text>
                    </View>
                    <TextInput.Icon
                      icon={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={theme.colors.text}
                      style={styles.arrowIcon}
                      pointerEvents="none"
                    />
                  </View>
                )}
                renderItem={(item, _index, _isSelected) => (
                  <View style={styles.statusRow}>
                    <Text style={styles.statusRowText}>{capitalize(item)}</Text>
                  </View>
                )}
                dropdownStyle={styles.statusDropdown}
                onSelect={(selectedItem: HotspotStatus) =>
                  setTemporaryHotspotDetails({
                    ...temporaryHotspotDetails,
                    status: selectedItem,
                  })
                }
              />
              <InputField
                multiline={true}
                label="Observații"
                placeholder="Scrie aici"
                inputFieldStyle={styles.inputField}
                textInputStyle={{ height: 100 }}
                value={temporaryHotspotDetails.notes}
                onTextInputChangeText={text =>
                  setTemporaryHotspotDetails({
                    ...temporaryHotspotDetails,
                    notes: text,
                  })
                }
                maximumLength={
                  maximumNotesLength + allowedNumberOfCharactersOverLimit
                }
                onTextInputValidateText={(text: string) =>
                  text.length <= maximumNotesLength
                }
                invalidValueErrorMessage={`Observațiile trebuie să nu depășească ${maximumNotesLength} de caractere.`}
                infoMessage={`Maxim ${maximumNotesLength} de caractere`}
                onInvalidInput={() =>
                  setNumberOfInvalidInputsInForm(
                    numberOfInvalidInputsInForm + 1
                  )
                }
                onValidInput={() =>
                  setNumberOfInvalidInputsInForm(
                    numberOfInvalidInputsInForm > 0
                      ? numberOfInvalidInputsInForm - 1
                      : 0
                  )
                }
              />
              <InputField
                label="Persoana de contact"
                placeholder="Nume persoana de contact"
                inputFieldStyle={styles.inputField}
                value={temporaryHotspotDetails.contactName}
                onTextInputChangeText={text =>
                  setTemporaryHotspotDetails({
                    ...temporaryHotspotDetails,
                    contactName: text,
                  })
                }
                maximumLength={
                  maximumKeyContactIndividualNameLength +
                  allowedNumberOfCharactersOverLimit
                }
                onTextInputValidateText={(text: string) =>
                  text.length <= maximumKeyContactIndividualNameLength
                }
                invalidValueErrorMessage={`Numele persoanei de contact trebuie să nu depășească ${maximumKeyContactIndividualNameLength} de caractere.`}
                onInvalidInput={() =>
                  setNumberOfInvalidInputsInForm(
                    numberOfInvalidInputsInForm + 1
                  )
                }
                onValidInput={() =>
                  setNumberOfInvalidInputsInForm(
                    numberOfInvalidInputsInForm > 0
                      ? numberOfInvalidInputsInForm - 1
                      : 0
                  )
                }
              />
              <InputField
                label="Telefon persoana de contact"
                placeholder="numar de telefon"
                keyboardType="phone-pad"
                inputFieldStyle={styles.inputField}
                value={temporaryHotspotDetails.contactPhone}
                onTextInputChangeText={text =>
                  setTemporaryHotspotDetails({
                    ...temporaryHotspotDetails,
                    contactPhone: text,
                  })
                }
                maximumLength={maximumPhoneNumberInputLength}
                onTextInputValidateText={(text: string) =>
                  text.length <= maximumPhoneNumberInputLength &&
                  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
                    text
                  )
                }
                invalidValueErrorMessage="Numǎrul de telefon al persoanei de contact trebuie sǎ fie valid."
                onInvalidInput={() =>
                  setNumberOfInvalidInputsInForm(
                    numberOfInvalidInputsInForm + 1
                  )
                }
                onValidInput={() =>
                  setNumberOfInvalidInputsInForm(
                    numberOfInvalidInputsInForm > 0
                      ? numberOfInvalidInputsInForm - 1
                      : 0
                  )
                }
              />
              <Caption style={styles.textInputTitle}>VOLUNTAR</Caption>
              <VolunteerDropdown
                volunteer={hotspotDetails.volunteer}
                onSelect={(selectedVolunteer?: User) =>
                  setTemporaryHotspotDetails({
                    ...temporaryHotspotDetails,
                    volunteer: selectedVolunteer,
                  })
                }
              />
              <View style={styles.separator} />
              <View
                style={{
                  justifyContent: 'flex-end',
                  flexDirection: isSmallScreen() ? 'column' : 'row',
                  marginTop: 54,
                }}
              >
                {isUpdate && (
                  <Button
                    uppercase={false}
                    style={styles.deleteButton}
                    contentStyle={styles.saveButtonContent}
                    labelStyle={styles.deleteButtonLabel}
                    icon="close"
                    mode="contained"
                    onPress={deleteH}
                  >
                    Șterge adresa
                  </Button>
                )}
                <Button
                  uppercase={false}
                  style={styles.saveButton}
                  contentStyle={styles.saveButtonContent}
                  labelStyle={styles.saveButtonLabel}
                  icon="check"
                  mode="contained"
                  onPress={saveAndNavigateToDetailScreen}
                >
                  Salvează
                </Button>
              </View>
            </View>
          </View>
          <FooterView
            screen={FooterScreens.HotspotFormScreen}
            isUpdate={isUpdate}
          />
        </ScrollView>
      </View>
      {isInProgress && <FullScreenActivityIndicator />}
    </>
  );
};

const AddLocation = ({
  routeLocation,
  routeRegion,
}: {
  routeLocation?: Location;
  routeRegion: Region;
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const navigation = useNavigation();
  const [location, setLocation] = useState<Location>();

  const onMapRateLimitExceeded = () => {
    SnackbarManager.error(
      'HotspotFormScreen',
      'A apărut o problemă, așteptați câteva momente și încercați din nou.'
    );
  };

  useEffect(() => {
    setLocation(routeLocation);
  }, [routeLocation]);

  return (
    <>
      <View style={styles.screenTitleContainer}>
        <Headline style={styles.screenTitleIcon}>+</Headline>
        <Caption style={styles.screenTitleLabel}>
          Adaugă zonă de interes
        </Caption>
      </View>

      <InputField
        placeholder="Adresă"
        multiline={true}
        maximumLength={maximumAddressDetailsLength}
        inputFieldStyle={{ marginTop: 30 }}
        value={location && getFormattedAddress(location)}
        editable={false}
      />

      <View style={styles.locationButtonsContainer}>
        <View style={styles.leftLocationButtonContainer}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() =>
              navigation.navigate('ChooseLocation', {
                location,
                region: routeRegion,
              })
            }
          >
            <Image style={styles.locationButtonIcon} source={mapPinIcon} />
            <Caption style={styles.locationButtonLabel}>ALEGE PE HARTĂ</Caption>
          </TouchableOpacity>
        </View>

        <View style={styles.rightLocationButtonContainer}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={async () => {
              const currentLocation = await findCurrentLocation(
                onMapRateLimitExceeded
              );
              if (currentLocation) setLocation(currentLocation);
            }}
          >
            <Image
              style={styles.locationButtonIcon}
              source={currentLocationIcon}
            />
            <Caption style={styles.locationButtonLabel}>LOCAȚIA MEA</Caption>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
