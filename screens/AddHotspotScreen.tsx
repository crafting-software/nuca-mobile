import { capitalize } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Region } from 'react-native-maps';
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
import catLadyImage from '../assets/cat-lady2.png';
import catLady4 from '../assets/cat-lady4.png';
import currentLocationIcon from '../assets/current-location.png';
import mapPinIcon from '../assets/map-pin.png';
import { Appbar } from '../components/Appbar';
import { InputField } from '../components/InputField';
import { findCurrentLocation } from '../context/MapContext';
import {
  HotspotDetails,
  HotspotStatus,
  hotspotStatusList,
} from '../models/Hotspot';
import { getFormattedAddress, Location } from '../models/Location';
import { User } from '../models/User';
import { RootStackScreenProps } from '../types';
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
      marginTop: 54,
    },
    deleteButton: {
      height: 64,
      backgroundColor: theme.colors.surface,
      color: 'black',
      marginTop: 10,
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
    deleteButtonLabel: {
      color: theme.colors.text,
      fontSize: 18,
      fontFamily: 'Nunito_700Bold',
    },
    catLadyImage: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
    statusButton: {
      width: '100%',
      borderRadius: theme.roundness,
      height: 60,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.disabled,
      marginTop: 5,
    },
    statusButtonText: {
      fontSize: 15,
      textAlign: 'left',
      paddingHorizontal: 8,
      fontFamily: 'Nunito_400Regular',
      color: theme.colors.text,
    },
    statusDropdown: {
      borderRadius: theme.roundness,
      width: 150,
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
      height: 375,
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

export const AddHotspotScreen = ({
  route,
}: RootStackScreenProps<'AddHotspot'>) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [users, setUsers] = useState<User[]>([]);
  const isUpdate = route.params.isUpdate;
  const [hotspotDetails, setHotspotDetails] = useState<
    HotspotDetails | undefined
  >(route.params.hotspotDetails);
  const [defaultHotspot, setDefaultHotspot] = useState<HotspotDetails>(
    isUpdate
      ? hotspotDetails!
      : {
          id: '',
          status: HotspotStatus.toDo,
          latitude: 0,
          longitude: 0,
          address: '',
          city: '',
          zip: '',
          details: '',
          notes: '',
          sterilizedCats: [],
          unsterilizedCats: [],
          unsterilizedCatsCount: 0,
          contactName: '',
          contactPhone: '',
        }
  );

  useEffect(() => {
    const load = async () => {
      const { success, users } = await loadUsers();
      if (!success) alert('Failed to load users');
      setUsers(users);
    };
    load();
  }, []);

  return (
    <>
      <Appbar forDetailScreen />
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.form}>
            {!isUpdate ? (
              <AddLocation
                routeLocation={route.params.location}
                routeRegion={route.params.region}
              />
            ) : (
              <Title style={styles.addressTitle}>
                {defaultHotspot?.address +
                  ' ' +
                  defaultHotspot?.city +
                  ', ' +
                  defaultHotspot?.zip}
              </Title>
            )}
            <InputField
              label="Detalii adresă"
              placeholder="Nume"
              inputFieldStyle={{ marginTop: 54 }}
              value={defaultHotspot?.details}
              onTextInputChangeText={text =>
                setDefaultHotspot(prev => ({ ...prev, details: text }))
              }
            />
            <Caption style={styles.textInputTitle}>STATUS</Caption>
            <SelectDropdown
              defaultButtonText="Alege status"
              data={hotspotStatusList}
              buttonStyle={styles.statusButton}
              buttonTextStyle={styles.statusButtonText}
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
              onSelect={(selectedItem: HotspotStatus, _index) => {
                setDefaultHotspot(prev => ({ ...prev, status: selectedItem }));
              }}
              buttonTextAfterSelection={(selectedItem: HotspotStatus, _index) =>
                capitalize(selectedItem as HotspotStatus)
              }
              rowTextForSelection={(item: HotspotStatus, _index) =>
                capitalize(item as HotspotStatus)
              }
              defaultValue={defaultHotspot.status}
            />
            <InputField
              multiline={true}
              label="Observații"
              placeholder="Scrie aici"
              inputFieldStyle={styles.inputField}
              textInputStyle={{ height: 100 }}
              value={defaultHotspot.notes}
              onTextInputChangeText={text =>
                setDefaultHotspot(prev => ({ ...prev, notes: text }))
              }
            />
            <InputField
              label="Pisici nesterilizate"
              placeholder="0"
              keyboardType="number-pad"
              value={String(defaultHotspot.unsterilizedCatsCount || 0)}
              onTextInputChangeText={text =>
                setDefaultHotspot(prev => ({
                  ...prev,
                  unsterilizedCatsCount: Number(text),
                }))
              }
            />
            <InputField
              label="Persoana de contact"
              placeholder="Nume persoana de contact"
              inputFieldStyle={styles.inputField}
              value={defaultHotspot.contactName}
              onTextInputChangeText={text =>
                setDefaultHotspot(prev => ({ ...prev, contactName: text }))
              }
            />
            <InputField
              label="Telefon persoana de contact"
              placeholder="Telefon persoana de contact"
              keyboardType="phone-pad"
              inputFieldStyle={styles.inputField}
              value={defaultHotspot.contactPhone}
              onTextInputChangeText={text =>
                setDefaultHotspot(prev => ({ ...prev, contactPhone: text }))
              }
            />
            <Caption style={styles.textInputTitle}>VOLUNTAR</Caption>
            <SelectDropdown
              defaultButtonText="Alege voluntar"
              data={users}
              buttonStyle={styles.statusButton}
              buttonTextStyle={styles.statusButtonText}
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
              onSelect={() => {}}
              buttonTextAfterSelection={(selectedItem: HotspotStatus, _index) =>
                capitalize(selectedItem as HotspotStatus)
              }
              rowTextForSelection={(item: HotspotStatus, _index) =>
                capitalize(item as HotspotStatus)
              }
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
                onPress={() => alert('add unsterilized cat')}
              />
            </View>
            {isUpdate && (
              <CatsView
                cats={defaultHotspot.unsterilizedCats}
                isEditMode={true}
              />
            )}
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
                onPress={() => alert('add sterilized cat')}
              />
            </View>
            {isUpdate && (
              <>
                <CatsView
                  cats={defaultHotspot.sterilizedCats}
                  isEditMode={true}
                />
                <View style={styles.separator} />
              </>
            )}
            <Button
              uppercase={false}
              style={styles.saveButton}
              contentStyle={styles.saveButtonContent}
              labelStyle={styles.saveButtonLabel}
              icon="check"
              mode="contained"
              onPress={() =>
                alert(
                  JSON.stringify({
                    name: defaultHotspot.address,
                  })
                )
              }
            >
              Salvează
            </Button>
            {isUpdate && (
              <Button
                uppercase={false}
                style={styles.deleteButton}
                contentStyle={styles.saveButtonContent}
                labelStyle={styles.deleteButtonLabel}
                icon="close"
                mode="contained"
                onPress={() => alert('Delete hotspot')}
              >
                Șterge adresa
              </Button>
            )}
          </View>
          <View style={styles.imageView}>
            <Image
              source={isUpdate ? catLady4 : catLadyImage}
              style={styles.image}
            />
          </View>
        </ScrollView>
      </View>
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
