import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Avatar, Button, useTheme } from 'react-native-paper';
import catLady3 from '../assets/cat-lady3.png';

const imageAspectRatio = 1080 / 872;
const scaledWidth = Dimensions.get('window').width;
const scaledHeight = scaledWidth / imageAspectRatio;

const getStyles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    container: {
      marginTop: 30,
      borderTopLeftRadius: theme.roundness,
      borderTopRightRadius: theme.roundness,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      width: '100%',
      height: '100%',
    },
    separator: {
      borderColor: theme.colors.disabled,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      height: 3,
      marginBottom: 16,
      marginTop: 16,
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
      paddingBottom: 8,
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
    catCategoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 12,
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
    scrollView: {
      width: '100%',
      height: '1000%',
    },
  });

export default function ModalScreen() {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <>
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
            <Text style={styles.subTitle}>
              Aleea Bârsei 3, în spatele blocului
            </Text>
            <View style={styles.separator} />
            <Text style={styles.notes}>
              Observatii: Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Morbi non sem egestas, cursus lorem bibendum, facilisis
              lorem.
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 24,
              }}
            >
              <View
                style={{
                  padding: 14,
                  // paddingLeft: 12,
                  // paddingRight: 6,
                  backgroundColor: theme.colors.backdrop,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: theme.roundness,
                  height: 100,
                  flex: 1,
                  margin: 5,
                  marginLeft: 0,
                  width: 50,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.text,
                    fontSize: 12,
                    fontFamily: 'Nunito_700Bold',
                  }}
                >
                  IN LUCRU
                </Text>
              </View>
              <View
                style={{
                  padding: 14,
                  backgroundColor: theme.colors.onSurface,
                  // justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: theme.roundness,
                  height: 100,
                  flex: 1,
                  margin: 5,
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                }}
              >
                <Text
                  style={{
                    color: theme.colors.notification,
                    fontSize: 12,
                    fontFamily: 'Nunito_700Bold',
                    textAlign: 'center',
                    flexWrap: 'wrap',
                    textTransform: 'uppercase',
                  }}
                >
                  pisici sterilizate
                </Text>
                <Text
                  style={{
                    color: theme.colors.text,
                    fontSize: 20,
                    fontFamily: 'Nunito_700Bold',
                    textAlign: 'center',
                    flexWrap: 'wrap',
                    textTransform: 'uppercase',
                  }}
                >
                  2{' '}
                </Text>
              </View>
              <View
                style={{
                  padding: 14,
                  backgroundColor: theme.colors.onSurface,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: theme.roundness,
                  height: 100,
                  flex: 1,
                  margin: 5,
                  marginRight: 0,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.notification,
                    fontSize: 12,
                    fontFamily: 'Nunito_700Bold',
                    textAlign: 'center',
                    flexWrap: 'wrap',
                    textTransform: 'uppercase',
                  }}
                >
                  {'pisici \nnesterilizate'}
                </Text>
              </View>
            </View>
            <View style={styles.catCategoryContainer}>
              <Avatar.Icon
                size={24}
                icon="close"
                color={theme.colors.background}
                style={styles.catCategoryTitleIcon}
              />
              <Text style={styles.catCategoryTitleLabel}>
                Pisici nesterilizate
              </Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.catCategoryContainer}>
              <Avatar.Icon
                size={24}
                icon="check"
                color={theme.colors.background}
                style={styles.catCategoryTitleIcon}
              />
              <Text style={styles.catCategoryTitleLabel}>
                Pisici sterilizate
              </Text>
            </View>
          </View>
          <View
            style={{
              height: Dimensions.get('window').height * 0.4,
            }}
          >
            <Image
              source={catLady3}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </>
      </ScrollView>
    </View>
  );
}
