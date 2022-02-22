import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Caption, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import catLady3 from '../assets/cat-lady3.png';
import { Hotspot, HotspotStatus } from '../models/Hotspot';
import { RootStackParamList } from '../types';

const imageAspectRatio = 1080 / 872;
const scaledWidth = Dimensions.get('window').width;
const scaledHeight = scaledWidth / imageAspectRatio;

const getStyles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      opacity: 0.9,
      width: '100%',
      height: '100%',
    },
    separator: {
      borderColor: theme.colors.disabled,
      borderWidth: 0.7,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      height: 4,
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
      marginBottom: 24,
    },
    imageView: {
      height: Dimensions.get('window').height * 0.4,
      marginTop: 32,
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
    statusView: {
      paddingTop: 14,
      paddingBottom: 14,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.roundness,
      height: 100,
      flex: 1,
      margin: 5,
      marginLeft: 0,
    },
    statusText: {
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: 'Nunito_700Bold',
      textTransform: 'uppercase',
      textAlign: 'center',
      flexWrap: 'wrap',
    },
    informationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    informationView: {
      paddingTop: 14,
      paddingBottom: 14,
      backgroundColor: theme.colors.onSurface,
      alignItems: 'center',
      borderRadius: theme.roundness,
      height: 100,
      flex: 1,
      margin: 5,
      justifyContent: 'space-between',
      flexDirection: 'column',
    },
    informationTitle: {
      color: theme.colors.notification,
      fontSize: 12,
      fontFamily: 'Nunito_700Bold',
      textAlign: 'center',
      flexWrap: 'wrap',
      textTransform: 'uppercase',
    },
    informationSubtitle: {
      color: theme.colors.text,
      fontSize: 14,
      fontFamily: 'Nunito_700Bold',
      textAlign: 'center',
    },
    addressContainer: { flexDirection: 'row', paddingTop: 18 },
    addressView: { width: '60%', justifyContent: 'flex-start' },
    editView: { width: '40%', justifyContent: 'flex-start' },
    contentCotainer: { padding: 20 },
  });

export const HotspotDetailScreen = ({
  route,
}: NativeStackScreenProps<RootStackParamList, 'HotspotDetail'>) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const hotspot = route.params.hotspot;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentCotainer}>
          <View style={styles.addressContainer}>
            <View style={styles.addressView}>
              <Caption style={styles.addressTitle}>
                Aleea Bârsei 3 Cluj-Napoca, 400605
              </Caption>
            </View>
            <View style={styles.editView}>
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
          <Caption style={styles.subTitle}>
            Aleea Bârsei 3, în spatele blocului
          </Caption>
          <View style={styles.separator} />
          <Caption style={styles.notes}>
            Observatii: {hotspot.description}
          </Caption>
          <View style={styles.informationContainer}>
            <StatusView {...hotspot}></StatusView>
            <InforamtionView
              title={'pisici \nnesterilizate'}
              subTitle={'2'}
            ></InforamtionView>
            <InforamtionView
              title={'pisici sterilizate'}
              subTitle={'0'}
            ></InforamtionView>
          </View>
          <View style={styles.informationContainer}>
            <InforamtionView
              title={'Contact'}
              subTitle={'Ion Iliescu \n 0784354312'}
            ></InforamtionView>
            <InforamtionView
              title={'Voluntar'}
              subTitle={'Vadim \n 0746784323'}
            ></InforamtionView>
          </View>
          <View style={styles.catCategoryContainer}>
            <Avatar.Icon
              size={24}
              icon="close"
              color={theme.colors.background}
              style={styles.catCategoryTitleIcon}
            />
            <Caption style={styles.catCategoryTitleLabel}>
              Pisici nesterilizate
            </Caption>
          </View>
          <View style={styles.separator} />
          <View style={styles.catCategoryContainer}>
            <Avatar.Icon
              size={24}
              icon="check"
              color={theme.colors.background}
              style={styles.catCategoryTitleIcon}
            />
            <Caption style={styles.catCategoryTitleLabel}>
              Pisici sterilizate
            </Caption>
          </View>
        </View>
        <View style={styles.imageView}>
          <Image source={catLady3} style={styles.image} resizeMode="contain" />
        </View>
      </ScrollView>
    </View>
  );
};

const StatusView = (props: Hotspot) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const getColor = ({ status }: Hotspot) => {
    if (status === HotspotStatus.done) return '#01B961';
    if (status === HotspotStatus.inProgress) return theme.colors.backdrop;
    return theme.colors.error;
  };

  return (
    <View style={[styles.statusView, { backgroundColor: getColor(props) }]}>
      <Caption style={styles.statusText}>{props.status}</Caption>
    </View>
  );
};

interface InformationProps {
  readonly title: string;
  readonly subTitle: string;
}

const InforamtionView = (props: InformationProps) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.informationView}>
      <Caption style={styles.informationTitle}>{props.title}</Caption>
      <Caption style={styles.informationSubtitle}>{props.subTitle}</Caption>
    </View>
  );
};
