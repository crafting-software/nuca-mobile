import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Caption, Headline, Icon } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Appbar } from '../components/Appbar';
import { FooterScreens, FooterView } from '../components/Footer';
import { FullScreenActivityIndicator } from '../components/FullScreenActivityIndicator';
import { NucaFormButton } from '../components/NucaFormButton';
import { useNucaTheme as useTheme } from '../hooks/useNucaTheme';
import { RootStackParamList } from '../types';
import SnackbarManager from '../utils/SnackbarManager';
import { isSmallScreen } from '../utils/helperFunc';
import { saveReportAsCsvFile } from '../utils/reports';

const getStyles = (theme: NucaCustomTheme) =>
  StyleSheet.create({
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
      height: '100%',
    },
    scrollViewContentContainer: {
      flexGrow: 1,
      justifyContent: 'flex-end',
    },
    contentContainer: {
      alignItems: 'stretch',
      padding: 20,
      width: isSmallScreen() ? '100%' : '85%',
      marginLeft: isSmallScreen() ? 0 : '7.5%',
      position: 'relative',
      zIndex: 1,
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
  const [checkInDate, setCheckInDate] = useState<Date>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date>(new Date());

  useEffect(() => {
    if (checkInDate <= checkOutDate) return;

    SnackbarManager.error(
      'ReportGenerationScreen.tsx',
      'Data de start a intervalului asociat cu raportul trebuie sǎ fie înaintea datei de sfârşit.'
    );
    setCheckInDate(checkOutDate);
  }, [checkInDate, checkOutDate]);

  return (
    <>
      <Appbar forDetailScreen />
      <View style={styles.container}>
        <ScrollView
          scrollEnabled={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
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
                  value={checkInDate}
                  onChange={selectedDate =>
                    setCheckInDate(selectedDate || new Date())
                  }
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
                  value={checkOutDate}
                  onChange={selectedDate =>
                    setCheckOutDate(selectedDate || new Date())
                  }
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
              <NucaFormButton
                label="Generează raport"
                backgroundColor={theme.colors.primary}
                labelColor={theme.colors.background}
                iconName="file-document-outline"
                onPress={async () => {
                  await saveReportAsCsvFile(
                    checkInDate,
                    checkOutDate,
                    'nuca_sterilized_cats_report'
                  );
                }}
              />
            </View>
          </View>
          <FooterView screen={FooterScreens.ReportGenerationScreen} />
        </ScrollView>
      </View>
      {isInProgress && <FullScreenActivityIndicator />}
    </>
  );
};
