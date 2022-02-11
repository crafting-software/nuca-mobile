import { isEmpty } from 'lodash';
import React from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { Card, Subheading, Title } from 'react-native-paper';
import Colors from '../constants/Colors';
import { Cat, getDateText } from '../models/Cat';

interface CatCardProps {
  readonly cat: Cat;
  readonly index: number;
}

export const CatCard = (props: CatCardProps) => {
  return (
    <Card style={styles.container}>
      <Title style={styles.title}>
        {props.index}. Sex {props.cat.sex}
      </Title>
      {props.cat.notes && (
        <Subheading style={styles.notes}>
          Observatii: {props.cat.notes}
        </Subheading>
      )}
      {props.cat.isSterilized && (
        <View>
          <View>
            <Title>Dată internare: {getDateText(props.cat.checkInDate)}</Title>
          </View>
          <View>
            <Title>Dată externare: {getDateText(props.cat.checkOutDate)}</Title>
          </View>
          <View>
            <Title>Voluntar: {props.cat.capturedBy.name}</Title>
          </View>
        </View>
      )}
      {!isEmpty(props.cat.media) && (
        <FlatList
          data={props.cat.media}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              <Image style={styles.media} source={{ uri: item }} />
            </View>
          )}
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 30,
    padding: 24,
  },
  title: {
    color: Colors.text,
  },
  notes: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  media: {
    width: 64,
    height: 64,
    borderRadius: 15,
  },
});
