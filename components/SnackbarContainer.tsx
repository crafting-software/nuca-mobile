import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Snackbar, useTheme } from 'react-native-paper';
import SnackbarManager from '../utils/SnackbarManager';

const getStyles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    snackLabel: {
      justifyContent: 'center',
      display: 'flex',
      color: theme.colors.background,
      fontSize: 16,
      fontFamily: 'Nunito_700Bold',
    },
  });

export interface SnackbarViewProps {
  readonly severity?: 'success' | 'error';
  readonly message?: string;
}

export default function SnackbarContainer() {
  const [props, setProps] = useState<SnackbarViewProps | undefined>();
  const theme = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    SnackbarManager.addChangeListener(setProps);
  }, []);

  return props !== undefined ? (
    <View style={{ alignItems: 'center' }}>
      <Snackbar
        visible={true}
        style={{
          maxWidth: 500,
          minWidth: 300,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            props.severity === 'error'
              ? theme.colors.error
              : theme.colors.success,
          zIndex: 1000,
          alignSelf: 'center',
        }}
        duration={2000}
        onDismiss={() => {}}
      >
        <Caption style={styles.snackLabel}> {props.message}</Caption>
      </Snackbar>
    </View>
  ) : null;
}
