import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Avatar, Button, Caption, FAB, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AddCatCard } from '../components/AddCatCard';
import { Appbar } from '../components/Appbar';
import { CatCard } from '../components/CatCard';
import { FooterScreens, FooterView } from '../components/Footer';
import { FullScreenActivityIndicator } from '../components/FullScreenActivityIndicator';
import { HotspotContext } from '../context/HotspotDetailContext';
import { useHotspotSave } from '../hooks/useHotspotSave';
import { useNucaTheme as useTheme } from '../hooks/useNucaTheme';
import {
  Cat,
  defaultSterilizedCat,
  defaultUnSterilizedCat,
} from '../models/Cat';
import { HotspotDetails, HotspotStatus } from '../models/Hotspot';
import { Region, RootStackParamList } from '../types';
import SnackbarManager from '../utils/SnackbarManager';
import { addCat, deleteCatRequest } from '../utils/cats';
import { isSmallMobileScreen, isSmallScreen } from '../utils/helperFunc';
import { formatHotspotAddress, loadHotspotDetails } from '../utils/hotspots';

const textSizes = isSmallMobileScreen()
  ? { title: 10, subtitle: 12 }
  : { title: 12, subtitle: 14 };

const cardPadding = isSmallMobileScreen() ? 4 : 16;

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
      maxWidth: 150,
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
      minHeight: 430,
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
      paddingHorizontal: cardPadding,
    },
    statusText: {
      color: theme.colors.text,
      fontSize: textSizes.title,
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
      paddingVertical: 12,
      backgroundColor: theme.colors.infoBg,
      alignItems: 'center',
      borderRadius: theme.roundness,
      flex: 1,
      margin: 5,
      paddingHorizontal: cardPadding,
      height: 100,
      justifyContent: 'space-between',
      flexDirection: 'column',
    },
    titleContainer: {
      height: 40,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    subtitleContainer: {
      height: 50,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    informationTitle: {
      color: theme.colors.infoText,
      fontSize: textSizes.title,
      fontFamily: 'Nunito_800ExtraBold',
      textTransform: 'uppercase',
      textAlign: 'center',
    },
    informationSubtitle: {
      fontSize: textSizes.subtitle,
      fontFamily: 'Nunito_700Bold',
    },
    informationCount: {
      fontFamily: 'Nunito_700Bold',
    },
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingTop: 18,
      justifyContent: 'space-between',
    },
    contentCotainer: {
      padding: 20,
      width: isSmallScreen() ? '100%' : '85%',
    },
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
    catsWebViewContainer: {
      justifyContent: 'space-between',
      marginVertical: 10,
      flexDirection: 'row',
    },
    catsWebView: {
      maxWidth: Dimensions.get('window').width / 4,
      flex: 0.5,
      margin: 6,
      marginBottom: 10,
      flexDirection: 'column',
    },
    catCategoriesContainer: {
      flexDirection: 'row',
      paddingTop: 24,
      paddingBottom: 24,
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
      alignItems: 'center',
      position: 'absolute',
      margin: 1,
      right: 0,
    },
  });

