import React ,{useState} from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Language from "../language";
import HomePageSell from "../sell/homepagesell";
import { View, Text, Image, StyleSheet,Alert } from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import HomePageBuy from "../Buy/Homepagebuy";
import BuyNotification from "../Buy/BuyNotification";
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, clearAccessToken, getAccessToken } from "../Api/apiConfig";
import axios from "axios";
import { useRoute } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation, state,userData }) => {

  const route = useRoute();
  const [userName, setUserName] = useState('Guest');
  React.useEffect(() => {
    // if (userData.length > 0) {
      setUserName(userData);
    // }
  }, [userData]);

  const logout = async () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await clearAccessToken();
           handleBackPress()
          },
        },
      ],
      { cancelable: true }
    );
  };
  const handleBackPress = () => {
    navigation.navigate('otpscreen');
  };
    const focusedRoute = state.routes[state.index];    return (
      <DrawerContentScrollView>
        {/* Your custom header design */}
        <View style={styles.headerContainer}>
          <Image source={require('../../assets/images/account.png')} style={styles.profileImage} />
          <View style={styles.textContainer}>
            <Text style={styles.profileName}>{userName}</Text>
            <TouchableOpacity onPress={() =>navigation.navigate('createprofile',{type:"view"})}>
            <Text style={{fontSize:14,color:'#62A845'}}>View profile</Text>
            </TouchableOpacity>
            

            {/* Add any other details or components you want */}
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
      <DrawerItem
        label="Notifications"
        onPress={() => navigation.navigate('buynotification')}
        style={focusedRoute.name === 'notifications' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'notifications' ? styles.selectedLabel : null}
        icon={() => (
            <Image source={require('../../assets/images/notifications.png')} style={styles.drawerIcon} />
          )}
      />
       <DrawerItem
        label="WishList"
        onPress={() => navigation.navigate('buywishlist')}
        style={focusedRoute.name === 'wishlist' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'wishlist' ? styles.selectedLabel : null}
        icon={() => (
            <Image source={require('../../assets/images/favmenu.png')} style={styles.drawerIcon} />
          )}
      />
      <DrawerItem
        label="My Ads"
        onPress={() => navigation.navigate('buymyads')}
        style={focusedRoute.name === 'myads' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'myads' ? styles.selectedLabel : null}
        icon={() => (
            <Image source={require('../../assets/images/adsmenu.png')} style={styles.drawerIcon} />
          )}
      />
       <DrawerItem
        label="Customer Support"
        onPress={() => navigation.navigate('buycustomersupport')}
        style={focusedRoute.name === 'customersupport' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'customersupport' ? styles.selectedLabel : null}
        icon={() => (
            <Image source={require('../../assets/images/customer-support.png')} style={styles.drawerIcon} />
          )}
      />
      <DrawerItem
        label="Referral Code"
        onPress={() => navigation.navigate('buyreferralcode')}
        style={focusedRoute.name === 'referralcode' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'referralcode' ? styles.selectedLabel : null}
        icon={() => (
            <Image source={require('../../assets/images/referralmenu.png')} style={styles.drawerIcon} />
          )}
      />
       <DrawerItem
        label="My Contacts"
        onPress={() => navigation.navigate('contacts')}
        style={focusedRoute.name === 'contact' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'contact' ? styles.selectedLabel : null}
        icon={() => (
            <Image source={require('../../assets/images/contacts.png')} style={styles.drawerIcon} />
          )}
      />
      <DrawerItem
        label="Payments"
        onPress={() => navigation.navigate('buypayments')}
        style={focusedRoute.name === 'payments' ? styles.selectedItem : null}
        labelStyle={focusedRoute.name === 'payments' ? styles.selectedLabel : null}
        icon={() => (
            <Image source={require('../../assets/images/walletmenu.png')} style={styles.drawerIcon} />
          )}
      />
       <DrawerItem
        label="Logout"
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
  const BuyNavigationDrawer = ({ route }) => {
    console.log("datas", route.params?.userData );
    const [userData, setUserData] = useState([]);
  
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
      console.log("navvuv",response.data.data.userName);
      setUserData(response.data.data.userName)
    } catch (error) {
      console.error('Error fetching user data:', error.response.data);
    }
  };
        return (
        <Drawer.Navigator screenOptions={{headerShown:false}}
        initialRouteName="homepagebuy"
        drawerContent={(props) => <CustomDrawerContent {...props} userData={userData}/>}
        >
               
                <Drawer.Screen name="homepagebuy" component={HomePageBuy}/>
                
        </Drawer.Navigator>
    )
}
const styles = StyleSheet.create({
    headerContainer: {
       
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#fff', 
      borderBottomColor:'black',
      borderBottomWidth:0.5
    },
    profileImage: {
      width: 50,
      height: 50,
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
      color: '#000', // Change the text color as needed
    },
    selectedItem: {
        backgroundColor: '#62A845',
      },
      selectedLabel: {
        color: '#fff',
      },
  });
export default BuyNavigationDrawer;