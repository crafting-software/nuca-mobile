import { capitalize } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Avatar,
  Button,
  Caption,
  FAB,
  Headline,
  TextInput,
  Title,
  useTheme,
} from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation } from '@react-navigation/native';
import currentLocationIcon from '../assets/current-location.png';
import mapPinIcon from '../assets/map-pin.png';
import { Appbar } from '../components/Appbar';
import { FooterScreens, FooterView } from '../components/Footer';
import { FullScreenActivityIndicator } from '../components/FullScreenActivityIndicator';
import { InputField } from '../components/InputField';
import { findCurrentLocation, MapContext } from '../context';
import { HotspotContext } from '../context/HotspotDetailContext';
import {
  Cat,
  defaultSterilizedCat,
  defaultUnSterilizedCat,
} from '../models/Cat';
import {
  defaultHotspotDetails,
  Hotspot,
  HotspotDetails,
  HotspotStatus,
  hotspotStatusList,
} from '../models/Hotspot';
import { getFormattedAddress, Location } from '../models/Location';
import { User } from '../models/User';
import { Region, RootStackScreenProps } from '../types';
import SnackbarManager from '../utils/SnackbarManager';
import { addCat, deleteCatRequest } from '../utils/cats';
import { isSmallScreen } from '../utils/helperFunc';
import { addHotspot, deleteHotspot, updateHotspot } from '../utils/hotspots';
import { loadUsers } from '../utils/users';
import { CatsView } from './HotspotDetailScreen';

