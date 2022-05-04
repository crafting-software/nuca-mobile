import { isEmpty } from 'lodash';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import {
  Button,
  Caption,
  Card,
  IconButton,
  Modal,
  Portal,
  useTheme,
} from 'react-native-paper';
import { Cat, getDateText } from '../models/Cat';
import { AddCatCard } from './AddCatCard';

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
    index: {
      color: theme.colors.placeholder,
      fontSize: 16,
      lineHeight: 26,
      fontFamily: 'Nunito_800ExtraBold',
      marginLeft: 4,
    },
    title: {
      color: theme.colors.placeholder,
      fontSize: 20,
      lineHeight: 32,
      fontFamily: 'Nunito_400Regular',
      paddingLeft: 8,
      textAlignVertical: 'center',
    },
    notes: {
      paddingTop: 12,
      color: theme.colors.placeholder,
      fontFamily: 'Nunito_400Regular',
      fontSize: 16,
    },
    media: {
      width: 64,
      height: 64,
      borderRadius: 15,
      marginRight: 8,
    },
    baseText: {
      color: theme.colors.placeholder,
      fontSize: 16,
      fontFamily: 'Nunito_700Bold',
      letterSpacing: 0.01,
      margin: 0,
      marginLeft: 4,
    },
    infoText: {
      color: theme.colors.placeholder,
      fontSize: 16,
      fontFamily: 'Nunito_400Regular',
      flexWrap: 'wrap',
    },
    iconAndText: {
      width: '50%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    informationLine: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      flexWrap: 'wrap',
    },
    icon: {
      margin: 0,
    },
    genderText: {
      color: theme.colors.placeholder,
      fontSize: 16,
      lineHeight: 32,
      fontFamily: 'Nunito_700Bold',
      textAlign: 'center',
      width: 32,
      height: 32,
      marginLeft: 4,
      borderRadius: 16,
      borderColor: theme.colors.placeholder,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    editButton: {
      height: 66,
      width: '100%',
      backgroundColor: theme.colors.accent,
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
      width: '50%',
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
      fontFamily: 'Nunito_700Bold',
    },
  });
interface CatCardProps {
  cat: Cat;
  index: number;
  isEditingMode?: boolean;
}

export const CatCard = ({
  cat,
  index,
  isEditingMode = false,
}: CatCardProps) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <>
      {!isEditingMode ? (
        <Card style={styles.mainContainer}>
          <Portal>
            <Modal visible={visible} onDismiss={hideModal}>
              <DeleteModal hideModal={hideModal} />
            </Modal>
          </Portal>
          <View style={styles.container}>
            <View style={styles.titleRow}>
              <Caption style={styles.index}>{index}.</Caption>
              <Caption style={styles.title}>Sex</Caption>
              <Caption style={styles.genderText}>{cat.sex}</Caption>
            </View>
            {!!cat.notes && (
              <Caption style={styles.notes}>Observatii: {cat.notes}</Caption>
            )}
            {!!cat.isSterilized && (
              <View style={{ paddingTop: 8 }}>
                <View style={styles.informationLine}>
                  <View style={styles.iconAndText}>
                    <IconButton
                      icon="calendar-arrow-left"
                      size={20}
                      color={theme.colors.placeholder}
                      style={styles.icon}
                    />
                    <Caption style={styles.baseText}>Dată internare:</Caption>
                  </View>
                  <Caption style={styles.infoText}>
                    {getDateText(cat.checkInDate)}
                  </Caption>
                </View>
                <View style={styles.informationLine}>
                  <View style={styles.iconAndText}>
                    <IconButton
                      icon="calendar-arrow-right"
                      size={20}
                      color={theme.colors.placeholder}
                      style={styles.icon}
                    />
                    <Caption style={styles.baseText}>Dată externare:</Caption>
                  </View>
                  <Caption style={styles.infoText}>
                    {getDateText(cat.checkOutDate)}
                  </Caption>
                </View>
                <View style={styles.informationLine}>
                  <View style={styles.iconAndText}>
                    <IconButton
                      icon="account"
                      size={20}
                      color={theme.colors.placeholder}
                      style={styles.icon}
                    />
                    <Caption style={styles.baseText}>Voluntar:</Caption>
                  </View>
                  <Caption style={styles.infoText}>
                    {cat.capturedBy?.name || ''}
                  </Caption>
                </View>
              </View>
            )}
            {!isEmpty(cat.media) && (
              <FlatList
                style={{ marginTop: 20 }}
                horizontal
                data={[] /*cat.media*/}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View>
                    <Image style={styles.media} source={{ uri: item }} />
                  </View>
                )}
              />
            )}
          </View>
          {isEditingMode && (
            <View style={{ flexDirection: 'row', paddingTop: 8 }}>
              <View style={styles.buttonView}>
                <Button
                  style={styles.editButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  icon="pencil"
                >
                  Editează
                </Button>
              </View>
              <View style={styles.buttonView}>
                <Button
                  style={styles.deleteButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  icon="close"
                  onPress={showModal}
                >
                  Șterge
                </Button>
              </View>
            </View>
          )}
        </Card>
      ) : (
        <AddCatCard isEditingMode={isEditingMode} cat={cat} />
      )}
    </>
  );
};

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
  });

export const DeleteModal = ({ hideModal }: { hideModal: () => void }) => {
  const theme = useTheme();
  const styles = getModalStyles(theme);

  return (
    <Card style={{ marginHorizontal: 20, backgroundColor: 'white' }}>
      <Caption style={styles.title}>Ești sigur că vrei să ștergi?</Caption>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
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
            onPress={() => alert('Delete cat')}
          >
            Șterge
          </Button>
        </View>
      </View>
    </Card>
  );
};
