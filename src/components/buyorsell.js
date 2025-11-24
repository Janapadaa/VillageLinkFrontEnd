import React, { useState,useEffect } from "react";
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity, BackHandler } from "react-native";
// import WebView from 'react-native-webview';
import axios from "axios";
import { BASE_URL, API_KEY, ACCEPT_LANGUAGE, getAccessToken,getAcceptLanguage } from "./Api/apiConfig";
import RNFS from 'react-native-fs';
import { useLanguage } from "./Api/LanguageContext";
const BuyOrSell = ({ navigation, navigation: { goBack } }) => {
  const [bannerData, setBannerData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
      const { languageData } = useLanguage();
 
  React.useEffect(() => {
    fetchUserData()
    banner()
    categories()
  }, [])

  const categories = async () => {
    try {
      const accessToken = await getAccessToken();
      const lang = await getAcceptLanguage();

      const response = await axios.post(
        `${BASE_URL}/category`,
        {
          "keyword": "",
          "skip": 0,
          "limit": 10
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': API_KEY,
            'Accept-Language': lang,
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
      const lang = await getAcceptLanguage();

      const response = await axios.get(
        `${BASE_URL}/banner`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': API_KEY,
            'Accept-Language': lang,
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
      const lang = await getAcceptLanguage();

      const response = await axios.get(
        `${BASE_URL}/user`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': API_KEY,
            'Accept-Language': lang,
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
    console.log("sendbanner", userData);
    navigation.navigate('sellnavigationdrawer', { bannerData: bannerData.data, userData: userData, categoriesData: categoriesData });
  }
  const handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  };
  return (
    <View style={styles.body}>
      <View
        style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, top: 25 }}>
        <Image style={styles.back}
          source={require('../assets/images/logohome.png')} />
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.logintext}>
            Village Link
          </Text>
          <Text style={{ fontSize: 8, fontWeight:800, left: '10%',color: 'black' }}>
            The Rural E-Market Place
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginBottom: 50 }}>
        <Text style={styles.locationtext}>
        {languageData?.buy_sell_decide_screen?.title}
        </Text>
        <View style={{ flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center', top: 20 }}>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => { buy() }}>
            <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
            {languageData?.buy_sell_decide_screen?.buy_button_text}
            </Text>

          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sellButton}
            onPress={() => { sell() }}>
            <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
            {languageData?.buy_sell_decide_screen?.sell_button_text}
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
  back: {
    height: 70,
    width: 70,
    left: '2%'
  },
  locationtext: {
    fontSize: 16,
    fontWeight: '700',
    color: 'black',

  },
  logintext: {
    fontSize: 14,
    fontWeight: '400',
    left: '10%',
    color: '#539F46'
  },
  buyButton: {
    backgroundColor: '#62A845',
    paddingVertical: 10,
    width: '70%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sellButton: {
    backgroundColor: '#62A845',
    paddingVertical: 10,
    width: '70%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    top: 20
  }

})
export default BuyOrSell;