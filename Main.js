import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "./src/components/splash"
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

const {Navigator ,Screen} =createStackNavigator();
const Main = () => {
    return(
        <NavigationContainer>
            <Navigator 
             initialRouteName={Platform.OS == "android" ? "splash" : "termsandconditions"}
             screenOptions={{ headerShown: false }}>
             <Screen name="splash" component={Splash} />
             <Screen name="language" component={Language} />
             <Screen name="onboardingscreens" component={OnBoardingScreens} />
             <Screen name="onboarding1" component={OnBoarding1} />
             <Screen name="onboarding2" component={OnBoarding2} />
             <Screen name="onboarding3" component={OnBoarding3} />
             <Screen name="onboarding4" component={OnBoarding4} />
             <Screen name="onboarding5" component={OnBoarding5} />
             <Screen name="onboarding6" component={OnBoarding6} />
             <Screen name="onboarding7" component={OnBoarding7} />
             <Screen name="privacypolicy" component={PrivacyPolicy} />
             <Screen name="otpscreen" component={OtpScreen} />
             <Screen name="otpverify" component={OtpVerification} />
             <Screen name="createprofile" component={CreateProfile} />
             <Screen name="location" component={Location} />
             <Screen name="findmylocation" component={FindMyLocation} />
             <Screen name="buyorsell" component={BuyOrSell} />
             <Screen name="sellnavigationdrawer" component={SellNavigationDrawer} />
             <Screen name="drawercontent" component={DrawerContent} />
             <Screen name="sellcategories" component={SellCategories} />
             <Screen name="sellsubcategories" component={SellSubCategories} />
             <Screen name="details" component={Details} />
             <Screen name="uploadimages" component={UploadImages} />
             <Screen name="bottomnavigation" component={BottomTabNavigator} />
             <Screen name="homepagebuy" component={HomePageBuy} />
             <Screen name="buycategories" component={BuyCategories} />
             <Screen name="filter" component={Filter} />
             <Screen name="buysubcategories" component={BuySubCategories} />
             <Screen name="buylist" component={BuyList} />
             <Screen name="buydetails" component={BuyingDetails} />
             <Screen name="buynavigationdrawer" component={BuyNavigationDrawer} />
             <Screen name="buynotification" component={BuyNotification} />
             <Screen name="buywishlist" component={BuyWishlist}/>
             <Screen name="buymyads" component={BuyMyAds}/>
             <Screen name="buycustomersupport" component={BuyCustomerSupport}/>
             <Screen name="buyreferralcode" component={BuyReferralCode}/>
             <Screen name="contacts" component={Contacts}/>
             <Screen name="buypayments" component={BuyPayments}/>
             <Screen name="commonfilter" component={CommonFilter}/>


            </Navigator>
        </NavigationContainer>
    )
}
export default Main;