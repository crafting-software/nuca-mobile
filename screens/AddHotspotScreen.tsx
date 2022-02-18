import { capitalize } from 'lodash';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Avatar,
  Button,
  Divider,
  FAB,
  TextInput,
  useTheme,
} from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import catLadyImage from '../assets/cat-lady2.png';
import currentLocationIcon from '../assets/current-location.png';
import mapPinIcon from '../assets/map-pin.png';
import { Appbar } from '../components/Appbar';
import { InputField } from '../components/InputField';
import { HotspotStatus } from '../models/Hotspot';
import { Location } from '../models/Location';

('react-native-paper-dropdown');

const getStyles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: 'white',
      height: '100%',
      width: '100%',
    },
    form: {
      padding: 20,
    },
    screenTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    screenTitleIcon: {
      fontSize: 30,
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
    textInput: {
      fontSize: 15,
      fontFamily: 'Nunito_400Regular',
      backgroundColor: 'white',
      height: 60,
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: theme.roundness,
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
    divider: {
      backgroundColor: theme.colors.disabled,
      height: 1,
      opacity: 0.9,
    },
    catCategoriesContainer: {
      flexDirection: 'row',
      marginTop: 47,
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
      marginTop: 100,
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
    catLadyImage: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
    statusButton: {
      width: '100%',
      borderRadius: theme.roundness,
      height: 60,
      backgroundColor: 'white',
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
  });

export const AddHotspotScreen = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [location, setLocation] = useState<Location>();
  const [status, setStatus] = useState<HotspotStatus>();
  const [showStatusDropDown, setShowStatusDropDown] = useState(false);

  const statusList: HotspotStatus[] = [
    HotspotStatus.toDo,
    HotspotStatus.inProgress,
    HotspotStatus.done,
  ];

  return (
    <View style={styles.container}>
      <Appbar />
      <ScrollView style={styles.container}>
        <>
          <View style={styles.form}>
            <View style={styles.screenTitleContainer}>
              <Text style={styles.screenTitleIcon}>+</Text>
              <Text style={styles.screenTitleLabel}>
                Adaugă zonă de interes
              </Text>
            </View>

            <InputField
              placeholder="Caută"
              rightIcon={
                <TextInput.Icon
                  name="magnify"
                  color={theme.colors.text}
                  style={{
                    marginTop: 15,
                  }}
                />
              }
              inputFieldStyle={{ marginTop: 30 }}
            />

            <View style={styles.locationButtonsContainer}>
              <View style={styles.leftLocationButtonContainer}>
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={() => alert('Alege locatia pe harta')}
                >
                  <Image
                    style={styles.locationButtonIcon}
                    source={mapPinIcon}
                  />
                  <Text style={styles.locationButtonLabel}>ALEGE PE HARTĂ</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.rightLocationButtonContainer}>
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={() => alert('Gaseste-mi locatia curenta')}
                >
                  <Image
                    style={styles.locationButtonIcon}
                    source={currentLocationIcon}
                  />
                  <Text style={styles.locationButtonLabel}>LOCAȚIA MEA</Text>
                </TouchableOpacity>
              </View>
            </View>

            <InputField
              label="Nume"
              placeholder="Nume"
              inputFieldStyle={{ marginTop: 70 }}
            />

            <Text style={styles.textInputTitle}>STATUS</Text>
            <SelectDropdown
              defaultButtonText="Alege status"
              data={statusList}
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
              onSelect={(selectedItem, _index) => {
                setStatus(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, _index) =>
                capitalize(selectedItem as HotspotStatus)
              }
              rowTextForSelection={(item, _index) =>
                capitalize(item as HotspotStatus)
              }
            />

            <InputField
              multiline={true}
              label="Observații"
              placeholder="Scrie aici"
              inputFieldStyle={styles.inputField}
              textInputStyle={{ height: 100 }}
            />

            <View style={styles.catsCountContainer}>
              <View style={styles.catsCountLeftItem}>
                <InputField
                  label="Pisici nesterilizate"
                  placeholder="0"
                  editable={false}
                />
              </View>
              <View style={styles.catsCountRightItem}>
                <InputField
                  label="Pisici sterilizate"
                  placeholder="0"
                  editable={false}
                />
              </View>
            </View>

            <InputField
              label="Persoana de contact"
              placeholder="Nume persoana de contact"
              inputFieldStyle={styles.inputField}
            />

            <InputField
              label="Telefon persoana de contact"
              placeholder="Telefon persoana de contact"
              keyboardType="phone-pad"
              inputFieldStyle={styles.inputField}
            />

            <InputField
              label="Voluntar"
              placeholder="Voluntar"
              inputFieldStyle={styles.inputField}
            />

            <Divider style={[styles.divider, { marginTop: 54 }]} />
            <Divider style={[styles.divider, { marginTop: 1 }]} />

            <View style={styles.catCategoriesContainer}>
              <Avatar.Icon
                size={24}
                icon="close"
                color={theme.colors.background}
                style={styles.catCategoryTitleIcon}
              />

              <Text style={styles.catCategoryTitleLabel}>
                Pisici nesterilizate
              </Text>

              <FAB
                color={theme.colors.background}
                icon="plus"
                style={styles.catCategoryAddButton}
                small
                onPress={() => alert('add unsterilized cat')}
              />
            </View>

            <Divider style={[styles.divider, { marginTop: 54 }]} />
            <Divider style={[styles.divider, { marginTop: 1 }]} />

            <View style={styles.catCategoriesContainer}>
              <Avatar.Icon
                size={24}
                icon="check"
                color={theme.colors.background}
                style={styles.catCategoryTitleIcon}
              />

              <Text style={styles.catCategoryTitleLabel}>
                Pisici sterilizate
              </Text>

              <FAB
                color={theme.colors.background}
                icon="plus"
                style={styles.catCategoryAddButton}
                small
                onPress={() => alert('add sterilized cat')}
              />
            </View>

            <Button
              uppercase={false}
              style={styles.saveButton}
              contentStyle={styles.saveButtonContent}
              labelStyle={styles.saveButtonLabel}
              icon="check"
              mode="contained"
              onPress={() => alert('save')}
            >
              Salvează
            </Button>
          </View>

          <View
            style={{
              height: Dimensions.get('window').height * 0.4,
              maxHeight: Dimensions.get('window').height * 0.4,
            }}
          >
            <Image
              style={styles.catLadyImage}
              source={catLadyImage}
              resizeMode="contain"
            />
          </View>
        </>
      </ScrollView>
    </View>
  );
};
