import React, { useRef } from 'react';
import { Animated, StyleSheet, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { PageIndicator } from 'react-native-page-indicator';
import OnBoarding1 from './onboarding1';
import OnBoarding2 from './onboarding2';
import OnBoarding3 from './onboarding3';
import OnBoarding4 from './onboarding4';
import OnBoarding5 from './onboarding5';
import OnBoarding6 from './onboarding6';
import OnBoarding7 from './onboarding7';


const OnBoardingScreens = (navigation) => {
  const { width, height } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const animatedCurrent = useRef(Animated.divide(scrollX, width)).current;
  const scrollViewRef = useRef(null);



  const onMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const lastIndex = pages.length - 1;
    if (offsetX >= width * (lastIndex - 0.5)) {
      setTimeout(() => {
        navigation.navigate('privacypolicy'); 
      }, 1500);
    }
  };

  const pages = [
    <OnBoarding1 key="1" />,
    <OnBoarding2 key="2" />,
    <OnBoarding3 key="3" />,
    // <OnBoarding4 key="4" />,
    // <OnBoarding5 key="5" />,
    <OnBoarding6 key="6" />,
    <OnBoarding7 key="7"/>
  ];
  return (
    <View style={styles.root}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        // onMomentumScrollEnd={onMomentumScrollEnd}
        // ref={scrollViewRef}
      >
        {pages.map((page, index) => (
          <View key={index} style={[styles.page, { width }]}>
            {page}
          </View>
        ))}
      </Animated.ScrollView>
      <PageIndicator
        style={styles.pageIndicator}
        count={pages.length}
        current={animatedCurrent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageIndicator: {
    left: 20,
    right: 20,
    bottom: 50,
    position: 'absolute',
  },
});

export default OnBoardingScreens;