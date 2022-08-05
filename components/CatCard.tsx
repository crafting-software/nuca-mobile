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
import { DeleteModal } from './DeleteModal';

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
      fontSize: 14,
      fontFamily: 'Nunito_700Bold',
      letterSpacing: 0.01,
      margin: 0,
      marginLeft: 4,
    },
    infoText: {
      color: theme.colors.placeholder,
      fontSize: 15,
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
  deleteFunction?: (cat: Cat) => void;
}

export const CatCard = ({
  cat,
  index,
  isEditingMode = false,
  deleteFunction,
}: CatCardProps) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [visible, setVisible] = useState(false);
  const [shouldEdit, setShouldEdit] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const updateChanges = () => {
    setShouldEdit(false);
  };

  return (
    <>
      {!shouldEdit ? (
        <Card style={styles.mainContainer}>
          <Portal>
            <Modal visible={visible} onDismiss={hideModal}>
              <DeleteModal
                cat={cat}
                hideModal={hideModal}
                deleteCat={deleteFunction}
              />
            </Modal>
          </Portal>
          <View style={styles.container}>
            <View style={styles.titleRow}>
              <Caption style={styles.index}>{index}.</Caption>
              <Caption style={styles.title}>Sex</Caption>
              <Caption style={styles.genderText}>{cat.sex}</Caption>
            </View>
            {!!cat.notes && (
              <Caption style={styles.notes}>
                Observatii: {cat.notes + ' ' + cat.description}
              </Caption>
            )}
            {!!cat.isSterilized && (
              <View style={{ paddingTop: 8 }}>
                <View style={styles.informationLine}>
                  <View style={styles.iconAndText}>
                    <IconButton
                      icon="calendar-arrow-left"
                      size={16}
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
                      size={16}
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
                      size={16}
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
                data={
                  [
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg',
                    'data:image/jpeg;base64,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',
                  ] /*cat.media*/
                }
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
                  onPress={() => setShouldEdit(true)}
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
        <AddCatCard
          isEditingMode={isEditingMode}
          cat={cat}
          saveChanges={updateChanges}
          deleteCat={deleteFunction}
        />
      )}
    </>
  );
};
