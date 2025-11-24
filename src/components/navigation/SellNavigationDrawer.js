import React ,{useState,useEffect} from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import HomePageSell from "../sell/homepagesell";
import { View, Text, Image, StyleSheet, Alert,BackHandler } from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import { useRoute } from '@react-navigation/native';
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, clearAccessToken, getAccessToken, IMG_URL } from "../Api/apiConfig";
import Toast from 'react-native-simple-toast';
import RNFS from 'react-native-fs';
import { useLanguage } from "../Api/LanguageContext";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation, state,userData,profile }) => {
  const route = useRoute();
  const [userName, setUserName] = useState('Guest');
  const [Profile,setProfile] = useState('')
  const [phoneNumber,setPhoneNumber] = useState('')
  const { languageData } = useLanguage();
  


  React.useEffect(() => {
    // if (userData.length > 0) {
      setUserName(userData);
      setProfile(profile)
      getuserdata()

    // }
  }, [userData,profile]);
  const logout = async () => {
    Alert.alert(
      languageData?.logout_popup?.title,
      languageData?.logout_popup?.content,
      [
        {
          text:languageData?.logout_popup?.cancel_text,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text:languageData?.logout_popup?.yes_text,
          onPress: async () => {
            await clearAccessToken();
           handleBackPress()
          },
        },
      ],
      { cancelable: true }
    );
  };
  const getuserdata = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `${BASE_URL}/user`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': API_KEY,
            'Accept-Language': ACCEPT_LANGUAGE,
          },
        }
      );
      console.log("createpro", response.data.data.phoneNumber);
      setPhoneNumber(response.data.data.phoneNumber)
        } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const Delete = async () => {
    Alert.alert(
      languageData?.delete_account_popup?.title
      ,
      languageData?.delete_account_popup?.content,
      [
        {
          text:languageData?.delete_account_popup?.cancel_text,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: languageData?.delete_account_popup?.yes_text,
          onPress: async () => {
            try {
              const accessToken = await getAccessToken();
              const response = await axios.post(
                  `${BASE_URL}/user/delete-user`,
                  {
                      "phoneNumber": phoneNumber
                     
                  },
                  {
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${accessToken}`,
                          'x-api-key': API_KEY,
                          'Accept-Language': ACCEPT_LANGUAGE,
                      },
                  }
              );
  
            
              console.log("selldeleteresponse", response.data);
              await clearAccessToken();
              navigation.navigate('otpscreen')
              Toast.showWithGravity(
                response.data.message,
                Toast.SHORT,
                Toast.BOTTOM,
                
              );
          } catch (error) {
              console.error('Error fetching subscription data:', error.message);
          }
          },
        },
      ],
      { cancelable: true }
    );
  };
  const handleBackPress = () => {
    navigation.navigate('otpscreen');
  };

  
const focusedRoute = state.routes[state.index];
return (
    <DrawerContentScrollView>
      {/* Your custom header design */}
      <View style={styles.headerContainer}>
      <Image    
           source={Profile ? {uri: `${IMG_URL}${Profile}`}  : require('../../assets/images/account1.png')}
           style={styles.profileImage} />
          <View style={styles.textContainer}>
          <Text style={styles.profileName}>{userName}</Text>
          <TouchableOpacity onPress={() =>navigation.navigate('createprofile',{type:"view",from:'sell'})}>
            <Text style={{ fontSize: 14, color: '#62A845' }}>
            {languageData?.hamburger_menu?.view_profile}
              </Text>
          </TouchableOpacity>
        </View>
      </View>

      <DrawerItem
        label="Language"
        onPress={() => navigation.navigate('language',{type:"menu"})}
        style={focusedRoute.name === 'language' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'language' ? styles.selectedLabel : null}
        icon={() => (
          <Image source={require('../../assets/images/g_translate.png')} style={styles.drawerIcon} />
        )}
      />
      {/* <DrawerItem
        label="Notifications"
        onPress={() => navigation.navigate('buynotification')}
        style={focusedRoute.name === 'notifications' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'notifications' ? styles.selectedLabel : null}
        icon={() => (
          <Image source={require('../../assets/images/notifications.png')} style={styles.drawerIcon} />
        )}
      /> */}
      <DrawerItem
        label= {()=><Text style={styles.drawerLabel}>{languageData?.hamburger_menu?.wishlist}</Text>}
        onPress={() => navigation.navigate('buywishlist')}
        style={focusedRoute.name === 'wishlist' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'wishlist' ? styles.selectedLabel : null}

        icon={() => (
          <Image source={require('../../assets/images/favmenu.png')} style={styles.drawerIcon} />
        )}
      />
      <DrawerItem
        label= {()=><Text style={styles.drawerLabel}>{languageData?.hamburger_menu?.my_listing}</Text>}
        onPress={() => navigation.navigate('buymyads')}
        style={focusedRoute.name === 'myads' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'myads' ? styles.selectedLabel : null}
        icon={() => (
          <Image source={require('../../assets/images/adsmenu.png')} style={styles.drawerIcon} />
        )}
      />
      <DrawerItem
        label= {()=><Text style={styles.drawerLabel}>{languageData?.hamburger_menu?.customer_support}</Text>}
        onPress={() => navigation.navigate('buycustomersupport')}
        style={focusedRoute.name === 'customersupport' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'customersupport' ? styles.selectedLabel : null}
        icon={() => (
          <Image source={require('../../assets/images/customer-support.png')} style={styles.drawerIcon} />
        )}
      />
      <DrawerItem
        label= {()=><Text style={styles.drawerLabel}>{languageData?.hamburger_menu?.referral_code}</Text>}
        onPress={() => navigation.navigate('buyreferralcode')}
        style={focusedRoute.name === 'referralcode' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'referralcode' ? styles.selectedLabel : null}
        icon={() => (
          <Image source={require('../../assets/images/referralmenu.png')} style={styles.drawerIcon} />
        )}
      />
      <DrawerItem
        label= {()=><Text style={styles.drawerLabel}>{languageData?.hamburger_menu?.my_enquiries}</Text>}
        onPress={() => navigation.navigate('contacts')}
        style={focusedRoute.name === 'contact' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'contact' ? styles.selectedLabel : null}
        icon={() => (
          <Image source={require('../../assets/images/contacts.png')} style={styles.drawerIcon} />
        )}
      />
      {/* <DrawerItem
        label= {()=><Text style={styles.drawerLabel}>{languageData?.hamburger_menu?.payments}</Text>}
        onPress={() => navigation.navigate('buypayments')}
        style={focusedRoute.name === 'payments' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'payments' ? styles.selectedLabel : null}
        icon={() => (
          <Image source={require('../../assets/images/walletmenu.png')} style={styles.drawerIcon} />
        )}
      /> */}
      <DrawerItem
        label= {()=><Text style={styles.drawerLabel}>{languageData?.hamburger_menu?.delete_account}</Text>}
        onPress={() => { Delete() }}
      //  style={focusedRoute.name === 'logout' ? styles.selectedItem : null}
        //labelStyle={focusedRoute.name === 'logout' ? styles.selectedLabel : null}
        icon={() => (
          <Image source={require('../../assets/images/delete.png')} style={{width:30,height:30,marginRight: 10,right:5}} />
        )}
      />
      <DrawerItem
        label= {()=><Text style={styles.drawerLabel}>{languageData?.hamburger_menu?.logout}</Text>}
        onPress={() => { logout() }}
        style={focusedRoute.name === 'logout' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'logout' ? styles.selectedLabel : null}
        icon={() => (
          <Image source={require('../../assets/images/logout.png')} style={styles.drawerIcon} />
        )}
      />

    </DrawerContentScrollView>
  );
};
const SellNavigationDrawer = ({ route }) => {
  console.log("datas", route.params?.userData );
  const [userData, setUserData] = useState([]);
  const [profile,setProfile] = useState('')

  React.useEffect(() => {
    fetchUserData()
    // banner()
    // categories()
 },[])

 const fetchUserData = async () => {
  try {
    const accessToken = await getAccessToken(); 

    const response = await axios.get(
      `${BASE_URL}/user`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'x-api-key': API_KEY,
          'Accept-Language': ACCEPT_LANGUAGE,
        },
      }
    );
    console.log("navvv",response.data.data.userName);
    setUserData(response.data.data.userName)
    setProfile(response.data.data.image)
  } catch (error) {
    console.error('Error fetching user data:', error.response.data);
  }
};
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="homepagesell"
      drawerContent={(props) => <CustomDrawerContent {...props} userData={userData} profile={profile}/>}
    >
      <Drawer.Screen name="homepagesell" component={HomePageSell}
        initialParams={{
          bannerData: route.params?.bannerData || [],
          userData: route.params?.userData || [],
          categoriesData: route.params?.categoriesData || [],
        }} />

    </Drawer.Navigator>
  )
}
const styles = StyleSheet.create({
  headerContainer: {

    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomColor: 'black',
    borderBottomWidth: 0.5
  },
  profileImage: {
    width: 55,
    height: 60,
    borderRadius: 25,
    marginRight: 16,
  },
  textContainer: {
    flexDirection: 'column',
  },
  drawerIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  selectedItem: {
    backgroundColor: '#62A845',
  },
  selectedLabel: {
    color: '#fff',
    
  },
  drawerLabel: {
    color: 'black',
    fontSize: 14,
    flexShrink: 1,       // allows text to shrink
    flexWrap: 'wrap',    // allows multi-line
    width: '85%',        // prevents overflow near icon
  },
});
export default SellNavigationDrawer;