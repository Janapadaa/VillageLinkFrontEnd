import React, { useState, useEffect } from "react";
import { View, Animated, Dimensions, StyleSheet, Image, Text, TouchableOpacity, Alert, FlatList, } from "react-native";
import { PageIndicator } from 'react-native-page-indicator';
import axios from "axios";
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, IMG_URL, getAccessToken } from "../Api/apiConfig";
import { BackHandler } from 'react-native';

const HomePageSell = ({ navigation, route }) => {

  const [userData, setUserData] = useState([]);
  const [categoriesData,setCategoriesData] =useState([]);
  const [bannerData, setBannerData] = useState([]);


  useEffect(() => {
      fetchUserData();
      // checkSubscriptionStatus();
      categories()  
      banner()

  }, []);

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
      setBannerData(response.data.data)
     console.log("baner",response.data);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  };

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
      console.log("cat",response.data.data.list);
     setCategoriesData(response.data.data.list)
     
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
      setUserData(response.data.data)
      if (!response.data.data.isSubscribed && !response.data.data.isTrailPeriod) {

        Alert.alert(
          "Subscription Alert",
          "Your subscription has expired. Please renew your subscription.",
          [
            {
              text: "OK",
              onPress: () => {
               
              },
            },
          ],
          { cancelable: false }
        );
      }
      
         } catch (error) {
      console.error('Error fetching user data:', error.response.data);
    }
  };
  const localImagePath = require('../../assets/images/example.jpg');
  // const imagePaths = bannerData.map(item => item.image);

  const imagePaths = Array(4).fill(localImagePath);
   const scrollX = new Animated.Value(0);
  const width = Dimensions.get('window').width;
   const animatedCurrent = Animated.divide(scrollX, width);
  const [currentPage, setCurrentPage] = useState(0);
  // const [scrollX, setScrollX] = useState(new Animated.Value(0));
  // const [animatedCurrent, setAnimatedCurrent] = useState(0);



  const menu = () => {
    navigation.toggleDrawer();
  }
  const handleCategoryPress = (item) => {
    console.log("main_id",item._id);
    navigation.navigate('sellcategories',{id:item._id});
 //   subCategories(item)
  }
//   const handleScroll = (event) => {
//   const { nativeEvent } = event;
//   if (nativeEvent) {
//     const { contentOffset, layoutMeasurement } = nativeEvent;
//     const currentIndex = Math.floor(contentOffset.x / layoutMeasurement.width);
//     setAnimatedCurrent(currentIndex);
//   }
// };

 
  const Buyscreen = () => {
    navigation.navigate('buynavigationdrawer');
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
        <Image style={styles.back}
          source={require('../../assets/images/logohome.png')} />
        <View style={{  alignItems: "center", flexDirection: "row", width: "100%", }}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.logintext}>
              Janapada
            </Text>
            <Text style={{ fontSize: 10, fontWeight: 400, left: 10 }}>
              The farmers marketplace
            </Text>
          </View>
          <View style={{flexDirection:'row',left:'25%'}}>
          <TouchableOpacity onPress={() => Buyscreen()}>
            <Image style={styles.buy}
              source={require('../../assets/images/buy.png')} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('buynotification')}>
          <Image style={styles.image}
            source={require('../../assets/images/notificationicon.png')} />
          </TouchableOpacity>
          </View>
          
        </View>
      </View>
      <View style={{ width: '90%', top: '5%', left: 20 }}>
        <TouchableOpacity
          style={styles.searchButton}
          // onPress={() => 
          // navigation.navigate('commonfilter')}
          >
          <Image style={styles.searchicon}
            source={require('../../assets/images/searchhome.png')} />
          <Text style={{ fontSize: 14, right: 70, top: 8, fontWeight: '400', color: 'black' }} >
            Search by location</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: '30%', top: 50 }}>
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true ,}
          )}

        >
      {bannerData?.map((item, index) => (
    <View key={index} style={{ width, paddingRight: 20, paddingLeft: 20 }}>
      <Image source={{ uri: `${IMG_URL}${item.image}` }} style={styles.banner} />
    </View>
  ))}
        </Animated.ScrollView>
        <View style={styles.pageIndicatorContainer}>
    <PageIndicator
      style={styles.pageIndicator}
      count={bannerData.length}
      current={animatedCurrent}
    />
  </View>

      </View>
      <Text style={{ fontSize: 18, fontWeight: '700', left: 20, top: '8%', color: '#303733' }}>
        Categories
      </Text>
      <View style={{flex: 1,justifyContent:'center',alignItems:'center',top:'3%'}}>
      <FlatList
        style={{ top: '10%', }}
        data={categoriesData}
        keyExtractor={(item) => item._id}
        numColumns={2} // Adjust the number of columns as needed
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              height: 125,
              width: 150,
              backgroundColor: '#FFFFFF',
              borderRadius: 10,
              elevation: 5,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              top:10,
              marginHorizontal:10
              }}
            onPress={() => handleCategoryPress(item)}
          >
            <Image
              style={styles.livestocks}
              source={{ uri: `${IMG_URL}${item.image}` }}
             // source={require('../../assets/images/livestock.png')}
            />
            <Text style={styles.categoriesText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      </View>
      
    </View>
  )
}
const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    flex: 1,


  },
  rectangle: {
    flexDirection: "row",
    width: "90%",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    top: 10,
    left: 10,
  },
  menu: {
    height: 24,
    width: 24,
  },
  livestocks:{
    height:70,
    width:120
  },
  categoriesText: {
    fontSize: 12,
    top:5,
    fontWeight: '500',
    color: 'black'

  },
  buy: {
    height: 30,
    width: 60,

  },
  banner: {
    height: 200,
    width: '100%',
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
    height: 40,
    width: 40,
    left: 7
  },
  logintext: {
    fontSize: 16,
    fontWeight: '400',
    left: 10,
    color: '#539F46'
  },
  image: {
    width: 30,
    height: 30,
    left:5
  },
  searchicon: {
    width: 30,
    height: 30,
    top: 5,
    right: 30,
    tintColor: 'grey'


  },
  pageIndicatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  

})
export default HomePageSell;