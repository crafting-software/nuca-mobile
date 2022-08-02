import { trim } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Caption,
  IconButton,
  Title,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import catLady3 from '../assets/cat-lady3.png';
import { AddCatCard } from '../components/AddCatCard';
import { Appbar } from '../components/Appbar';
import { CatCard } from '../components/CatCard';
import { HotspotContext } from '../context/HotspotDetailContext';
import { Cat } from '../models/Cat';
import { HotspotStatus } from '../models/Hotspot';
import { Region, RootStackParamList } from '../types';
import { loadHotspotDetails } from '../utils/hotspots';

const getStyles = (theme: ReactNativePaper.Theme) =>
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
      lineHeight: 26,
      flexShrink: 1,
      marginRight: 20,
    },
    subTitle: {
      fontFamily: 'Nunito_400Regular',
      fontSize: 15,
      color: theme.colors.placeholder,
      paddingTop: 11,
      paddingBottom: 8,
    },
    editButton: {
      flexGrow: 1,
      flexShrink: 0,
    },
    buttonContent: {
      flexDirection: 'row-reverse',
      paddingHorizontal: 10,
    },
    buttonLabel: {
      color: theme.colors.background,
      fontSize: 12,
      fontFamily: 'Nunito_800ExtraBold',
      letterSpacing: 0.05,
    },
    notes: {
      paddingTop: 12,
      color: theme.colors.placeholder,
      fontFamily: 'Nunito_400Regular',
      fontSize: 16,
      marginBottom: 24,
    },
    imageView: {
      marginTop: 32,
    },
    image: {
      height: 375,
      flex: 1,
      width: undefined,
    },
    catCategoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 12,
    },
    catCategoryIcon: {
      margin: 0,
    },
    catCategoryTitleLabel: {
      fontSize: 18,
      fontFamily: 'Nunito_700Bold',
      color: theme.colors.text,
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
      fontFamily: 'Nunito_800ExtraBold',
      textTransform: 'uppercase',
      textAlign: 'center',
      flexWrap: 'wrap',
    },
    informationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    informationView: {
      paddingVertical: 16,
      backgroundColor: theme.colors.infoBg,
      alignItems: 'center',
      borderRadius: theme.roundness,
      height: 100,
      flex: 1,
      margin: 5,
      justifyContent: 'space-between',
      flexDirection: 'column',
    },
    informationTitle: {
      color: theme.colors.infoText,
      fontSize: 12,
      fontFamily: 'Nunito_800ExtraBold',
      flexWrap: 'wrap',
      textTransform: 'uppercase',
      textAlign: 'center',
    },
    informationSubtitle: {
      fontSize: 14,
      fontFamily: 'Nunito_700Bold',
    },
    informationCount: {
      fontFamily: 'Nunito_700Bold',
    },
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingTop: 18,
    },
    contentCotainer: { padding: 20 },
    moreButton: {
      height: 40,
      marginTop: 24,
      marginBottom: 24,
      maxWidth: 150,
    },
    moreButtonContent: {
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row-reverse',
    },
    moreButtonLabel: {
      color: theme.colors.background,
      fontSize: 12,
      fontFamily: 'Nunito_700Bold',
    },
  });

