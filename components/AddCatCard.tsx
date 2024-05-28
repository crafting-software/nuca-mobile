import * as ImagePicker from 'expo-image-picker';
import { capitalize } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Button,
  Caption,
  Card,
  Checkbox,
  Icon,
  IconButton,
  TextInput,
} from 'react-native-paper';
import {
  DatePickerInput,
  en,
  registerTranslation,
} from 'react-native-paper-dates';
import SelectDropdown from 'react-native-select-dropdown';
import imagePlaceholder from '../assets/image-placeholder.png';
import { isDevelopment, server } from '../config';
import {
  allowedNumberOfCharactersOverLimit,
  maximumAddCatCardDescriptionLength,
} from '../constants/inputLimits';
import { HotspotContext } from '../context/HotspotDetailContext';
import { useNucaTheme as useTheme } from '../hooks/useNucaTheme';
import { Cat, defaultSterilizedCat } from '../models/Cat';
import { User } from '../models/User';
import SnackbarManager from '../utils/SnackbarManager';
import { updateCat } from '../utils/cats';
import { loadUsersRequest } from '../utils/users';
import { InputField } from './InputField';
import { NucaModal } from './NucaModal';

registerTranslation('en', en);

const getStyles = (theme: NucaCustomTheme) =>
  StyleSheet.create({
    mainContainer: {
      width: '100%',
      backgroundColor: theme.colors.surface,
      borderRadius: 30,
      marginBottom: 10,
    },
    container: {
      padding: 20,
      paddingBottom: 16,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      paddingBottom: 12,
    },
    addMedia: {
      width: 64,
      height: 64,
      borderRadius: 15,
    },
    media: {
      width: 64,
      height: 64,
      borderRadius: 15,
      marginRight: 8,
      marginTop: 6,
    },
    buttonContent: {
      height: 66,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row-reverse',
    },
    buttonLabel: {
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: 'Nunito_700Bold',
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    titleLabel: {
      color: theme.colors.text,
      fontSize: 18,
      fontFamily: 'Nunito_700Bold',
    },
    inputField: {
      marginTop: 20,
    },
    genderButton: {
      width: '60%',
      borderRadius: theme.roundness,
      height: 60,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.disabled,
      marginTop: 5,
    },
    genderButtonText: {
      fontSize: 15,
      textAlign: 'left',
      paddingHorizontal: 8,
      fontFamily: 'Nunito_400Regular',
      color: theme.colors.text,
    },
    genderDropdown: {
      borderRadius: theme.roundness,
      width: 150,
    },
    genderRowText: {
      textAlign: 'left',
      paddingHorizontal: 18,
      fontSize: 15,
      fontFamily: 'Nunito_400Regular',
    },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontFamily: 'Nunito_700Bold',
    },
    textInputTitle: {
      color: theme.colors.text,
      fontSize: 12,
      marginTop: 20,
      fontFamily: 'Nunito_700Bold',
      textTransform: 'uppercase',
    },
    volunteerTitle: {
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: 'Nunito_700Bold',
      textTransform: 'uppercase',
    },
    dropdownButton: {
      width: '100%',
      borderRadius: theme.roundness,
      height: 60,
      backgroundColor: 'transparent',
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
    pickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    datePickerContainer: {
      width: '50%',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    editButton: {
      height: 66,
      width: '100%',
      backgroundColor: theme.colors.accent,
      borderRadius: 0,
      borderBottomLeftRadius: 30,
      marginRight: 4,
    },
    deleteButton: {
      backgroundColor: theme.colors.accent,
      height: 66,
      width: '100%',
      borderRadius: 0,
      borderBottomRightRadius: 30,
      textAlign: 'center',
      marginLeft: 4,
    },
    buttonView: {
      justifyContent: 'center',
      width: '50%',
      alignItems: 'center',
    },
    checkbox: {
      marginTop: 12,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: theme.colors.disabled,
    },
    checkboxView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#E8ECEE',
      marginHorizontal: -20,
      paddingHorizontal: 20,
      alignItems: 'center',
      paddingBottom: 12,
    },
    actionView: {
      flexDirection: 'row',
      paddingTop: 8,
    },
    imagesView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
    },
    deleteImageIcon: {
      position: 'absolute',
      right: -14,
      top: -14,
    },
    imageContainer: {
      maxWidth: '80%',
    },
  });

