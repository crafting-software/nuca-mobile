import React from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import { View, StyleSheet } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { layout } from '../constants/layout';
import { useNucaTheme as useTheme } from '../hooks/useNucaTheme';
import { isSmallScreen } from '../utils/helperFunc';

export const HotspotLoader = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = getStyles(theme, insets);
  const { window } = layout;

  const width = window.width;
  const loaderWidth = width - 20;
  const loaderHeight = window.height;
  const informationViewCardPadding = 10;
  const horizontalLoaderOffset = 40;
  const largeScreenTopPosition = 20;

  return (
    <View style={styles.container}>
      {isSmallScreen() ? (
        <ContentLoader
          speed={0.5}
          width={loaderWidth}
          height={loaderHeight}
          viewBox={`0 0 ${width} ${loaderHeight}`}
          backgroundColor="#d9dcde"
          foregroundColor="#ffffff"
        >
          <Rect x="8" y="240" rx="25" ry="25" width="119" height="92" />
          <Rect x="138" y="240" rx="25" ry="25" width="119" height="92" />
          <Rect x="268" y="240" rx="25" ry="25" width="119" height="92" />
          <Rect x="15" y="345" rx="25" ry="25" width="178" height="105" />
          <Rect x="205" y="345" rx="25" ry="25" width="178" height="105" />
          <Rect x="10" y="162" rx="15" ry="15" width="368" height="52" />
          <Rect x="14" y="129" rx="10" ry="10" width="368" height="6" />
          <Rect x="13" y="78" rx="15" ry="15" width="188" height="28" />

          <Rect x="14" y="15" rx="15" ry="15" width="231" height="46" />
          <Rect x="265" y="19" rx="15" ry="15" width="110" height="37" />
          <Circle cx="36" cy="496" r="19" />
          <Circle cx="348" cy="498" r="25" />
          <Circle cx="38" cy="775" r="19" />
          <Circle cx="349" cy="775" r="25" />
          <Rect x="10" y="546" rx="10" ry="10" width="368" height="6" />

          <Rect x="121" y="589" rx="3" ry="3" width="42" height="10" />
          <Rect x="170" y="589" rx="3" ry="3" width="58" height="10" />
          <Rect x="32" y="589" rx="3" ry="3" width="81" height="10" />
          <Rect x="17" y="609" rx="3" ry="3" width="30" height="10" />
          <Rect x="32" y="567" rx="3" ry="3" width="113" height="10" />
          <Rect x="152" y="567" rx="3" ry="3" width="139" height="10" />
          <Rect x="23" y="628" rx="3" ry="3" width="54" height="10" />
          <Rect x="85" y="628" rx="3" ry="3" width="113" height="10" />
          <Rect x="125" y="670" rx="3" ry="3" width="42" height="10" />
          <Rect x="174" y="670" rx="3" ry="3" width="58" height="10" />
          <Rect x="37" y="670" rx="3" ry="3" width="81" height="10" />
          <Rect x="23" y="689" rx="3" ry="3" width="30" height="10" />
          <Rect x="37" y="647" rx="3" ry="3" width="113" height="10" />
          <Rect x="158" y="647" rx="3" ry="3" width="139" height="10" />

          <Rect x="15" y="820" rx="10" ry="10" width="368" height="6" />
          <Rect x="68" y="483" rx="15" ry="15" width="244" height="29" />
          <Rect x="69" y="760" rx="15" ry="15" width="244" height="29" />
        </ContentLoader>
      ) : (
        <ContentLoader
          speed={0.5}
          width={width}
          height={loaderHeight}
          viewBox={`0 0 ${width + horizontalLoaderOffset} ${loaderHeight}`}
          backgroundColor="#d9dcde"
          foregroundColor="#ffffff"
        >
          <Rect
            x={`${width - width / 10}`}
            y={`${largeScreenTopPosition}`}
            rx="15"
            ry="15"
            width={`${width / 10}`}
            height="35"
          />
          <Rect
            x="10"
            y={`${largeScreenTopPosition}`}
            rx="15"
            ry="15"
            width={`${width / 2}`}
            height="37"
          />
          <Rect
            x="10"
            y={`${largeScreenTopPosition + 50}`}
            rx="15"
            ry="15"
            width={`${width / 2.5}`}
            height="28"
          />

          <Rect x="10" y="135" rx="15" ry="15" width={`${width}`} height="10" />
          {Array.from({ length: 5 }, (_, i) => (
            <Rect
              x={`${
                loaderWidth -
                (i + 1) * (loaderWidth / 5) -
                i * informationViewCardPadding +
                horizontalLoaderOffset
              }`}
              y={`${largeScreenTopPosition + 150}`}
              rx="25"
              ry="25"
              width={`${loaderWidth / 5}`}
              height="100"
            />
          ))}

          <Circle cx="40" cy={`${largeScreenTopPosition + 300}`} r="19" />
          <Circle
            cx={`${width - 26}`}
            cy={`${largeScreenTopPosition + 300}`}
            r="25"
          />

          <Rect
            x="170"
            y={`${largeScreenTopPosition + 375}`}
            rx="3"
            ry="3"
            width="58"
            height="10"
          />
          <Rect
            x="121"
            y={`${largeScreenTopPosition + 375}`}
            rx="3"
            ry="3"
            width="42"
            height="10"
          />
          <Rect
            x="32"
            y={`${largeScreenTopPosition + 375}`}
            rx="3"
            ry="3"
            width="81"
            height="10"
          />
          <Rect
            x="32"
            y={`${largeScreenTopPosition + 400}`}
            rx="3"
            ry="3"
            width="113"
            height="10"
          />
          <Rect
            x="152"
            y={`${largeScreenTopPosition + 400}`}
            rx="3"
            ry="3"
            width="139"
            height="10"
          />
          <Rect
            x="17"
            y={`${largeScreenTopPosition + 425}`}
            rx="3"
            ry="3"
            width="30"
            height="10"
          />
          <Rect
            x="23"
            y={`${largeScreenTopPosition + 450}`}
            rx="3"
            ry="3"
            width="54"
            height="10"
          />
          <Rect
            x="85"
            y={`${largeScreenTopPosition + 450}`}
            rx="3"
            ry="3"
            width="113"
            height="10"
          />
          <Rect
            x="125"
            y={`${largeScreenTopPosition + 475}`}
            rx="3"
            ry="3"
            width="42"
            height="10"
          />
          <Rect
            x="174"
            y={`${largeScreenTopPosition + 475}`}
            rx="3"
            ry="3"
            width="58"
            height="10"
          />
          <Rect
            x="37"
            y={`${largeScreenTopPosition + 475}`}
            rx="3"
            ry="3"
            width="81"
            height="10"
          />

          <Rect
            x="10"
            y={`${largeScreenTopPosition + 525}`}
            rx="10"
            ry="10"
            width={loaderWidth}
            height="6"
          />

          <Circle cx="40" cy={`${largeScreenTopPosition + 600}`} r="19" />
          <Circle
            cx={`${width - 26}`}
            cy={`${largeScreenTopPosition + 600}`}
            r="25"
          />

          <Rect
            x="170"
            y={`${largeScreenTopPosition + 675}`}
            rx="3"
            ry="3"
            width="58"
            height="10"
          />
          <Rect
            x="121"
            y={`${largeScreenTopPosition + 675}`}
            rx="3"
            ry="3"
            width="42"
            height="10"
          />
          <Rect
            x="32"
            y={`${largeScreenTopPosition + 675}`}
            rx="3"
            ry="3"
            width="81"
            height="10"
          />
          <Rect
            x="32"
            y={`${largeScreenTopPosition + 700}`}
            rx="3"
            ry="3"
            width="113"
            height="10"
          />
          <Rect
            x="152"
            y={`${largeScreenTopPosition + 700}`}
            rx="3"
            ry="3"
            width="139"
            height="10"
          />
          <Rect
            x="17"
            y={`${largeScreenTopPosition + 725}`}
            rx="3"
            ry="3"
            width="30"
            height="10"
          />
          <Rect
            x="23"
            y={`${largeScreenTopPosition + 750}`}
            rx="3"
            ry="3"
            width="54"
            height="10"
          />
          <Rect
            x="85"
            y={`${largeScreenTopPosition + 750}`}
            rx="3"
            ry="3"
            width="113"
            height="10"
          />
          <Rect
            x="125"
            y={`${largeScreenTopPosition + 775}`}
            rx="3"
            ry="3"
            width="42"
            height="10"
          />
          <Rect
            x="174"
            y={`${largeScreenTopPosition + 775}`}
            rx="3"
            ry="3"
            width="58"
            height="10"
          />
          <Rect
            x="37"
            y={`${largeScreenTopPosition + 775}`}
            rx="3"
            ry="3"
            width="81"
            height="10"
          />
        </ContentLoader>
      )}
    </View>
  );
};

const getStyles = (_theme: NucaCustomTheme, _insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      marginHorizontal: 10,
      marginBottom: 10,
      borderRadius: 12,
      shadowColor: 'color-danger-600',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.1,
    },
    scrollView: {
      width: '100%',
      height: '1000%',
    },
    contentContainer: {
      padding: 20,
      width: isSmallScreen() ? '100%' : '85%',
    },
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingTop: 18,
      justifyContent: 'space-between',
    },
    addressTitle: {
      fontSize: 18,
      fontFamily: 'Nunito_700Bold',
      lineHeight: 26,
      flexShrink: 1,
      marginRight: 20,
    },
  });