export const HotspotDetailScreen = ({
  route,
}: NativeStackScreenProps<RootStackParamList, 'HotspotDetail'>) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { hotspotDetails, setHotspotDetails } = useContext(HotspotContext);
  const [region, setRegion] = useState<Region>();

  useEffect(() => {
    const load = async () => {
      const { success, hotspotDetails: hd } = await loadHotspotDetails(
        route.params.hotspotId
      );
      if (!success) alert('Failed to load hotspot details');
      if (hd) setHotspotDetails(hd);
      setRegion({
        latitude: hd?.latitude!,
        longitude: hd?.longitude!,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    };
    load();
  }, []);

  if (!hotspotDetails)
    return (
      <>
        <Appbar forDetailScreen />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </>
    );

  const address = trim(
    `${hotspotDetails.address}, ${hotspotDetails.city}, ${hotspotDetails.zip}`,
    ','
  )
    .trim()
    .replace(' ,', ',');

  return (
    <>
      <Appbar forDetailScreen />
      <View style={{ alignItems: 'center' }}>
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.contentCotainer}>
              <View style={styles.addressContainer}>
                <Title style={styles.addressTitle}>{address}</Title>
                <Button
                  style={styles.editButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  icon="pencil-outline"
                  mode="contained"
                  onPress={() => {
                    navigation.navigate('AddHotspot', {
                      region: region!,
                      isUpdate: true,
                    });
                  }}
                  compact
                >
                  Editează
                </Button>
              </View>
              <Caption style={styles.subTitle}>
                {hotspotDetails.description}
              </Caption>
              <View style={styles.separator} />
              {!!hotspotDetails.notes && (
                <Caption style={styles.notes}>{hotspotDetails.notes}</Caption>
              )}
              <View style={styles.informationContainer}>
                <StatusView status={hotspotDetails.status}></StatusView>
                <InformationView
                  title={'pisici \nnesterilizate'}
                  count={`${
                    hotspotDetails.unsterilizedCatsCount ||
                    hotspotDetails.unsterilizedCats.length
                  }`}
                ></InformationView>
                <InformationView
                  title={'pisici sterilizate'}
                  count={`${hotspotDetails.sterilizedCats.length}`}
                ></InformationView>
              </View>
              <View style={styles.informationContainer}>
                <InformationView
                  title={'Contact'}
                  subtitle={`${hotspotDetails.contactName || '-'}\n${
                    hotspotDetails.contactPhone || '-'
                  }`}
                ></InformationView>
                <InformationView
                  title={'Voluntar'}
                  subtitle={`${hotspotDetails.volunteer?.name || '-'}\n${
                    hotspotDetails.volunteer?.phone || '-'
                  }`}
                ></InformationView>
              </View>
              <View style={styles.catCategoryContainer}>
                <IconButton
                  size={24}
                  icon="close-circle"
                  color={theme.colors.text}
                  style={styles.catCategoryIcon}
                />
                <Title style={styles.catCategoryTitleLabel}>
                  Pisici nesterilizate
                </Title>
              </View>
              <CatsView cats={hotspotDetails.unsterilizedCats} />
              <View style={styles.separator} />
              <View style={styles.catCategoryContainer}>
                <IconButton
                  size={24}
                  icon="check-circle"
                  color={theme.colors.text}
                  style={styles.catCategoryIcon}
                />
                <Title style={styles.catCategoryTitleLabel}>
                  Pisici sterilizate
                </Title>
              </View>
              <CatsView cats={hotspotDetails.sterilizedCats} />
            </View>
            <View style={styles.imageView}>
              <Image
                source={catLady3}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

const StatusView = ({ status }: { status: HotspotStatus }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const getColor = (status: HotspotStatus) => {
    if (status === HotspotStatus.done) return theme.colors.success;
    if (status === HotspotStatus.inProgress) return theme.colors.warning;
    return theme.colors.error;
  };

  return (
    <View style={[styles.statusView, { backgroundColor: getColor(status) }]}>
      <Caption
        style={{
          ...styles.statusText,
          color:
            status === HotspotStatus.toDo
              ? theme.colors.background
              : theme.colors.text,
        }}
      >
        {status.replace(' ', '\n')}
      </Caption>
    </View>
  );
};

const InformationView = ({
  title,
  subtitle,
  count,
}: {
  title: string;
  subtitle?: string;
  count?: string;
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.informationView}>
      <Caption style={styles.informationTitle}>{title}</Caption>
      {!!subtitle && (
        <Caption style={styles.informationSubtitle}>{subtitle}</Caption>
      )}
      {!!count && <Title style={styles.informationCount}>{count}</Title>}
    </View>
  );
};

export type CatsViewTypes = 'create' | 'detail';

export const CatsView = ({
  cats = [],
  isEditMode,
  deleteFunction,
  addNewCat,
}: {
  cats: Cat[];
  isEditMode?: boolean;
  deleteFunction?: (cat: Cat) => void;
  addNewCat?: (cat: Cat) => void;
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const maxVisibleCat = 2;
  const [visibleCat, setVisible] = useState<number>(maxVisibleCat);

  return (
    <View>
      {cats
        .slice(0, visibleCat)
        .map((cat, index) =>
          cat.isNew ? (
            <AddCatCard
              key={index}
              cat={cat}
              addCat={addNewCat}
              deleteCat={deleteFunction}
            />
          ) : (
            <CatCard
              key={cat.id}
              cat={cat}
              index={index + 1}
              isEditingMode={isEditMode}
              deleteFunction={deleteFunction}
            />
          )
        )}
      {cats.length > maxVisibleCat && visibleCat === maxVisibleCat && (
        <View style={{ alignItems: 'center' }}>
          <Button
            style={styles.moreButton}
            contentStyle={styles.moreButtonContent}
            labelStyle={styles.moreButtonLabel}
            icon="arrow-down"
            mode="contained"
            onPress={() => setVisible(cats.length)}
          >
            vezi mai multe
          </Button>
        </View>
      )}
    </View>
  );
};
