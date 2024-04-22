import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Caption, HelperText, TextInput } from 'react-native-paper';
import { useNucaTheme as useTheme } from '../hooks/useNucaTheme';
import { useEffect, useState } from 'react';

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
  onTextInputChangeText?: ((text: string) => void) | undefined;
  onTextInputValidateText?: (text: string) => boolean;
  onInvalidInput?: () => void;
  onValidInput?: () => void;
  invalidValueErrorMessage?: string;
  initiallyValid?: boolean;
  value?: string | undefined;
};

export const InputField = (props: InputFieldProps) => {
  const theme = useTheme();
  const [isValid, setIsValid] = useState<boolean>(props?.initiallyValid || true);
  const styles = StyleSheet.create({
    title: {
      color: theme.colors.text,
      fontFamily: 'Nunito_700Bold',
      textTransform: 'uppercase',
    },
    input: {
      fontFamily: 'Nunito_400Regular',
      backgroundColor: theme.colors.background,
      minHeight: 60,
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: theme.roundness,
    },
  });

  useEffect(() => {
    if (isValid) {
      props.onValidInput && props.onValidInput()
      return;
    }

    props.onInvalidInput && props.onInvalidInput()
  }, [isValid]);

  const onChangeText = (text: string) => {
    props.onTextInputChangeText && props.onTextInputChangeText(text);
    props.onTextInputValidateText && setIsValid(props.onTextInputValidateText(text));
  }

  const getOutlineColor = () => !isValid ? 'red' : theme.colors.disabled;
  const getActiveOutlineColor = () => !isValid ? 'red' : 'green';

  return (
    <View style={props.inputFieldStyle}>
      {props.label ? (
        <Caption style={[styles.title, props.labelStyle]}>
          {props.label}
        </Caption>
      ) : (
        <></>
      )}
      <TextInput
        placeholder={props.placeholder}
        mode="outlined"
        multiline={props.multiline}
        numberOfLines={props.numberOfLines ?? 1}
        selectionColor={getActiveOutlineColor()}
        outlineColor={getOutlineColor()}
        activeOutlineColor={getActiveOutlineColor()}
        style={[styles.input, props.textInputStyle]}
        returnKeyType={props.returnKeyType}
        right={props.rightIcon}
        editable={props.editable}
        keyboardType={props.keyboardType}
        onChangeText={onChangeText}
        value={props.value}
      />
      {
        !isValid && (
          <HelperText type="error">
            {props.invalidValueErrorMessage}
          </HelperText>
        )
      }
    </View>
  );
};
