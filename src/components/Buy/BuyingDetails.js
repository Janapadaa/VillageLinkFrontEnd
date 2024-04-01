import React, { useState,useEffect } from "react";
import { View, Animated, Dimensions, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { SearchBar } from 'react-native-elements';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { PageIndicator } from 'react-native-page-indicator';
import LinearGradient from 'react-native-linear-gradient';
import { Alert,Linking } from 'react-native';
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, IMG_URL, getAccessToken } from "../Api/apiConfig";
import axios from "axios";
const BuyingDetails = ({ navigation, navigation: { goBack } ,route}) => {

  const localImagePath = require('../../assets/images/girlist.png');

  const imagePaths = Array(4).fill(localImagePath);
  const scrollX = new Animated.Value(0);
  const width = Dimensions.get('window').width;
  const animatedCurrent = Animated.divide(scrollX, width); 
  const [currentPage, setCurrentPage] = useState(0);
  const [productDetails,setProductDetails]=useState([]);
  const [isHeartClicked, setHeartClicked] = useState(false);


  const Id = route?.params?.id;
console.log(Id);

  useEffect(() => {
    itemDetails()
}, [])
useEffect(() => {
  if (productDetails.favourites === 1) {
    setHeartClicked(true);
  }
}, [productDetails]);

const itemDetails = async () => {
  try {
    const accessToken = await getAccessToken(); 
      const response = await axios.get(
        `${BASE_URL}/product/${Id}`,
        {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                  'x-api-key': API_KEY,
                  'Accept-Language': ACCEPT_LANGUAGE,
              },
          }
      );
      console.log(" Details list",response.data.data.description);
      setProductDetails(response.data.data)
     
  } catch (error) {
      console.error('Error fetching subscription data:', error);
  }
};
const handleHeartClick = async () => {
  try {
     
      const accessToken = await getAccessToken();
      const response = await axios.post(
        `${BASE_URL}/product/favourites`,
        {
           "productId": Id,           
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
    console.log("FAV", response.data.message);
    setHeartClicked(!isHeartClicked);

    Alert.alert('Favorites', response.data.message);

  } catch (error) {
      console.error('Error adding to favorites:', error);
  }
};


  const menu = () => {
    navigation.toggleDrawer();
  }
  const livestock = () => {
    navigation.navigate('buycategories');
  }
  const Sellscreen = () => {
    navigation.navigate('buyorsell');
  }

  updateSearch = (search) => {
    this.setState({ search });
  };
  const handleSubmit = () => {
    Alert.alert(
      'Enquiry',
      'How would you like to contact?',
      [
        {
          text: 'WhatsApp',
          onPress: () => {
            // Open WhatsApp with a predefined message
            Linking.openURL('https://wa.me/8637459549?text=I%20am%20interested%20in%20your%20product.');
          },
        },
        {
          text: 'Phone Number',
          onPress: () => {
            // Call the phone number
            Linking.openURL('tel:+91 8637459549');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const calculateTimeDifference = (createdAt) => {
    const currentTime = new Date();
    const createdAtTime = new Date(createdAt);
    const timeDifference = currentTime - createdAtTime;
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60)); // Convert milliseconds to hours

    if (hoursDifference < 24) {
        return `${hoursDifference} hours ago`;
    } else {
        const daysDifference = Math.floor(hoursDifference / 24);
        return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
    }
};
  return (
    <LinearGradient
      colors={["#e2f0dd", "#FFFFFF"]}
      style={styles.body}>
{productDetails && productDetails.images && productDetails.images.length > 0 && (
        <>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => goBack()} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, top: 25 }}>
              <Image style={{ width: 40, height: 40 }} source={require('../../assets/images/backfilter.png')}/>
            </TouchableOpacity>
          </View>

          <View style={{ height: '30%', top: 50 }}>
            <Animated.ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
              )}
            >
              {/* Render images from API response */}
              {productDetails.images.map((image, index) => (
                <View key={index} style={{ width, paddingRight: 20, paddingLeft: 20 }} >
                  <Image  source={{ uri: `${IMG_URL}${image}` }} style={styles.banner} />
                </View>
              ))}
            </Animated.ScrollView>
            {/* Page Indicator */}
            <PageIndicator
              style={styles.pageIndicator}
              count={productDetails.images.length}
              current={animatedCurrent}
            />
          </View>

      <View style={{ top: '5%', flex: 1, marginLeft: 20, marginRight: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
          <Text style={{ fontSize: 18, fontWeight: '700', top: '8%', color: 'black' }}>
            {productDetails.title}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '700', top: '8%', color: 'black' }}>
            ₹ {productDetails.price}
          </Text>
        </View>
        
        <View style={{  top: 10,left:10 }}>

          <View style={{ flexDirection: 'row', top: 20 }}>
            <Image style={{ height: 20, width: 20, top: 10, right: 5 }}
              source={require('../../assets/images/timedetails.png')} />
            <Text style={{ fontSize: 14, fontWeight: '400', top:'3%',left:5, color: '#64748B' }}>
            {calculateTimeDifference(productDetails.createdAt)} 
            </Text>
          </View>

          <View style={{ flexDirection: 'row', top: '10%' }}>
            <Image style={{ height: 20, width: 20, top: 10, right: 5 }}
              source={require('../../assets/images/locationdetails.png')} />
            <Text style={{ fontSize: 14, fontWeight: '400', top: '3%', color: '#64748B' }}>
              {productDetails.place}
            </Text>
          </View>
          {/* <View style={{ flexDirection: 'row', top: 20 }}>
            <Image style={{ height: 20, width: 20, top: 10, right: 5 }}
              source={require('../../assets/images/agedetails.png')} />
            <Text style={{ fontSize: 14, fontWeight: '400', top: '12%', color: '#64748B' }}>
              Age 1 year
            </Text>
          </View> */}

        </View>
        <View style={{ flexDirection: 'row', top: '12%', left: 10 }}>
          <Image style={{ height: 20, width: 20, top: '8%', right: 5 }}
            source={require('../../assets/images/userdetails.png')} />
          <Text style={{ fontSize: 14, fontWeight: '400', top: '8%', color: '#64748B' }}>
            {productDetails.user.userName}
          </Text>
          {/* <View style={{ backgroundColor: '#539F46', width: 60, borderRadius: 10, padding: 2, alignItems: 'center',flexDirection:'row',top:27,left:10 }}>
          <Image style={{ height: 15, width: 15,}}
            source={require('../../assets/images/sharedetails.png')} />
            <Text style={{ fontSize: 12,left:3, color: 'white' }}>
              Share
            </Text>
          </View> */}
        </View>
        <View>
        <View style={{ marginTop:'25%' }}>
          <Text style={{ fontSize: 16, fontWeight: '500',color:'black'  }}>
          Description
          </Text>
          <Text style={{ fontSize: 13, fontWeight: '300',color:'black',top:10  }}>
          {productDetails.description}
          </Text>
          </View>
        </View>



      </View>
      <View style={{

justifyContent: 'space-between',
flexDirection: 'row',
marginHorizontal: 10,
marginBottom: 10

}}>
   <TouchableOpacity onPress={handleHeartClick}>
   <Image style={{ height: 40, width: 40,left:50,top:35,  tintColor: isHeartClicked ? '#f70f11' : undefined,}}
            source={require('../../assets/images/detailsheart.png')} />

</TouchableOpacity>
<TouchableOpacity
    style={styles.backButton}
    onPress={() => { handleSubmit() }}>
    <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
    Enquiry Now
    </Text>

</TouchableOpacity>

</View>
</>
   
   )}
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  body: {

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
  livestocks: {
    height: 40,
    width: 60
  },
  categoriesText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'black'

  },
  buy: {
    height: 30,
    width: 60,

  },
  banner: {
    height: '100%',
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
    right: 60,
  },
  searchicon: {
    width: 30,
    height: 30,
    top: 5,
    right: 30,
    tintColor: 'grey'


  },
  backButton: {
    borderRadius: 25,
    height: 50,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 30,
    borderColor: '#539F46',
    borderWidth: 1,
    backgroundColor:'#62A845'

},
  pageIndicator: {
    position: 'absolute',
    top: '85%',
    left: 0,
    right: 0,
    color: '#62A845',
  },

})
export default BuyingDetails;