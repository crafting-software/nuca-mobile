import { capitalize } from 'lodash';
import { StyleSheet, View } from 'react-native';
import { Button, Caption, Card, TextInput, useTheme } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { InputField } from './InputField';

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
    textInputTitle: {
      color: theme.colors.text,
      fontSize: 12,
      marginTop: 20,
      fontFamily: 'Nunito_700Bold',
      textTransform: 'uppercase',
    },
  });

export const AddCatCard = ({
  isEditingMode = false,
}: {
  isEditingMode: boolean;
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Card style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.titleRow}>
          {isEditingMode ? (
            <Button
              uppercase={false}
              contentStyle={styles.buttonContent}
              labelStyle={styles.titleLabel}
              icon="pencil"
            >
              Editează
            </Button>
          ) : (
            <Button
              uppercase={false}
              contentStyle={styles.buttonContent}
              labelStyle={styles.titleLabel}
              icon="plus"
            >
              Adaugă
            </Button>
          )}
        </View>
        <Caption style={styles.textInputTitle}>Sex</Caption>
        <SelectDropdown
          data={['M', 'F']}
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
          onSelect={(selectedItem: string, _index) => {
            console.log(selectedItem);
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
          value={''}
          onTextInputChangeText={text => {}}
        />
        <Caption style={styles.textInputTitle}>Adaugă poze/video</Caption>
      </View>
      <Button
        style={styles.saveButton}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        icon="check"
      >
        Salvează
      </Button>
    </Card>
  );
};
