import React,{useState} from "react";
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity,BackHandler } from "react-native";
// import WebView from 'react-native-webview';
import axios from "axios";
import { BASE_URL,API_KEY,ACCEPT_LANGUAGE,getAccessToken } from "./Api/apiConfig";

const BuyOrSell = ({navigation, navigation: { goBack }}) => {
  const [bannerData, setBannerData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [categoriesData,setCategoriesData] = useState ([]);

  React.useEffect(() => {
    fetchUserData()
    banner()
    categories()
 },[])

 const categories = async () => {
  try {
    const accessToken = await getAccessToken(); 

    const response = await axios.post(
      `${BASE_URL}/category`,
      {
        "keyword" : "",
        "skip" : 0,
        "limit" : 10
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
   setCategoriesData(response.data.data.list)
   
  } catch (error) {
    console.error('Error fetching subscription data:', error);
  }
};

const banner = async () => {
    try {
      const accessToken = await getAccessToken(); 

      const response = await axios.get(
        `${BASE_URL}/banner`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': API_KEY,
            'Accept-Language': ACCEPT_LANGUAGE,
          },
        }
      );
      setBannerData(response.data)
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  };

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
      setUserData(response.data)
    } catch (error) {
      console.error('Error fetching user data:', error.response.data);
    }
  };
  const buy = () => {
    navigation.navigate('buynavigationdrawer');
  }
  const sell = () => {
    console.log("sendbanner",userData);
    navigation.navigate('sellnavigationdrawer', { bannerData:bannerData.data, userData:userData, categoriesData:categoriesData });
  }
  const handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  };
  return (
    <View style={styles.body}>
      <TouchableOpacity
        style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 16, top: 25 }}
        onPress={handleBackPress}
      >
      <Image style={{width:40,height:40}} source={require('../assets/images/backround.png')} />
      </TouchableOpacity>
      <View style={{alignItems:'center',justifyContent:'center',flex:1,marginBottom:50}}>
        <Text style={styles.locationtext}>
        What are you looking for?
        </Text>
        <View style={{flexDirection:'column',  width: '100%',justifyContent:'center',alignItems:'center',top:20}}>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => { buy() }}>
          <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
         Buy
          </Text>

        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sellButton}
          onPress={() => { sell() }}>
          <Text style={{ fontSize: 18, color: 'white',fontWeight: '600' }}>
         Sell
          </Text>

        </TouchableOpacity>

        </View>

      </View>
      
    </View>
  )
}
const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    flex: 1,
    
  },
  locationtext: {
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
   
  },
  buyButton: {
    backgroundColor: '#62A845',
    paddingVertical: 10,
    width:'70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems:'center'
  },
  sellButton: {
    backgroundColor: '#62A845',
    paddingVertical: 10,
    width:'70%',
    borderRadius: 25,
    justifyContent:'center',
    alignItems:'center',
    top:20
  }

})
export default BuyOrSell;