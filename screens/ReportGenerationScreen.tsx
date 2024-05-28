import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Caption, Headline, Icon } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Appbar } from '../components/Appbar';
import { FooterScreens, FooterView } from '../components/Footer';
import { FullScreenActivityIndicator } from '../components/FullScreenActivityIndicator';
import { useNucaTheme as useTheme } from '../hooks/useNucaTheme';
import { RootStackParamList } from '../types';
import { isSmallScreen } from '../utils/helperFunc';

const getStyles = (theme: NucaCustomTheme) =>
  StyleSheet.create({
    saveButton: {
      height: 64,
      maxWidth: 340,
      minWidth: isSmallScreen() ? 64 : 340,
    },
    saveButtonContent: {
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row-reverse',
    },
    saveButtonLabel: {
      fontSize: 18,
      marginStart: 8,
      textAlignVertical: 'bottom',
      fontFamily: 'Nunito_700Bold',
      color: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    scrollView: {
      width: '100%',
      height: '1000%',
    },
    contentContainer: {
      alignItems: 'stretch',
      padding: 20,
      width: isSmallScreen() ? '100%' : '85%',
      marginLeft: isSmallScreen() ? 0 : '7.5%',
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
      padding: 4,
    },
    textInputTitle: {
      color: theme.colors.text,
      fontSize: 12,
      marginTop: 20,
      fontFamily: 'Nunito_700Bold',
      textTransform: 'uppercase',
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 12,
    },
  });

export const ReportGenerationScreen = (
  _params: NativeStackScreenProps<RootStackParamList, 'ReportGeneration'>
) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [isInProgress, _setIsInProgress] = useState(false);

  return (
    <>
      <Appbar forDetailScreen />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            <View style={styles.screenTitleContainer}>
              <View style={styles.titleRow}>
                <Headline style={styles.screenTitleIcon}>
                  <View>
                    <Icon source={'file-document-outline'} size={22} />
                  </View>
                </Headline>
                <Caption style={styles.screenTitleLabel}>
                  Generează raport
                </Caption>
              </View>
            </View>

            <View style={styles.pickerContainer}>
              <View style={styles.datePickerContainer}>
                <Caption style={styles.textInputTitle}>De la</Caption>
                <DatePickerInput
                  locale="en"
                  value={new Date()}
                  onChange={_selectedDate => {}}
                  mode="outlined"
                  inputMode="start"
                  withDateFormatInLabel={false}
                  outlineColor={theme.colors.disabled}
                />
              </View>
              <View style={styles.datePickerContainer}>
                <Caption style={styles.textInputTitle}>Până la</Caption>
                <DatePickerInput
                  locale="en"
                  value={new Date()}
                  onChange={_selectedDate => {}}
                  mode="outlined"
                  inputMode="start"
                  withDateFormatInLabel={false}
                  outlineColor={theme.colors.disabled}
                />
              </View>
            </View>

            <View
              style={{
                justifyContent: 'flex-end',
                flexDirection: isSmallScreen() ? 'column' : 'row',
                marginTop: 54,
              }}
            >
              <Button
                uppercase={false}
                style={styles.saveButton}
                contentStyle={styles.saveButtonContent}
                labelStyle={styles.saveButtonLabel}
                icon="file-document-outline"
                mode="contained"
                onPress={() => {}}
              >
                Generează raport
              </Button>
            </View>
          </View>
          <FooterView screen={FooterScreens.ReportGenerationScreen} />
        </ScrollView>
      </View>
      {isInProgress && <FullScreenActivityIndicator />}
    </>
  );
};
