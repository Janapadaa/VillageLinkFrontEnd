import React, { useEffect } from 'react';
import { Platform, ActivityIndicator,Linking } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';

import Splash from "./src/components/splash";
import Language from "./src/components/language";
import OnBoardingScreens from "./src/components/onboardingscreens";
import OnBoarding1 from "./src/components/onboarding1";
import OnBoarding2 from "./src/components/onboarding2";
import OnBoarding3 from "./src/components/onboarding3";
import OnBoarding4 from "./src/components/onboarding4";
import OnBoarding5 from "./src/components/onboarding5";
import OnBoarding6 from "./src/components/onboarding6";
import OnBoarding7 from "./src/components/onboarding7";
import PrivacyPolicy from "./src/components/privacypolicy";
import OtpScreen from "./src/components/otp";
import OtpVerification from "./src/components/otpverification";
import CreateProfile from "./src/components/createprofile";
import Location from "./src/components/location";
import FindMyLocation from "./src/components/findmylocation";
import BuyOrSell from "./src/components/buyorsell";
import HomePageSell from "./src/components/sell/homepagesell";
import DrawerContent from "./src/components/drawercontent";
import SellNavigationDrawer from "./src/components/navigation/SellNavigationDrawer";
import SellCategories from "./src/components/sell/SellCategories";
import SellSubCategories from "./src/components/sell/SellSubCategories";
import Details from "./src/components/sell/Details";
import UploadImages from "./src/components/sell/UploadImages";
import BottomTabNavigator from "./src/components/navigation/BottomTabNavigatot";
import HomePageBuy from "./src/components/Buy/Homepagebuy";
import BuyCategories from "./src/components/Buy/BuyCategories";
import Filter from "./src/components/Buy/filter";
import BuySubCategories from "./src/components/Buy/BuySubCategories";
import BuyList from "./src/components/Buy/BuyList";
import BuyingDetails from "./src/components/Buy/BuyingDetails";
import BuyNavigationDrawer from "./src/components/navigation/BuyNavigationDrawer";
import BuyNotification from "./src/components/Buy/BuyNotification";
import BuyWishlist from "./src/components/Buy/BuyWishlist";
import BuyMyAds from "./src/components/Buy/BuyMyAds";
import BuyCustomerSupport from "./src/components/Buy/BuyCustomerSupport";
import BuyReferralCode from "./src/components/Buy/BuyReferralCode";
import Contacts from "./src/components/Buy/Contacts";
import BuyPayments from "./src/components/Buy/BuyPayments";
import CommonFilter from "./src/components/Buy/CommonFilter";
import Featured from "./src/components/Buy/Featured";
import { LanguageProvider } from './src/components/Api/LanguageContext';
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp();
} else {
  firebase.app(); // if already initialized, use that one
}

const Stack = createStackNavigator();
const NAVIGATION_IDS = ['buynavigationdrawer', 'buydetails', 'buynotification'];

function buildDeepLinkFromNotificationData(data) {
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId);
    return null;
  }
  if (navigationId === 'buynavigationdrawer') {
    return 'myapp://buynavigationdrawer';
  }
  if (navigationId === 'buynotification') {
    return 'myapp://buynotification';
  }
  const postId = data?.postId;
  if (typeof postId === 'string') {
    return `myapp://buydetails/${postId}`;
  }
  console.warn('Missing postId');
  return null;
}

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      splash: 'splash',
      language: 'language',
      buynavigationdrawer: 'buynavigationdrawer',
      buywishlist: 'buynotification',
      buydetails: 'buydetails/:id',
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }
    const message = await messaging().getInitialNotification();
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    if (typeof deeplinkURL === 'string') {
      return deeplinkURL;
    }
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }) => listener(url);

    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log("message handled in the backgroud",remoteMessage);
    });

    const foreground = messaging().onMessage(async remoteMessage =>{
        console.log("new FCM message arrived",remoteMessage);
    });

    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const url = buildDeepLinkFromNotificationData(remoteMessage.data);
      if (typeof url === 'string') {
        listener(url);
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
      foreground();
    };
  },
};

const Main = () => {
  return (
    <LanguageProvider>
    <NavigationContainer linking={linking} fallback={<ActivityIndicator animating />}>
      <Stack.Navigator
        initialRouteName={Platform.OS === 'android' ? 'splash' : 'language'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="splash" component={Splash} />
        <Stack.Screen name="language" component={Language} />
        <Stack.Screen name="onboardingscreens" component={OnBoardingScreens} />
        <Stack.Screen name="onboarding1" component={OnBoarding1} />
        <Stack.Screen name="onboarding2" component={OnBoarding2} />
        <Stack.Screen name="onboarding3" component={OnBoarding3} />
        <Stack.Screen name="onboarding4" component={OnBoarding4} />
        <Stack.Screen name="onboarding5" component={OnBoarding5} />
        <Stack.Screen name="onboarding6" component={OnBoarding6} />
        <Stack.Screen name="onboarding7" component={OnBoarding7} />
        <Stack.Screen name="privacypolicy" component={PrivacyPolicy} />
        <Stack.Screen name="otpscreen" component={OtpScreen} />
        <Stack.Screen name="otpverify" component={OtpVerification} />
        <Stack.Screen name="createprofile" component={CreateProfile} />
        <Stack.Screen name="location" component={Location} />
        <Stack.Screen name="findmylocation" component={FindMyLocation} />
        <Stack.Screen name="buyorsell" component={BuyOrSell} />
        <Stack.Screen name="sellnavigationdrawer" component={SellNavigationDrawer} />
        <Stack.Screen name="drawercontent" component={DrawerContent} />
        <Stack.Screen name="sellcategories" component={SellCategories} />
        <Stack.Screen name="sellsubcategories" component={SellSubCategories} />
        <Stack.Screen name="details" component={Details} />
        <Stack.Screen name="uploadimages" component={UploadImages} />
        <Stack.Screen name="bottomnavigation" component={BottomTabNavigator} />
        <Stack.Screen name="homepagebuy" component={HomePageBuy} />
        <Stack.Screen name="buycategories" component={BuyCategories} />
        <Stack.Screen name="filter" component={Filter} />
        <Stack.Screen name="buysubcategories" component={BuySubCategories} />
        <Stack.Screen name="buylist" component={BuyList} />
        <Stack.Screen name="buydetails" component={BuyingDetails} />
        <Stack.Screen name="buynavigationdrawer" component={BuyNavigationDrawer} />
        <Stack.Screen name="buynotification" component={BuyNotification} />
        <Stack.Screen name="buywishlist" component={BuyWishlist} />
        <Stack.Screen name="buymyads" component={BuyMyAds} />
        <Stack.Screen name="buycustomersupport" component={BuyCustomerSupport} />
        <Stack.Screen name="buyreferralcode" component={BuyReferralCode} />
        <Stack.Screen name="contacts" component={Contacts} />
        <Stack.Screen name="buypayments" component={BuyPayments} />
        <Stack.Screen name="commonfilter" component={CommonFilter} />
        <Stack.Screen name="featured" component={Featured} />
      </Stack.Navigator>
    </NavigationContainer>
    </LanguageProvider>
  );
};

export default Main;
