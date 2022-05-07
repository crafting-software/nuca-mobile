import { capitalize } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Caption, Card, TextInput, useTheme } from 'react-native-paper';
import {
  DatePickerInput,
  en,
  registerTranslation,
} from 'react-native-paper-dates';
import SelectDropdown from 'react-native-select-dropdown';
import imagePlaceholder from '../assets/image-placeholder.png';
import { Cat } from '../models/Cat';
import { User } from '../models/User';
import { loadUsers } from '../utils/users';
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
    },
    media: {
      width: 64,
      height: 64,
      borderRadius: 15,
      marginRight: 8,
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
  });

export const AddCatCard = ({
  isEditingMode = false,
  cat,
}: {
  isEditingMode: boolean;
  cat?: Cat;
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [users, setUsers] = useState<User[]>([]);
  const defaultCat: Cat = {
    id: 'place',
    sex: 'F',
    notes: '',
    checkInDate: new Date().getTime() / 1000,
    checkOutDate: new Date().getTime() / 1000,
    isSterilized: true,
    capturedBy: undefined,
    media: {},
  };
  const [localCat, setCat] = useState<Cat>(cat || defaultCat);

  useEffect(() => {
    const load = async () => {
      const { success, users } = await loadUsers();
      if (!success) alert('Failed to load users');
      setUsers(users);
    };
    load();
  }, []);

  return (
    <Card style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.titleRow}>
          {isEditingMode ? (
            <>
              <Caption style={styles.title}>Editează</Caption>
              <Button
                icon="pencil"
                color={theme.colors.text}
                onPress={() => console.log('Pressed')}
              >
                <></>
              </Button>
            </>
          ) : (
            <>
              <Caption style={styles.title}>Adaugă</Caption>
              <Button
                icon="plus"
                color={theme.colors.text}
                onPress={() => console.log('Pressed')}
              >
                <></>
              </Button>
            </>
          )}
        </View>
        <Caption style={styles.textInputTitle}>Sex</Caption>
        <SelectDropdown
          data={['M', 'F']}
          defaultValue={localCat?.sex}
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
          value={localCat?.notes}
          onTextInputChangeText={text => {
            setCat(prev => ({
              ...prev,
              notes: text,
            }));
          }}
        />
        {cat && cat!.isSterilized && (
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
                      setCat(prev => ({
                        ...prev,
                        checkInDate: selectedDate.getTime() / 1000,
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
                      setCat(prev => ({
                        ...prev,
                        checkOutDate: selectedDate.getTime() / 1000,
                      }));
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
        <View style={{ paddingTop: 8 }}>
          <Image style={styles.media} source={imagePlaceholder} />
        </View>
      </View>
      <Button
        style={styles.saveButton}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        icon="check"
        onPress={() => alert('Should Save modified localCat')}
      >
        Salvează
      </Button>
    </Card>
  );
};
