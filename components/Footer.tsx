import { Image, StyleSheet, View } from 'react-native';
import catLady2 from '../assets/cat-lady2.png';
import catLady3 from '../assets/cat-lady3.png';
import catLady3Web from '../assets/cat-lady3W.png';
import catLady4 from '../assets/cat-lady4.png';
import catLady4Web from '../assets/cat-lady4W.png';
import catLady5 from '../assets/cat-lady5.png';
import catLady5Web from '../assets/cat-lady5W.png';
import { useNucaTheme as useTheme } from '../hooks/useNucaTheme';
import { isSmallMobileScreen } from '../utils/helperFunc';

const getFooterStyles = (_theme: NucaCustomTheme) =>
  StyleSheet.create({
    imageView: {
      marginTop: 32,
      flex: 1,
    },
    image: {
      alignSelf: 'center',
      position: 'relative',
      bottom: 0,
      paddingTop: 12,
      height: 430,
      zIndex: -1,
      width: '100%',
      flex: 1,
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

  return (
    <View style={styles.imageView}>
      <Image
        source={
          isSmallMobileScreen()
            ? getSmallScreenImage(screen)
            : getWideScreenImage(screen)
        }
        style={styles.image}
        resizeMode={isSmallMobileScreen() ? 'contain' : 'cover'}
      />
    </View>
  );
};

export enum FooterScreens {
  HotspotDetailScreen,
  HotspotFormScreen,
  ReportGenerationScreen,
}