export const HotspotDetailScreen = ({
  route,
}: NativeStackScreenProps<RootStackParamList, 'HotspotDetail'>) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const [isInProgress, setIsInProgress] = useState(false);
  const { hotspotDetails, setHotspotDetails } = useContext(HotspotContext);
  const [region, setRegion] = useState<Region>();

  const [newSterilizedCats, setNewSterilizedCats] = useState<Cat[]>([]);
  const [newUnsterilizedCat, setNewUnsterilizedCat] = useState<Cat[]>([]);

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

  const address = formatHotspotAddress(hotspotDetails, false);

  const deleteCat = async (cat: Cat) => {
    if (
      !hotspotDetails.sterilizedCats.includes(cat) &&
      !hotspotDetails.unsterilizedCats.includes(cat)
    ) {
      cat.isSterilized ? setNewSterilizedCats([]) : setNewUnsterilizedCat([]);
      return;
    }
    setIsInProgress(true);
    const { success } = await deleteCatRequest(cat.id);

    if (success) {
      setIsInProgress(false);
      SnackbarManager.success('Cat deleted!');

      const unsterilizedCats = hotspotDetails.unsterilizedCats.filter(
        (c: Cat) => c.id !== cat.id
      );
      const sterilizedCats = hotspotDetails.sterilizedCats.filter(
        (c: Cat) => c.id !== cat.id
      );

      setHotspotDetails({
        ...hotspotDetails,
        unsterilizedCats: unsterilizedCats,
        sterilizedCats: sterilizedCats,
      });
    } else {
      setIsInProgress(false);
      SnackbarManager.error(
        'HotspotFormScreen - deleteCat func.',
        'Cat not deleted'
      );
    }
  };

  const save = useHotspotSave({
    hotspotToBeSaved: hotspotDetails,
    shouldUpdate: true,
    setIsInProgress,
  });

  const addNewCat = async (newCat: Cat) => {
    if (![undefined, ''].includes(hotspotDetails.id)) {
      saveNewCat(newCat, hotspotDetails.id);
      setIsInProgress(true);
      return;
    }

    const hotspot = await save();
    hotspot.hotspot && saveNewCat(newCat, hotspot.hotspot.id);
  };

  const saveNewCat = async (newCat: Cat, hotspotId: string) => {
    const { success, cat } = await addCat(newCat, hotspotId);

    if (success) {
      setIsInProgress(false);

      SnackbarManager.success('Adaugare reuşită');

      if (cat?.isSterilized) {
        setNewSterilizedCats([]);
        setHotspotDetails({
          ...hotspotDetails,
          sterilizedCats: [cat!, ...hotspotDetails.sterilizedCats],
        });
      } else {
        setNewUnsterilizedCat([]);
        setHotspotDetails({
          ...hotspotDetails,
          unsterilizedCats: [cat!, ...hotspotDetails.unsterilizedCats],
        });
      }
    } else {
      setIsInProgress(false);
      SnackbarManager.error(
        'HotspotFormScreen - addNewCat func.',
        'Adaugare nereuşită'
      );
    }
  };

  return (
    <>
      <Appbar forDetailScreen />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View
            style={{
              alignItems: 'center',
            }}
          >
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
              <SummaryView hotspotDetails={hotspotDetails} />
              <View style={styles.catCategoriesContainer}>
                <Avatar.Icon
                  size={24}
                  icon="close"
                  color={theme.colors.background}
                  style={styles.catCategoryTitleIcon}
                />

                <Caption style={styles.catCategoryTitleLabel}>
                  Pisici nesterilizate
                </Caption>
                <FAB
                  color={theme.colors.background}
                  icon="plus"
                  style={styles.catCategoryAddButton}
                  size="small"
                  onPress={() => {
                    setNewUnsterilizedCat([defaultUnSterilizedCat]);
                  }}
                />
              </View>
              <CatsView
                cats={newUnsterilizedCat.concat(
                  hotspotDetails.unsterilizedCats
                )}
                isEditMode={true}
                deleteFunction={deleteCat}
                addNewCat={addNewCat}
              />
              <View style={styles.separator} />
              <View style={styles.catCategoriesContainer}>
                <Avatar.Icon
                  size={24}
                  icon="check"
                  color={theme.colors.background}
                  style={styles.catCategoryTitleIcon}
                />
                <Caption style={styles.catCategoryTitleLabel}>
                  Pisici sterilizate
                </Caption>
                <FAB
                  color={theme.colors.background}
                  icon="plus"
                  style={styles.catCategoryAddButton}
                  size="small"
                  onPress={() => {
                    setNewSterilizedCats([defaultSterilizedCat]);
                  }}
                />
              </View>
              <CatsView
                cats={newSterilizedCats.concat(hotspotDetails.sterilizedCats)}
                isEditMode={true}
                deleteFunction={deleteCat}
                addNewCat={addNewCat}
              />
            </View>
          </View>
          <FooterView screen={FooterScreens.HotspotDetailScreen} />
        </ScrollView>
      </View>
      {isInProgress && <FullScreenActivityIndicator />}
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
        {status.toUpperCase()}
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
      <View style={styles.titleContainer}>
        <Caption style={styles.informationTitle}>{title}</Caption>
      </View>
      <View style={styles.subtitleContainer}>
        {!!subtitle && (
          <Caption style={styles.informationSubtitle}>{subtitle}</Caption>
        )}
        {!!count && <Title style={styles.informationCount}>{count}</Title>}
      </View>
    </View>
  );
};

const SummaryView = ({
  hotspotDetails,
}: {
  hotspotDetails: HotspotDetails;
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return !isSmallScreen() ? (
    <View style={styles.informationContainer}>
      <StatusView status={hotspotDetails.status} />
      <InformationView
        title={'pisici nesterilizate'}
        count={`${
          hotspotDetails.unsterilizedCatsCount ||
          hotspotDetails.unsterilizedCats.length
        }`}
      ></InformationView>
      <InformationView
        title={'pisici sterilizate'}
        count={`${hotspotDetails.sterilizedCats.length}`}
      ></InformationView>
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
  ) : (
    <View>
      <View style={styles.informationContainer}>
        <StatusView status={hotspotDetails.status} />
        <InformationView
          title={'pisici nesterilizate'}
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

  return isSmallScreen() ? (
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
  ) : (
    <View style={styles.catsWebViewContainer}>
      <FlatList
        data={cats}
        renderItem={({ index }) => (
          <View style={styles.catsWebView}>
            {cats[index].isNew ? (
              <AddCatCard
                key={index}
                cat={cats[index]}
                addCat={addNewCat}
                deleteCat={deleteFunction}
              />
            ) : (
              <CatCard
                key={cats[index].id}
                cat={cats[index]}
                index={index + 1}
                isEditingMode={isEditMode}
                deleteFunction={deleteFunction}
              />
            )}
          </View>
        )}
        columnWrapperStyle={{ flexWrap: 'wrap', flex: 1, marginTop: 5 }}
        //Setting the number of column
        numColumns={3}
        keyExtractor={(_item, index) => index.toString()}
      />
    </View>
  );
};