export const AddCatCard = ({
  isEditingMode = false,
  cat,
  addCat,
  deleteCat,
  saveChanges,
}: {
  isEditingMode?: boolean;
  cat?: Cat;
  addCat?: (cat: Cat) => void;
  deleteCat?: (cat: Cat) => void;
  saveChanges?: () => void;
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [users, setUsers] = useState<User[]>([]);
  const [localCat, setCat] = useState<Cat>(cat || defaultSterilizedCat);
  const { hotspotDetails, setHotspotDetails } = useContext(HotspotContext);
  const [checked, setChecked] = React.useState(false);
  const [numberOfInvalidInputsInForm, setNumberOfInvalidInputsInForm] =
    useState(0);
  // const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  useEffect(() => {
    const load = async () => {
      const { success, users } = await loadUsersRequest();
      if (!success) alert('Failed to load users');
      setUsers(users);
    };
    load();
  }, []);

  const deleteCatCallback = () =>
    deleteCat &&
    !hotspotDetails.sterilizedCats.includes(localCat) &&
    !hotspotDetails.unsterilizedCats.includes(localCat) &&
    deleteCat(localCat);

  const saveCat = async () => {
    if (saveChanges) saveChanges();
    if (isEditingMode) {
      const { success, cat } = await updateCat(
        checked
          ? {
              ...localCat,
              isSterilized: checked,
            }
          : localCat
      );
      if (success && cat) {
        SnackbarManager.success('Cat updated!');
        if (checked) {
          setHotspotDetails(prev => ({
            ...prev,
            sterilizedCats: [cat, ...hotspotDetails.sterilizedCats],
            unsterilizedCats: hotspotDetails.unsterilizedCats.filter(
              (c: Cat) => c.id !== cat.id
            ),
          }));
        } else {
          const catList = cat.isSterilized
            ? hotspotDetails.sterilizedCats
            : hotspotDetails.unsterilizedCats;
          const catIndex = catList.findIndex((c: Cat) => c.id === cat.id);
          catList[catIndex] = localCat;
          cat.isSterilized
            ? setHotspotDetails(prev => ({
                ...prev,
                sterilizedCats: catList,
              }))
            : setHotspotDetails(prev => ({
                ...prev,
                unsterilizedCats: catList,
              }));
        }
      }
    } else {
      if (addCat) addCat(localCat);
    }
  };

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const pickImage = async () => {
    const result: ImagePicker.ImagePickerResult =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    if (!result.canceled) {
      result.assets.forEach(prepareMedia);
    }
  };

  const prepareMedia = (imageInfo: ImagePicker.ImagePickerAsset) => {
    const formattedFile = {
      file: imageInfo.uri,
      type: imageInfo.mimeType,
      name: imageInfo.fileName,
    };
    setCat(prev => ({
      ...prev,
      media: prev.media.concat(formattedFile as Record<string, string>),
    }));
  };

  const removeImage = (uri: string) => {
    setCat(prev => ({
      ...prev,
      media: prev.media.filter(item => ![item.file, item.url].includes(uri)),
    }));
  };

  return (
    <Card style={styles.mainContainer}>
      <NucaModal
        leftButtonHandler={hideModal}
        rightButtonHandler={deleteCatCallback}
        leftButtonMessage={'Renunță'}
        rightButtonMessage={'Șterge'}
        leftButtonIcon={'cancel'}
        rightButtonIcon={'close'}
        caption={'Ești sigur că vrei să ștergi?'}
        visible={visible}
        onDismiss={hideModal}
      />
      <View style={styles.container}>
        <View style={styles.titleRow}>
          {isEditingMode ? (
            <>
              <Caption style={styles.title}>Editează</Caption>
              <View style={{ marginHorizontal: 16 }}>
                <Icon source={'pencil'} size={16} />
              </View>
            </>
          ) : (
            <>
              <Caption style={styles.title}>Adaugă</Caption>
              <View style={{ marginHorizontal: 16 }}>
                <Icon source={'plus'} size={16} />
              </View>
            </>
          )}
        </View>
        {isEditingMode && !localCat.isSterilized && (
          <View style={styles.checkboxView}>
            <Caption style={styles.textInputTitle}>
              am sterilizat pisica
            </Caption>
            <View style={styles.checkbox}>
              <Checkbox
                color={theme.colors.text}
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked(!checked);
                }}
              />
            </View>
          </View>
        )}
        <Caption style={styles.textInputTitle}>Sex</Caption>
        <SelectDropdown
          data={['M', 'F']}
          defaultValue={localCat.sex}
          buttonStyle={styles.genderButton}
          buttonTextStyle={styles.genderButtonText}
          dropdownStyle={styles.genderDropdown}
          rowTextStyle={styles.genderRowText}
          dropdownIconPosition="right"
          renderDropdownIcon={(_selectedItem, _index) => (
            <TextInput.Icon
              icon="chevron-down"
              color={theme.colors.text}
              style={{ marginRight: 40 }}
            />
          )}
          onSelect={selectedValue => {
            setCat(prev => ({
              ...prev,
              sex: selectedValue,
            }));
          }}
          buttonTextAfterSelection={(selectedItem: string, _index) =>
            capitalize(selectedItem)
          }
          rowTextForSelection={(item: string, _index) => capitalize(item)}
        />
        <InputField
          multiline={true}
          label="Observații"
          placeholder="Scrie aici"
          inputFieldStyle={styles.inputField}
          textInputStyle={{ height: 100 }}
          value={localCat.notes}
          onTextInputChangeText={text => {
            setCat((prev: Cat) => ({
              ...prev,
              notes: text,
            }));
          }}
          maximumLength={
            maximumAddCatCardDescriptionLength +
            allowedNumberOfCharactersOverLimit
          }
          onTextInputValidateText={(text: string) =>
            text.length <= maximumAddCatCardDescriptionLength
          }
          invalidValueErrorMessage={`Descrierea trebuie să nu depășească ${maximumAddCatCardDescriptionLength} de caractere.`}
          infoMessage={`Maxim ${maximumAddCatCardDescriptionLength} de caractere`}
          onInvalidInput={() =>
            setNumberOfInvalidInputsInForm(numberOfInvalidInputsInForm + 1)
          }
          onValidInput={() =>
            setNumberOfInvalidInputsInForm(
              numberOfInvalidInputsInForm > 0
                ? numberOfInvalidInputsInForm - 1
                : 0
            )
          }
        />
        {(localCat.isSterilized || checked) && (
          <>
            <View style={styles.pickerContainer}>
              <View style={styles.datePickerContainer}>
                <Caption style={styles.textInputTitle}>Dată internare</Caption>
                <DatePickerInput
                  locale="en"
                  value={new Date(localCat.checkInDate)}
                  onChange={selectedDate => {
                    if (selectedDate) {
                      setCat((prev: Cat) => ({
                        ...prev,
                        checkInDate: Date.parse(selectedDate.toDateString()),
                      }));
                    }
                  }}
                  mode="outlined"
                  inputMode="start"
                  withDateFormatInLabel={false}
                  outlineColor={theme.colors.disabled}
                />
              </View>
              <View style={styles.datePickerContainer}>
                <Caption style={styles.textInputTitle}>Dată externare</Caption>
                <DatePickerInput
                  locale="en"
                  value={new Date(localCat.checkOutDate)}
                  onChange={selectedDate => {
                    if (selectedDate) {
                      if (
                        new Date(selectedDate) < new Date(localCat.checkInDate)
                      ) {
                        SnackbarManager.error(
                          'AddCatCard - checkout date less than checkin',
                          "Checkout date can't be earlier than checkin date"
                        );
                      } else {
                        setCat((prev: Cat) => ({
                          ...prev,
                          checkOutDate: Date.parse(selectedDate.toDateString()),
                        }));
                      }
                    }
                  }}
                  mode="outlined"
                  inputMode="start"
                  withDateFormatInLabel={false}
                  outlineColor={theme.colors.disabled}
                />
              </View>
            </View>
            <Caption style={styles.volunteerTitle}>VOLUNTAR</Caption>
            <SelectDropdown
              defaultButtonText={localCat.capturedBy?.name || 'Alege voluntar'}
              data={users}
              buttonStyle={styles.dropdownButton}
              buttonTextStyle={styles.dropdownText}
              dropdownStyle={styles.statusDropdown}
              rowTextStyle={styles.statusRowText}
              dropdownIconPosition="right"
              renderDropdownIcon={() => (
                <TextInput.Icon
                  icon="chevron-down"
                  color={theme.colors.text}
                  style={{ marginRight: 40 }}
                />
              )}
              onSelect={selectedVolunteer =>
                setCat(prev => ({ ...prev, capturedBy: selectedVolunteer }))
              }
              rowTextForSelection={(user: User) => user.name}
              buttonTextAfterSelection={(user: User) => user.name}
              defaultValue={localCat.capturedBy?.name}
            />
          </>
        )}
        {!isEditingMode && (
          <Caption style={styles.textInputTitle}>Adaugă poze/video</Caption>
        )}
        <View style={styles.imagesView}>
          <View style={styles.imageContainer}>
            <FlatList
              horizontal
              data={localCat.media}
              keyExtractor={(_item, index) => index.toString()}
              renderItem={({ item }) => {
                const imageUri =
                  item?.file ||
                  (isDevelopment ? `${server}${item.url}` : item.url);
                return (
                  <View>
                    <Image style={styles.media} source={{ uri: imageUri }} />
                    <IconButton
                      icon="close-circle"
                      style={styles.deleteImageIcon}
                      onPress={() => removeImage(item.file || item.url)}
                    />
                  </View>
                );
              }}
            />
          </View>
          <TouchableOpacity onPress={pickImage}>
            <Image style={styles.addMedia} source={imagePlaceholder} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actionView}>
        <View style={styles.buttonView}>
          <Button
            style={styles.editButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="pencil"
            onPress={saveCat}
          >
            Salvează
          </Button>
        </View>
        <View style={styles.buttonView}>
          <Button
            style={styles.deleteButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="close"
            onPress={showModal}
          >
            Șterge
          </Button>
        </View>
      </View>
    </Card>
  );
};
