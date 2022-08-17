import { Image, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import catLady2 from '../assets/cat-lady2.png';
import catLady3 from '../assets/cat-lady3.png';
import catLady3Web from '../assets/cat-lady3W.png';
import catLady4 from '../assets/cat-lady4.png';
import catLady4Web from '../assets/cat-lady4W.png';
import catLady5Web from '../assets/cat-lady5W.png';
import { isSmallScreen } from '../utils/helperFunc';

const getFooterStyles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    imageView: {
      marginTop: 32,
    },
    image: {
      paddingTop: 12,
      height: 375,
      minHeight: 430,
      flex: 1,
      width: undefined,
    },
  });

export const FooterView = ({
  screen,
  isUpdate,
}: {
  screen: FooterScreens;
  isUpdate?: boolean;
}) => {
  const theme = useTheme();
  const styles = getFooterStyles(theme);

  function getSmallScreenImage(screen: FooterScreens) {
    switch (screen) {
      case FooterScreens.HotspotDetailScreen:
        return catLady3;
      case FooterScreens.HotspotFormScreen:
        return isUpdate ? catLady4 : catLady2;
      default:
        throw new Error(`Non-existent image in switch: ${screen}`);
    }
  }

  function getWideScreenImage(screen: FooterScreens) {
    switch (screen) {
      case FooterScreens.HotspotDetailScreen:
        return catLady3Web;
      case FooterScreens.HotspotFormScreen:
        return isUpdate ? catLady4Web : catLady5Web;
      default:
        throw new Error(`Non-existent image in switch: ${screen}`);
    }
  }

  return (
    <View style={styles.imageView}>
      <Image
        source={
          isSmallScreen()
            ? getSmallScreenImage(screen)
            : getWideScreenImage(screen)
        }
        style={styles.image}
        resizeMode={isSmallScreen() ? 'contain' : 'cover'}
      />
    </View>
  );
};

export enum FooterScreens {
  HotspotDetailScreen,
  HotspotFormScreen,
}
