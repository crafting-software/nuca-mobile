import { GestureResponderEvent, StyleSheet } from 'react-native';
import {
  Appbar as PaperAppbar,
  IconButton,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  bar: {
    height: 'auto',
    shadowColor: 'blue',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 10,
  },
});

export type SecondaryAppbarProps = {
  onBackPressed: (e: GestureResponderEvent) => void;
};

export const SecondaryAppbar = (props: SecondaryAppbarProps) => {
  const { top } = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <PaperAppbar
      style={{
        paddingTop: top,
        backgroundColor: theme.colors.surface,
        ...styles.bar,
      }}
    >
      <IconButton
        icon="arrow-left"
        color={theme.colors.text}
        size={24}
        onPress={props.onBackPressed}
      />
    </PaperAppbar>
  );
};
