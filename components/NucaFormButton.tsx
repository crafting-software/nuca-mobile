import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { isSmallScreen } from '../utils/helperFunc';

const getStyles = () =>
  StyleSheet.create({
    saveButton: {
      height: 64,
      maxWidth: 340,
      minWidth: isSmallScreen() ? 64 : 340,
      marginBottom: 10,
      marginRight: isSmallScreen() ? 0 : 12,
      zIndex: 2,
    },
    saveButtonContent: {
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row-reverse',
    },
    buttonLabel: {
      fontSize: 18,
      marginStart: 8,
      textAlignVertical: 'bottom',
      fontFamily: 'Nunito_700Bold',
    },
  });

type NucaFormButtonProps = {
  label: string;
  iconName: string;
  backgroundColor: string;
  labelColor: string;
  onPress: () => any;
};

export const NucaFormButton = ({
  label,
  backgroundColor,
  labelColor,
  iconName,
  onPress,
}: NucaFormButtonProps) => {
  const styles = getStyles();
  const buttonLabelStyle = { ...styles.buttonLabel, color: labelColor };
  const buttonStyle = {
    ...styles.saveButton,
    backgroundColor: backgroundColor,
  };

  return (
    <Button
      uppercase={false}
      style={buttonStyle}
      contentStyle={styles.saveButtonContent}
      labelStyle={buttonLabelStyle}
      onPress={onPress}
      icon={iconName}
      mode="contained"
    >
      {label}
    </Button>
  );
};
