import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import catLady3 from '../assets/cat-lady3.png';

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
  });

export default function ModalScreen() {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', paddingTop: 18 }}>
          <View style={{ width: '60%', justifyContent: 'flex-start' }}>
            <Text style={styles.addressTitle}>
              Aleea Bârsei 3 Cluj-Napoca, 400605
            </Text>
          </View>
          <View style={{ width: '40%', justifyContent: 'flex-start' }}>
            <Button
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              icon="pencil-outline"
              mode="contained"
            >
              Editează
            </Button>
          </View>
        </View>
        <Text style={styles.subTitle}>Aleea Bârsei 3, în spatele blocului</Text>
        <View style={styles.separator} />
        <Text style={styles.notes}>
          Observatii: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Morbi non sem egestas, cursus lorem bibendum, facilisis lorem.
        </Text>
      </View>
      <Image source={catLady3} style={styles.image} resizeMode="contain" />
    </View>
  );
}
