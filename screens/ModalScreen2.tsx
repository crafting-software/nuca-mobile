import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';

const imageAspectRatio = 1080 / 872;
const scaledWidth = Dimensions.get('window').width;
const scaledHeight = scaledWidth / imageAspectRatio;

const getStyles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      borderTopLeftRadius: theme.roundness,
      borderTopRightRadius: theme.roundness,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      // backgroundColor: 'red',
    },
    separator: {
      borderColor: theme.colors.disabled,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      height: 5,
    },
    addressTitle: {
      fontSize: 18,
      fontFamily: 'Nunito_700Bold',
      letterSpacing: 0.2,
      textAlign: 'left',
    },
    subTitle: {
      fontFamily: 'Nunito_400Regular',
      fontSize: 15,
      color: theme.colors.placeholder,
      paddingTop: 11,
      paddingBottom: 21,
    },
    button: {
      width: '100%',
    },
    buttonContent: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row-reverse',
      padding: 8,
    },
    buttonLabel: {
      color: theme.colors.background,
      fontSize: 16,
      fontFamily: 'Nunito_700Bold',
    },
    notes: {
      paddingTop: 12,
      color: theme.colors.placeholder,
      fontFamily: 'Nunito_400Regular',
      fontSize: 16,
    },
    image: {
      width: '100%',
      maxHeight: scaledHeight,
      position: 'absolute',
      bottom: 0,
    },
    containerContent: { flex: 1, marginTop: 40 },
    containerHeader: {
      flex: 1,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
      backgroundColor: '#F1F1F1',
    },
    headerContent: {
      marginTop: 0,
    },
    Modal: {
      backgroundColor: '#005252',
      marginTop: 0,
    },
  });

export const ModalScreen2 = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  let [ShowComment, setShowModelComment] = useState(false);
  let [animateModal, setanimateModal] = useState(false);

  return (
    <SwipeUpDownModal
      modalVisible={ShowComment}
      PressToanimate={animateModal}
      //if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
      ContentModal={<View style={styles.containerContent}></View>}
      HeaderStyle={styles.headerContent}
      ContentModalStyle={styles.Modal}
      HeaderContent={
        <View style={styles.containerHeader}>
          <Button
            onPress={() => {
              setanimateModal(true);
            }}
          >
            Press Me
          </Button>
        </View>
      }
      onClose={() => {
        // setModelComment(false);
        setanimateModal(false);
      }}
    />
  );
};
