import React from 'react';
import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

export type InputFieldProps = {
  label?: string;
  placeholder: string;
  returnKeyType?: ReturnKeyTypeOptions | undefined;
  numberOfLines?: number;
  inputFieldStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  rightIcon?: React.ReactNode;
  multiline?: boolean;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions | undefined;
};

export const InputField = (props: InputFieldProps) => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    title: {
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: 'Nunito_700Bold',
      textTransform: 'uppercase',
    },
    input: {
      fontSize: 15,
      fontFamily: 'Nunito_400Regular',
      backgroundColor: 'white',
      height: 60,
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: theme.roundness,
    },
  });

  return (
    <View style={props.inputFieldStyle}>
      {props.label ? (
        <Text style={[styles.title, props.labelStyle]}>{props.label}</Text>
      ) : (
        <></>
      )}
      <TextInput
        placeholder={props.placeholder}
        autoComplete={false}
        mode="outlined"
        multiline={props.multiline}
        numberOfLines={props.numberOfLines ?? 1}
        outlineColor={theme.colors.disabled}
        style={[styles.input, props.textInputStyle]}
        returnKeyType={props.returnKeyType}
        right={props.rightIcon}
        editable={props.editable}
        keyboardType={props.keyboardType}
      />
    </View>
  );
};
