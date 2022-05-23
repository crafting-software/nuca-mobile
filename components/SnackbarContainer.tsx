import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Caption, Snackbar, useTheme } from 'react-native-paper';
import SnackbarManager from '../utils/SnackbarManager';

const getStyles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    snackLabel: {
      color: theme.colors.background,
      fontSize: 16,
      fontFamily: 'Nunito_700Bold',
    },
  });

export interface SnackbarViewProps {
  readonly severity?: 'success' | 'error';
  readonly message: string;
}

export default function SnackbarContainer() {
  const [props, setProps] = useState<SnackbarViewProps | undefined>();
  const theme = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    SnackbarManager.addChangeListener(setProps);
  }, []);

  return props !== undefined ? (
    <Snackbar
      visible={true}
      style={{
        backgroundColor:
          props.severity === 'error'
            ? theme.colors.error
            : theme.colors.success,
        zIndex: 1000,
      }}
      duration={2000}
      onDismiss={() => {}}
    >
      <Caption style={styles.snackLabel}> {props.message}</Caption>
    </Snackbar>
  ) : null;
}
