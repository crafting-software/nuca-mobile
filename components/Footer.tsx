import { Image, Platform, StyleSheet, View } from 'react-native';
import catLady2 from '../assets/cat-lady2.png';
import catLady3 from '../assets/cat-lady3.png';
import catLady3Web from '../assets/cat-lady3W.png';
import catLady4 from '../assets/cat-lady4.png';
import catLady4Web from '../assets/cat-lady4W.png';
import catLady5 from '../assets/cat-lady5.png';
import catLady5Web from '../assets/cat-lady5W.png';
import { useNucaTheme as useTheme } from '../hooks/useNucaTheme';
import { isSmallScreen } from '../utils/helperFunc';

const getFooterStyles = (_theme: NucaCustomTheme) =>
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
    zoomedImage: {
      paddingTop: 12,
      height: 375,
      minHeight: 430,
      flex: 1,
      width: undefined,
      transform: [{ scale: 1.4 }],
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
      case FooterScreens.ReportGenerationScreen:
        return catLady5;
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
      case FooterScreens.ReportGenerationScreen:
        return catLady5Web;
      default:
        throw new Error(`Non-existent image in switch: ${screen}`);
    }
  }

  function getStyle(screen: FooterScreens) {
    switch (screen) {
      case FooterScreens.HotspotDetailScreen:
        return styles.image;
      default:
        return Platform.OS === 'web' ? styles.zoomedImage : styles.image;
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
        style={getStyle(screen)}
        resizeMode={isSmallScreen() ? 'contain' : 'cover'}
      />
    </View>
  );
};

export enum FooterScreens {
  HotspotDetailScreen,
  HotspotFormScreen,
  ReportGenerationScreen,
}
