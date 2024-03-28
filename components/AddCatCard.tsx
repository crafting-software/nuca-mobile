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
  Modal,
  Portal,
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
import { HotspotContext } from '../context/HotspotDetailContext';
import { useNucaTheme as useTheme } from '../hooks/useNucaTheme';
import { Cat, defaultSterilizedCat, defaultUnSterilizedCat } from '../models/Cat';
import { User } from '../models/User';
import SnackbarManager from '../utils/SnackbarManager';
import { updateCat } from '../utils/cats';
import { loadUsers } from '../utils/users';
import { DeleteModal } from './DeleteModal';
import { InputField } from './InputField';

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
  index,
  addCat,
  deleteCat,
  saveChanges,
  isCatSterilized
}: {
  isEditingMode?: boolean;
  index: number;
  // addCat?: () => void;
  addCat?: (cat: Cat) => void;
  deleteCat?: (cat: Cat) => void;
  saveChanges?: () => void;
  isCatSterilized: boolean;
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const { 
    hotspotDetails, 
    newSterilizedCats,
    newUnsterilizedCats,
    shouldCatDetailsBeSaved,
    setHotspotDetails,
    setNewSterilizedCats,
    setNewUnsterilizedCats,
    setShouldCatDetailsBeSaved
  } = useContext(HotspotContext);
  const [users, setUsers] = useState<User[]>([]);
  const [checked, setChecked] = React.useState(isCatSterilized);
  // const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const cat = isCatSterilized
    ? !addCat && hotspotDetails.sterilizedCats.at(index) || defaultSterilizedCat
    : !addCat && hotspotDetails.unsterilizedCats.at(index) || defaultUnSterilizedCat;

  // useEffect(() => {
  //   cat?.isSterilized && console.log(`AddCatCard.tsx --> cat index: ${index}; cat: `, cat);
  // }, [cat]);

  useEffect(() => {
    const load = async () => {
      const { success, users } = await loadUsers();
      if (!success) alert('Failed to load users');
      setUsers(users);
    };
    load();
  }, []); 

  // this function is used to actually edit the cat
  const saveCat = async () => {
    saveChanges && saveChanges();
    setShouldCatDetailsBeSaved(true);
    cat?.isSterilized && console.log(`AddCatCard.tsx --> cat index: ${index}; cat: `, cat);

    if (!isEditingMode) {
      addCat && addCat(cat);
      return;
    }

    const { success, cat: updatedCat } = await updateCat(
      checked
        ? {
            ...cat!,
            isSterilized: checked,
          }
        : cat!
    );

    if (!success || !updatedCat)
      return;

    SnackbarManager.success('Cat updated!');

    cat?.isSterilized && console.log("AddCatCard.tsx --> isEditingMode");

    if (checked) {
      setHotspotDetails(prev => ({
        ...prev,
        // sterilizedCats: hotspotDetails.sterilizedCats.map( 
        //   (x, catIndex) => catIndex === index ? updatedCat : x 
        // ),
        sterilizedCats: [updatedCat, ...hotspotDetails.sterilizedCats],
        unsterilizedCats: hotspotDetails.unsterilizedCats.filter(
          (c: Cat) => c.id !== updatedCat.id
        ),
      }));
      return;
    }

    const catList = updatedCat.isSterilized
      ? hotspotDetails.sterilizedCats
      : hotspotDetails.unsterilizedCats;
    const catIndex = index;
    catList[catIndex] = updatedCat;
    
    setHotspotDetails(prev => ({
      ...prev,
      ...(
        updatedCat.isSterilized
          ? {sterilizedCats: catList}
          : {unsterilizedCats: catList}
      )
    }));
  };

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const deleteC = () => {
    if (
      cat &&
      !hotspotDetails.sterilizedCats.includes(cat) &&
      !hotspotDetails.unsterilizedCats.includes(cat)
    ) {
      if (deleteCat) deleteCat(cat);
      return;
    }
    showModal();
  };

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

  const modifyCat = (newCat: Cat) => {
    const setNewContext = !cat.isSterilized ? setNewUnsterilizedCats : setNewSterilizedCats; 

    if (cat.isNew) {
      // This could cause an issue in the future, in case we would like to 
      // add multiple new cards (because it does not take into account the 
      // potentially fixed ordering of the new cat cards)
      // const newCats = !cat.isSterilized ? newUnsterilizedCats : newSterilizedCats;
      setNewContext([newCat]);
      return;
    }

    const oldCats = !cat.isSterilized ? hotspotDetails.unsterilizedCats : hotspotDetails.sterilizedCats;
    const updatedCats = 
      oldCats.map((cat: Cat, catIndex: number) => 
        catIndex === index ? newCat : cat
      );

    setHotspotDetails(
      cat.isSterilized
        ? {...hotspotDetails, ...{sterilizedCats: updatedCats}}
        : {...hotspotDetails, ...{unsterilizedCats: updatedCats}}
    );
  }

  const prepareMedia = (imageInfo: ImagePicker.ImagePickerAsset) => {
    const formattedFile = {
      file: imageInfo.uri,
      type: imageInfo.mimeType,
      name: imageInfo.fileName,
    };

    modifyCat({
      ...cat, 
      media: cat.media.concat(formattedFile as Record<string, string>),
    });
  };

  const removeImage = (uri: string) => {
    modifyCat({
      ...cat, 
      media: cat.media.filter(item => ![item.file, item.url].includes(uri))
    });
  };

  return (
    <Card style={styles.mainContainer}>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
          <DeleteModal
            cat={cat!}
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
        {isEditingMode && !cat?.isSterilized && (
          <View style={styles.checkboxView}>
            <Caption style={styles.textInputTitle}>
              am sterilizat pisica
            </Caption>
            <View style={styles.checkbox}>
              <Checkbox
                color={theme.colors.text}
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => setChecked(!checked)}
              />
            </View>
          </View>
        )}
        <Caption style={styles.textInputTitle}>Sex</Caption>
        <SelectDropdown
          data={['M', 'F']}
          defaultValue={cat?.sex}
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
            modifyCat({
              ...cat,
              sex: selectedValue,
            });
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
          value={cat?.notes}
          onTextInputChangeText={text => {
            modifyCat({
              ...cat,
              notes: text,
            });
          }}
        />
        {(cat?.isSterilized || checked) && (
          <>
            <View style={styles.pickerContainer}>
              <View style={styles.datePickerContainer}>
                <Caption style={styles.textInputTitle}>Dată internare</Caption>
                <DatePickerInput
                  locale="en"
                  value={new Date(cat!.checkInDate)}
                  onChange={selectedDate => {
                    if (selectedDate) {
                      modifyCat({
                        ...cat,
                        checkInDate: Date.parse(selectedDate.toDateString()),
                      });
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
                  value={new Date(cat!.checkOutDate)}
                  onChange={selectedDate => {
                    if (selectedDate) {
                      if (
                        new Date(selectedDate) < new Date(cat!.checkInDate)
                      ) {
                        SnackbarManager.error(
                          'AddCatCard - checkout date less than checkin',
                          "Checkout date can't be earlier than checkin date"
                        );
                      } else {
                        modifyCat({
                          ...cat,
                          checkOutDate: Date.parse(selectedDate.toDateString()),
                        });
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
              defaultButtonText={cat!.capturedBy?.name || 'Alege voluntar'}
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
                modifyCat({ ...cat, capturedBy: selectedVolunteer })
              }
              rowTextForSelection={(user: User) => user.name}
              buttonTextAfterSelection={(user: User) => user.name}
              defaultValue={cat!.capturedBy?.name}
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
              data={cat!.media}
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
