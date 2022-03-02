import { isEmpty } from 'lodash';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Button, Card, IconButton, useTheme } from 'react-native-paper';
import { Cat, getDateText } from '../models/Cat';

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
    title: {
      color: theme.colors.placeholder,
      fontSize: 20,
      fontFamily: 'Nunito_400Regular',
      paddingLeft: 8,
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
      paddingLeft: 4,
    },
    infoText: {
      color: theme.colors.placeholder,
      fontSize: 16,
      fontFamily: 'Nunito_400Regular',
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
      width: 20,
      height: 20,
      margin: 0,
      marginRight: 4,
    },
    circleView: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderColor: theme.colors.placeholder,
      borderWidth: 1,
      justifyContent: 'center',
    },
    genderText: {
      color: theme.colors.placeholder,
      fontSize: 16,
      fontFamily: 'Nunito_700Bold',
      textAlign: 'center',
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

  return (
    <Card style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.baseText}>{index}.</Text>
            <Text style={styles.title}>Sex</Text>
          </View>
          <View style={styles.circleView}>
            <Text style={styles.genderText}>{cat.sex}</Text>
          </View>
        </View>
        {!!cat.notes && (
          <Text style={styles.notes}>Observatii: {cat.notes}</Text>
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
                <Text style={styles.baseText}>Dată internare:</Text>
              </View>
              <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                <Text style={styles.infoText}>
                  {getDateText(cat.checkInDate)}
                </Text>
              </View>
            </View>
            <View style={styles.informationLine}>
              <View style={styles.iconAndText}>
                <IconButton
                  icon="calendar-arrow-right"
                  size={20}
                  color={theme.colors.placeholder}
                  style={styles.icon}
                />
                <Text style={styles.baseText}>Dată externare:</Text>
              </View>
              <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                <Text style={styles.infoText}>
                  {getDateText(cat.checkOutDate)}
                </Text>
              </View>
            </View>
            <View style={styles.informationLine}>
              <View style={styles.iconAndText}>
                <IconButton
                  icon="account"
                  size={20}
                  color={theme.colors.placeholder}
                  style={styles.icon}
                />
                <Text style={styles.baseText}>Voluntar:</Text>
              </View>
              <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                <Text style={styles.infoText}>
                  {cat.capturedBy?.name || ''}
                </Text>
              </View>
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
            >
              Șterge
            </Button>
          </View>
        </View>
      )}
    </Card>
  );
};
