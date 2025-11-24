import React, { useState, useEffect, useRef } from "react";
import { View, Animated, Dimensions, StyleSheet, Image, Text, TouchableOpacity, Alert, FlatList, Linking } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { PageIndicator } from 'react-native-page-indicator';
import axios from "axios";
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, IMG_URL, getAccessToken, getAcceptLanguage } from "../Api/apiConfig";
import { BackHandler } from 'react-native';
import RNFS from 'react-native-fs';
import { useLanguage } from "../Api/LanguageContext";

const HomePageBuy = ({ navigation, navigation: { goBack } }) => {
  const [userData, setUserData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const localImagePath = require('../../assets/images/example.jpg');
  const scrollX = useRef(new Animated.Value(0)).current;
  const width = Dimensions.get('window').width;
  const { languageData } = useLanguage();

  // const imagePaths = bannerData.data.map(item => item.image);

  // const imagePaths = Array(4).fill(localImagePath);
  // const scrollX = new Animated.Value(0);
  // const width = Dimensions.get('window').width;
  // const animatedCurrent = Animated.divide(scrollX, width);
  // const [currentPage, setCurrentPage] = useState(0);
  // const [scrollX, setScrollX] = useState(new Animated.Value(0));
  // const [animatedCurrent, setAnimatedCurrent] = useState(0);


  useEffect(() => {
    fetchData();
  }, []);
  // useEffect(() => {
  //   const handleScroll = (event) => {
  //     const { contentOffset, layoutMeasurement } = event.nativeEvent;
  //     const currentIndex = Math.floor(contentOffset.x / layoutMeasurement.width);
  //     setAnimatedCurrent(currentIndex);
  //   };

  //   scrollX.addListener(handleScroll);

  //   return () => {
  //     scrollX.removeListener(handleScroll);
  //   };
  // }, [scrollX]);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const fetchData = async () => {
    try {
      await fetchUserData();
      await categories();
      await banner();

    } catch (error) {
      console.error('Error fetching data:', error);
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
      setUserData(response.data.data)
     // if (!response.data.data.isSubscribed && !response.data.data.isTrailPeriod) {

        Alert.alert(
          "Alert",
          "Cattle are for agriculture, Rearing and dairy farming only ",
          [
            {
              text: "OK",
              onPress: () => {

              },
            },
          ],
          { cancelable: false }
        );
   //   }

    } catch (error) {
      console.error('Error fetching user data:', error.response.data);
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
      setBannerData(response.data.data)
      console.log("banner", bannerData);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  };

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
  const handleBannerPress = (url) => {
    if (url) {
      // Check if the URL has a protocol, if not, add 'http://'
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'http://' + url;
      }
      Linking.openURL(url).catch((error) => console.error('Failed to open URL:', error));
    }
  };


  const menu = () => {
    navigation.toggleDrawer();
  }
  const handleCategoryPress = (item) => {
    navigation.navigate('buycategories', { id: item._id });
    //   subCategories(item)
  }

  const Sellscreen = () => {
    navigation.navigate('sellnavigationdrawer');
  }

  updateSearch = (search) => {
    this.setState({ search });
  };
  const handleSearch = (text) => {
    // Handle search logic here
  };
  return (
    <View style={styles.body}>
      <View style={styles.rectangle}>
        <TouchableOpacity onPress={() => menu()}>
          <Image style={styles.menu}
            source={require('../../assets/images/menu.png')} />
        </TouchableOpacity>
        {/* <Image style={styles.back}
     source={require('../../assets/images/logohome.png')} /> */}
        <View style={{ alignItems: "center", flexDirection: "row", width: "80%", justifyContent: 'space-between', }}>
          <View style={{ flexDirection: 'column', left: '90%', padding: 10 }}>
            <Image style={styles.back}
              source={require('../../assets/images/logohome.png')} />
            <Text style={{ fontSize: 8, fontWeight: 600, color: 'black' }}>
              The Rural E-Market Place
            </Text>
          </View>
          {/* <View style={{ flexDirection: 'column' ,}}>
      <Text style={styles.logintext}>
      Village Link
      </Text>
      <Text style={{ fontSize: 10, fontWeight: 400,color:'black' }}>
      The Rural E-Market Place
      </Text>
     </View> */}
          <View style={{ flexDirection: 'row', alignItems: 'center',  }}>
            <TouchableOpacity onPress={() => Sellscreen()} >
              <Image style={styles.buy}
                source={require('../../assets/images/sell.png')} />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => navigation.navigate('buynotification')}>
        <Image style={styles.image}
          source={require('../../assets/images/notificationicon.png')} />
      </TouchableOpacity>
      */}

          </View>
        </View>
      </View>

      <View style={{ width: '90%', top: '5%', left: 20 }}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() =>
            navigation.navigate('commonfilter', { type: 'buy' })
          }
        >
          <Image style={styles.searchicon}
            source={require('../../assets/images/searchhome.png')} />
          <Text style={{ fontSize: 14, right: 70, top: 9, fontWeight: '400', color: 'black' }} >
            {languageData?.buy_screen?.search_placeholder}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: '30%', top: '7%' }}>
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {bannerData?.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleBannerPress(item.url)}>
              <View style={{ width, paddingRight: 20, paddingLeft: 20 }}>
                <Image source={{ uri: `${IMG_URL}${item.image}` }} style={styles.banner} />
              </View>
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
        <View style={{ bottom: '20%' }}>
          <PageIndicator
            style={styles.pageIndicator}
            count={bannerData.length}
            current={Animated.divide(scrollX, width)}
          />
        </View>
      </View>
      <Text style={{ fontSize: 18, fontWeight: '700', left: 20, top: '2%', color: '#303733' }}>
        {languageData?.buy_screen?.categories_text}
      </Text>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: '8%' }}>
        <FlatList
          style={{ top: '5%' }}
          data={categoriesData}
          keyExtractor={(item) => item._id}
          numColumns={2} // Adjust the number of columns as needed
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isProductCountZero = item.status === false; // Check if product count is 0
            return (
              <View style={{ marginBottom: 20, marginHorizontal: 10 }}>
                <TouchableOpacity
                  style={{
                    height: 125,
                    width: 150,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 10,
                    elevation: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: 10,
                    overflow: 'hidden', // Ensure the overlay doesn't go outside the container
                  }}
                  onPress={() => handleCategoryPress(item)} // Disable click if product count is 0
                // activeOpacity={isProductCountZero ? 1 : 0.7} // Make the touchable not respond to presses if product count is 0
                >
                  <Image
                    style={styles.livestocks}
                    source={{ uri: `${IMG_URL}${item.image}` }}
                  />
                  <Text style={styles.categoriesText} numberOfLines={2}>{item.title}</Text>
                  {isProductCountZero && (
                    <View style={styles.overlay} />
                  )}
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>

    </View>
  )
}
const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    flex: 1,
    padding: '5%'
  },
  rectangle: {
    flexDirection: "row",
    width: "90%",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    top: 10,
    marginHorizontal: '5%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(140, 149, 159, 0.2)', // Semi-transparent gray overlay
  },
  menu: {
    height: 24,
    width: 24,
  },
  livestocks: {
    height: 70,
    width: 120
  },
  categoriesText: {
    fontSize: 14,
    top: 5,
    fontWeight: '500',
    color: 'black',
    textAlign: 'center', // Center the text
    flexWrap: 'wrap',

  },
  buy: {
    height: 30,
    width: 60,

  },
  banner: {
    height: '85%',
    width: '90%',
    borderRadius: 20
  },
  searchButton: {
    height: 40,
    backgroundColor: '#EFF1F3',
    borderRadius: 20,
    borderRadius: 25,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    flexDirection: 'row',

  },

  back: {
    height: 30,
    width: 90,

  },
  logintext: {
    fontSize: 16,
    fontWeight: '400',

    color: '#539F46'
  },
  image: {
    width: 30,
    height: 30,
    left: 5
  },
  searchicon: {
    width: 30,
    height: 30,
    top: 5,
    right: 30,
    tintColor: 'grey'


  },
  pageIndicator: {
    position: 'absolute',
    top: '85%',
    left: 0,
    right: 0,
  },


})
export default HomePageBuy;