const getStyles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
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
      width: 40,
      height: 40,
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
      borderWidth: 1,
      borderColor: theme.colors.disabled,
      marginTop: 5,
    },
    dropdownText: {
      fontSize: 15,
      textAlign: 'left',
      paddingHorizontal: 8,
      fontFamily: 'Nunito_400Regular',
      color: theme.colors.text,
    },
    statusDropdown: {
      borderRadius: theme.roundness,
    },
    statusRowText: {
      textAlign: 'left',
      paddingHorizontal: 18,
      fontSize: 15,
      fontFamily: 'Nunito_400Regular',
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
  const navigation = useNavigation();

  const theme = useTheme();
  const styles = getStyles(theme);

  const [users, setUsers] = useState<User[]>([]);
  const isUpdate = route.params.isUpdate;
  const location = route.params.location;

  const { hotspotDetails, setHotspotDetails } = useContext(HotspotContext);

  const [newSterilizedCats, setNewSterilizedCats] = useState<Cat[]>([]);
  const [newUnsterilizedCat, setNewUnsterilizedCat] = useState<Cat[]>([]);

  useEffect(() => {
    if (!isUpdate) setHotspotDetails(defaultHotspotDetails);
    const load = async () => {
      const { success, users } = await loadUsers();
      if (!success) alert('Failed to load users');
      setUsers(users);
    };
    load();
  }, []);

  useEffect(() => {
    if (location)
      setHotspotDetails({
        ...hotspotDetails,
        city: location.city || '',
        zip: location.postalCode || '',
        address: location.street + ' ' + location.streetNumber,
        latitude: location.latitude,
        longitude: location.longitude,
      });
  }, [location]);

  const save = async (): Promise<{
    hotspot?: HotspotDetails;
  }> => {
    if (!location && !isUpdate) {
      SnackbarManager.error(
        'HotspotFormScreen - save func',
        'Locatia lipseste'
      );
      return { hotspot: undefined };
    }
    const submitFunc = isUpdate ? updateHotspot : addHotspot;

    setIsInProgress(true);

    const { success, hotspotDetails: newHotspot } = await submitFunc(
      hotspotDetails
    );

    if (success) {
      const newHostpots = [
        ...hotspots.filter((h: Hotspot) => h.id !== newHotspot!.id),
        newHotspot!,
      ];
      setHotspotDetails(newHotspot!);
      setHotspots(newHostpots);
      setIsInProgress(false);
      SnackbarManager.success(
        isUpdate ? 'Editare reuşită' : 'Adăugare reuşită'
      );
      navigation.goBack();
      return { hotspot: newHotspot };
    } else {
      setIsInProgress(false);

      SnackbarManager.error(
        'HotspotFormScreen - save func.',
        isUpdate ? 'Editare nereuşită' : 'Adăugare nereuşită'
      );
      return { hotspot: undefined };
    }
  };

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

  const deleteCat = async (cat: Cat) => {
    if (
      !hotspotDetails.sterilizedCats.includes(cat) &&
      !hotspotDetails.unsterilizedCats.includes(cat)
    ) {
      cat.isSterilized ? setNewSterilizedCats([]) : setNewUnsterilizedCat([]);
      return;
    }
    setIsInProgress(true);
    const { success } = await deleteCatRequest(cat.id);

    if (success) {
      setIsInProgress(false);
      SnackbarManager.success('Cat deleted!');

      const unsterilizedCats = hotspotDetails.unsterilizedCats.filter(
        (c: Cat) => c.id !== cat.id
      );
      const sterilizedCats = hotspotDetails.sterilizedCats.filter(
        (c: Cat) => c.id !== cat.id
      );

      setHotspotDetails({
        ...hotspotDetails,
        unsterilizedCats: unsterilizedCats,
        sterilizedCats: sterilizedCats,
      });
    } else {
      setIsInProgress(false);
      SnackbarManager.error(
        'HotspotFormScreen - deleteCat func.',
        'Cat not deleted'
      );
    }
  };

  const addNewCat = async (newCat: Cat) => {
    if (hotspotDetails.id === undefined || hotspotDetails.id === '') {
      const hotspot = await save();
      if (hotspot.hotspot) {
        saveNewCat(newCat, hotspot.hotspot.id);
      }
    } else {
      saveNewCat(newCat, hotspotDetails.id);
      setIsInProgress(true);
    }
  };

  const saveNewCat = async (newCat: Cat, hotspotId: string) => {
    const { success, cat } = await addCat(newCat, hotspotId);

    if (success) {
      setIsInProgress(false);

      SnackbarManager.success('Adaugare reuşită');

      if (cat?.isSterilized) {
        setNewSterilizedCats([]);
        setHotspotDetails({
          ...hotspotDetails,
          sterilizedCats: [cat!, ...hotspotDetails.sterilizedCats],
        });
      } else {
        setNewUnsterilizedCat([]);
        setHotspotDetails({
          ...hotspotDetails,
          unsterilizedCats: [cat!, ...hotspotDetails.unsterilizedCats],
        });
      }
    } else {
      setIsInProgress(false);
      SnackbarManager.error(
        'HotspotFormScreen - addNewCat func.',
        'Adaugare nereuşită'
      );
    }
  };

  return (
    <>
      <Appbar forDetailScreen />
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
                <Title style={styles.addressTitle}>
                  {`${hotspotDetails.address} ${hotspotDetails.city}, ${hotspotDetails.zip}, ${hotspotDetails.latitude}`}
                </Title>
              )}
              <InputField
                label="Detalii adresă"
                placeholder="Nume"
                inputFieldStyle={{ marginTop: 54 }}
                value={hotspotDetails.description}
                onTextInputChangeText={text =>
                  setHotspotDetails({ ...hotspotDetails, description: text })
                }
              />
              <Caption style={styles.textInputTitle}>STATUS</Caption>
              <SelectDropdown
                defaultButtonText="Alege status"
                data={hotspotStatusList}
                buttonStyle={styles.dropdownButton}
                buttonTextStyle={styles.dropdownText}
                dropdownStyle={styles.statusDropdown}
                rowTextStyle={styles.statusRowText}
                dropdownIconPosition="right"
                renderDropdownIcon={(_selectedItem, _index) => (
                  <TextInput.Icon
                    name="chevron-down"
                    color={theme.colors.text}
                    style={{ marginRight: 40 }}
                  />
                )}
                onSelect={(selectedItem: HotspotStatus) =>
                  setHotspotDetails({ ...hotspotDetails, status: selectedItem })
                }
                buttonTextAfterSelection={(selectedItem: HotspotStatus) =>
                  capitalize(selectedItem as HotspotStatus)
                }
                rowTextForSelection={(item: HotspotStatus) =>
                  capitalize(item as HotspotStatus)
                }
                defaultValue={hotspotDetails.status}
              />
              <InputField
                multiline={true}
                label="Observații"
                placeholder="Scrie aici"
                inputFieldStyle={styles.inputField}
                textInputStyle={{ height: 100 }}
                value={hotspotDetails.notes}
                onTextInputChangeText={text =>
                  setHotspotDetails({ ...hotspotDetails, notes: text })
                }
              />
              <InputField
                label="Pisici nesterilizate"
                placeholder="0"
                keyboardType="number-pad"
                value={String(hotspotDetails.unsterilizedCatsCount || 0)}
                onTextInputChangeText={text =>
                  setHotspotDetails({
                    ...hotspotDetails,
                    unsterilizedCatsCount: Number(text),
                  })
                }
              />
              <InputField
                label="Persoana de contact"
                placeholder="Nume persoana de contact"
                inputFieldStyle={styles.inputField}
                value={hotspotDetails.contactName}
                onTextInputChangeText={text =>
                  setHotspotDetails({ ...hotspotDetails, contactName: text })
                }
              />
              <InputField
                label="Telefon persoana de contact"
                placeholder="numar de telefon"
                keyboardType="phone-pad"
                inputFieldStyle={styles.inputField}
                value={hotspotDetails.contactPhone}
                onTextInputChangeText={text =>
                  setHotspotDetails({ ...hotspotDetails, contactPhone: text })
                }
              />
              <Caption style={styles.textInputTitle}>VOLUNTAR</Caption>
              <SelectDropdown
                defaultButtonText={
                  hotspotDetails.volunteer?.name || 'Alege voluntar'
                }
                data={users}
                buttonStyle={styles.dropdownButton}
                buttonTextStyle={styles.dropdownText}
                dropdownStyle={styles.statusDropdown}
                rowTextStyle={styles.statusRowText}
                dropdownIconPosition="right"
                renderDropdownIcon={() => (
                  <TextInput.Icon
                    name="chevron-down"
                    color={theme.colors.text}
                    style={{ marginRight: 40 }}
                  />
                )}
                onSelect={(user: User) =>
                  setHotspotDetails({ ...hotspotDetails, volunteer: user })
                }
                rowTextForSelection={(user: User) => user.name}
                buttonTextAfterSelection={(user: User) => user.name}
              />
              <View style={styles.separator} />
              <View style={styles.catCategoriesContainer}>
                <Avatar.Icon
                  size={24}
                  icon="close"
                  color={theme.colors.background}
                  style={styles.catCategoryTitleIcon}
                />

                <Caption style={styles.catCategoryTitleLabel}>
                  Pisici nesterilizate
                </Caption>
                <FAB
                  color={theme.colors.background}
                  icon="plus"
                  style={styles.catCategoryAddButton}
                  small
                  onPress={() => {
                    setNewUnsterilizedCat([defaultUnSterilizedCat]);
                  }}
                />
              </View>
              <CatsView
                cats={newUnsterilizedCat.concat(
                  hotspotDetails.unsterilizedCats
                )}
                isEditMode={true}
                deleteFunction={deleteCat}
                addNewCat={addNewCat}
              />
              <View style={styles.separator} />
              <View style={styles.catCategoriesContainer}>
                <Avatar.Icon
                  size={24}
                  icon="check"
                  color={theme.colors.background}
                  style={styles.catCategoryTitleIcon}
                />
                <Caption style={styles.catCategoryTitleLabel}>
                  Pisici sterilizate
                </Caption>
                <FAB
                  color={theme.colors.background}
                  icon="plus"
                  style={styles.catCategoryAddButton}
                  small
                  onPress={() => {
                    setNewSterilizedCats([defaultSterilizedCat]);
                  }}
                />
              </View>
              <CatsView
                cats={newSterilizedCats.concat(hotspotDetails.sterilizedCats)}
                isEditMode={true}
                deleteFunction={deleteCat}
                addNewCat={addNewCat}
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
                  onPress={save}
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
              const currentLocation = await findCurrentLocation();
              setLocation(currentLocation);
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
