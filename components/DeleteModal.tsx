import { StyleSheet, View } from 'react-native';
import { Button, Caption, Card, useTheme } from 'react-native-paper';
import { Cat } from '../models/Cat';

const getModalStyles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    title: {
      marginVertical: 38,
      textAlign: 'center',
      color: theme.colors.text,
      fontSize: 16,
      lineHeight: 22,
      fontFamily: 'Nunito_700Bold',
      paddingLeft: 8,
    },
    discardButton: {
      height: 66,
      width: '100%',
      backgroundColor: theme.colors.surface,
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
      width: '49.5%',
      alignItems: 'center',
    },
    buttonContent: {
      height: 66,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row-reverse',
    },
    buttonLabel: {
      color: theme.colors.text,
      fontSize: 14,
    },
    mainContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardStyle: {
      marginHorizontal: 20,
      backgroundColor: 'white',
      maxWidth: 400,
      width: '100%',
    },
    actionView: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });

export const DeleteModal = ({
  cat,
  hideModal,
  deleteCat,
}: {
  cat: Cat;
  hideModal: () => void;
  deleteCat?: (cat: Cat) => void;
}) => {
  const theme = useTheme();
  const styles = getModalStyles(theme);

  return (
    <View style={styles.mainContainer}>
      <Card style={styles.cardStyle}>
        <Caption style={styles.title}>Ești sigur că vrei să ștergi?</Caption>
        <View style={styles.actionView}>
          <View style={styles.buttonView}>
            <Button
              style={styles.discardButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              icon="pencil"
              onPress={() => hideModal()}
            >
              Renunță
            </Button>
          </View>
          <View style={styles.buttonView}>
            <Button
              style={styles.deleteButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              icon="close"
              onPress={() => {
                deleteCat && deleteCat(cat);
              }}
            >
              Șterge
            </Button>
          </View>
        </View>
      </Card>
    </View>
  );
};
