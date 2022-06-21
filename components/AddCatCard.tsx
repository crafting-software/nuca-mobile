import * as ImagePicker from 'expo-image-picker';
import { capitalize } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { Image, ImagePickerResult, StyleSheet, View } from 'react-native';
import {
  Button,
  Caption,
  Card,
  Checkbox,
  Modal,
  Portal,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {
  DatePickerInput,
  en,
  registerTranslation,
} from 'react-native-paper-dates';
import SelectDropdown from 'react-native-select-dropdown';
import imagePlaceholder from '../assets/image-placeholder.png';
import { HotspotContext } from '../context/HotspotDetailContext';
import { Cat, defaultSterilizedCat } from '../models/Cat';
import { User } from '../models/User';
import SnackbarManager from '../utils/SnackbarManager';
import { updateCat } from '../utils/cats';
import { loadUsers } from '../utils/users';
import { DeleteModal } from './DeleteModal';
import { InputField } from './InputField';

registerTranslation('en', en);

const getStyles = (theme: ReactNativePaper.Theme) =>
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
    media: {
      width: 64,
      height: 64,
      borderRadius: 15,
    },
    saveButton: {
      height: 66,
      width: '100%',
      backgroundColor: theme.colors.accent,
      borderRadius: 0,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
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
      backgroundColor: theme.colors.background,
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
      // width: 32,
      // height: 32,
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

  useEffect(() => {
    const load = async () => {
      const { success, users } = await loadUsers();
      if (!success) alert('Failed to load users');
      setUsers(users);
    };
    load();
  }, []);

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
          catList[catIndex] = cat;
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

  const deleteC = () => {
    if (
      !hotspotDetails.sterilizedCats.includes(localCat) &&
      !hotspotDetails.unsterilizedCats.includes(localCat)
    ) {
      if (deleteCat) deleteCat(localCat);
      return;
    }
    showModal();
  };

  // let options = {
  //   title: 'Select Image',
  //   customButtons: [
  //     { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
  //   ],
  //   storageOptions: {
  //     skipBackup: true,
  //     path: 'images',
  //   },
  // };

  // ImagePicker.showImagePicker(options, response => {
  //   console.log('Response = ', response);

  //   if (response.didCancel) {
  //     console.log('User cancelled image picker');
  //   } else if (response.error) {
  //     console.log('ImagePicker Error: ', response.error);
  //   } else if (response.customButton) {
  //     console.log('User tapped custom button: ', response.customButton);
  //   } else {
  //     const source = { uri: response.uri };

  //     // You can also display the image using data:
  //     // const source = { uri: 'data:image/jpeg;base64,' + response.data };

  //     this.setState({
  //       filePath: response,
  //       fileData: response.data,
  //       fileUri: response.uri,
  //     });
  //   }
  // });

  // const chooseImage = async () => {
  //   let options = {
  //     title: 'Upload Prescription',
  //     takePhotoButtonTitle: 'Take a Photo',
  //     chooseFromLibraryButtonTitle: 'Select From Gallery',
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //   };
  //   let result =  ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   } );

  //     if (result.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //       alert(response.customButton);
  //     } else {
  //       const file = {
  //         uri: response.uri,
  //         name: response.fileName,
  //         type: 'image/jpeg',
  //       };
  //       // uploadImageOnS3(file);
  //     }
  //   });
  // };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result, result.uri);

    const file = {
      uri: result.uri,
      name: result.fileName,
      type: 'image/jpeg',
    };
    if (!result.cancelled) {
      // uploadImageOnS3(file);
    }
  };

  return (
    <Card style={styles.mainContainer}>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
          <DeleteModal
            cat={localCat}
            hideModal={hideModal}
            deleteCat={deleteCat}
          />
        </Modal>
      </Portal>
      <View style={styles.container}>
        <View style={styles.titleRow}>
          {isEditingMode ? (
            <>
              <Caption style={styles.title}>Editează</Caption>
              <Button
                icon="pencil"
                disabled
                labelStyle={{ color: theme.colors.text }}
              >
                <></>
              </Button>
            </>
          ) : (
            <>
              <Caption style={styles.title}>Adaugă</Caption>
              <Button
                icon="plus"
                disabled
                labelStyle={{ color: theme.colors.text }}
              >
                <></>
              </Button>
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
              name="chevron-down"
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
        />
        {(localCat.isSterilized || checked) && (
          <>
            <View style={styles.pickerContainer}>
              <View style={styles.datePickerContainer}>
                <Caption style={styles.textInputTitle}>Dată internare</Caption>
                <DatePickerInput
                  autoComplete={false}
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
                  autoComplete={false}
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
                  name="chevron-down"
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
        <View
          style={{
            paddingTop: 8,
            alignItems: 'flex-start',
          }}
        >
          <Button onPress={pickImage} style={{ height: 74 }}>
            <Image style={styles.media} source={imagePlaceholder} />
          </Button>
        </View>
      </View>
      <View style={{ flexDirection: 'row', paddingTop: 8 }}>
        <View style={styles.buttonView}>
          <Button
            style={styles.editButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="pencil"
            onPress={() => saveCat()}
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
            onPress={deleteC}
          >
            Șterge
          </Button>
        </View>
      </View>
    </Card>
  );
};
