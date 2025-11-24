import React, { useState, useEffect } from "react";
import { View, Animated, Dimensions, StyleSheet, Image, Text, TouchableOpacity, Share } from "react-native";
import { SearchBar } from 'react-native-elements';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { PageIndicator } from 'react-native-page-indicator';
import LinearGradient from 'react-native-linear-gradient';
import { Alert, Linking } from 'react-native';
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, IMG_URL, getAccessToken,getAcceptLanguage } from "../Api/apiConfig";
import axios from "axios";
import Video from 'react-native-video';
import RNFS from 'react-native-fs';


const screenWidth = Dimensions.get('window').width;

const BuyingDetails = ({ navigation, navigation: { goBack }, route }) => {

  const localImagePath = require('../../assets/images/girlist.png');

  const imagePaths = Array(4).fill(localImagePath);
  const scrollX = new Animated.Value(0);
  const width = Dimensions.get('window').width;
  const animatedCurrent = Animated.divide(scrollX, width);
  const [currentPage, setCurrentPage] = useState(0);
  const [productDetails, setProductDetails] = useState([]);
  const [isHeartClicked, setHeartClicked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);

  const [isFullScreen, setIsFullScreen] = useState(false); // State to track full screen mode
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); // State to track video playback
  const [languageData, setLanguageData] = useState(null);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const loadLang = async () => {
      const storedLang = await getAcceptLanguage();
      setLang(storedLang);
    };
    loadLang();
  }, []);
  useEffect(() => {
      const filePath = `${RNFS.DocumentDirectoryPath}/languageData.json`;
  
      RNFS.readFile(filePath, 'utf8')
        .then((data) => {
          setLanguageData(JSON.parse(data)); 
        })
        .catch((error) => {
          console.error("Error reading file:", error);
        });
  }, []);
  const handleVideoPress = () => {
    // Toggle full screen mode when play button is clicked
    setIsFullScreen(true);
    // Start playing the video
  };
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


  // const handleVideoPress = () => {
  //   // Toggle full screen mode
  //   setIsFullScreen(!isFullScreen);
  // };

  const handleSubmit = () => {
    if (productDetails.attributes && productDetails.attributes.length > 0) {
      const phoneNumberAttribute = productDetails.attributes.find(attr => attr.key === 'phonenumber');
      if (phoneNumberAttribute) {
        const phoneNumber = phoneNumberAttribute.value;
        console.log("ph", phoneNumber);

        // Show an alert to choose how to contact
        Alert.alert(
          'Enquiry',
          'How would you like to contact?',
          [
            {
              text: 'WhatsApp',
              onPress: () => {
                // Open WhatsApp with a predefined message
                Linking.openURL(`https://wa.me/+91${phoneNumber}?text=I%20am%20interested%20in%20your%20product-${productDetails.productId}.`);
              },
            },
            {
              text: 'Phone Number',
              onPress: () => {
                // Call the phone number
                Linking.openURL(`tel:+91${phoneNumber}`);
              },
            },
          ],
          { cancelable: true }
        );
      }
    }
  };
  const itemDetails = async () => {
    try {
      const accessToken = await getAccessToken();
      const lang = await getAcceptLanguage();

      const response = await axios.get(
        `${BASE_URL}/product/${Id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': API_KEY,
            'Accept-Language': lang,
          },
        }
      );
      console.log(" Details list", response.data.data);
      setProductDetails(response.data.data)

    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  };
  const handleHeartClick = async () => {
    try {

      const accessToken = await getAccessToken();
      const lang = await getAcceptLanguage();

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
            'Accept-Language': lang,
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

  const shareListing = async () => {
    try {
      const url = 'http://34.202.39.56/api/v1/your-listing-url'; // Replace 'your-listing-url' with the actual URL of your listing
      const result = await Share.share({
        message: url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared via other apps
        } else {
          // Shared successfully
        }
      } else if (result.action === Share.dismissedAction) {
        // Share sheet dismissed
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  const handleSharePress = () => {
    shareListing();
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
    <LinearGradient colors={["#FFFFFF", "#FFFFFF"]} style={styles.body}>
      {productDetails && productDetails.images && productDetails.images.length > 0 && (
        <>
          {/* Back Button */}
          <TouchableOpacity onPress={() => goBack()} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, top: 25 }}>
            <Image style={styles.backIcon} source={require('../../assets/images/backfilter.png')} />
          </TouchableOpacity>

          {/* Image and Video Carousel */}
          <View style={styles.carouselContainer}>
            <Animated.ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
              )}>
              {productDetails.images.map((image, index) => (
                <View key={index} style={{ width,paddingHorizontal:20 ,}}>
                  <Image source={{ uri: `${IMG_URL}${image}` }} style={styles.banner} />
                </View>
              ))}
              {productDetails.video ? (
                <TouchableOpacity onPress={handleVideoPress}  style={{ width: screenWidth, paddingRight: 20, paddingLeft: 20 }}>
                  <Video
                    source={{ uri: `${IMG_URL}${productDetails.video}` }}
                    style={styles.banner}
                    controls={true}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ) : null}
            </Animated.ScrollView>
            <View style={styles.pageIndicatorContainer}>
              <PageIndicator
                style={styles.pageIndicator}
                count={productDetails.images.length}
                current={animatedCurrent}
              />
            </View>
          </View>

          {/* Scrollable Content */}
          <View style={styles.scrollContent}>
            {/* Title and Price */}
            <View style={styles.titleContainer}>
              <Text style={styles.productTitle}>{productDetails?.title} - {productDetails?.subsubcategory?.title?.[lang]}</Text>
              <Text style={styles.productPrice}>₹ {productDetails.price}</Text>
            </View>

            {/* Product ID and Time */}
            <View style={styles.timeContainer}>
              <View style={{ top: '12%', flexDirection: 'row' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: 'black' }}>
                {languageData?.amritmahal_product_detail_screen?.product_id} :
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: 'black' }}>
                  {" " + productDetails.productId}
                </Text>
              </View>
              {/* <Text style={styles.textLabel}>Product ID: </Text> */}
              {/* <Text style={styles.textLabelValue}>{productDetails.productId}</Text> */}
              <View style={styles.timeDetails}>
                <Image style={styles.icon} source={require('../../assets/images/timedetails.png')} />
                <Text style={styles.textLabel}>{calculateTimeDifference(productDetails.createdAt)}</Text>
              </View>
            </View>

            {/* Location Details */}
            <View style={styles.locationContainer}>
              <Image style={styles.icon} source={require('../../assets/images/locationdetails.png')} />
              <Text style={styles.textLabelValue}>{productDetails.place}</Text>
            </View>

            {/* User Details */}
            <View style={styles.userContainer}>
              <Image style={styles.icon} source={require('../../assets/images/userdetails.png')} />
              <Text style={styles.textLabelValue}>{productDetails?.user?.userName}</Text>
            </View>

            {/* Description */}
            {/* <ScrollView contentContainerStyle={styles.scrollContent}> */}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.descriptionTitle}>
              {languageData?.amritmahal_product_detail_screen?.description_field} 
              </Text>
              <View style={styles.referalInput}>
                <ScrollView>
                  <Text style={styles.descriptionText}>
                    {productDetails.description}
                  </Text>
                </ScrollView>
              </View>

            </View>
            {/* </ScrollView> */}
          </View>

          {/* Bottom Buttons */}
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity onPress={handleHeartClick} style={styles.heartButton}>
              <Image style={[styles.heartIcon, isHeartClicked ? styles.heartIconActive : null]} source={require('../../assets/images/detailsheart.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.enquiryButton} onPress={() => { handleSubmit() }}>
              <Text style={styles.enquiryButtonText}>{languageData?.amritmahal_product_detail_screen?.enquire_button_text}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  body: { flex: 1,paddingVertical:'5%'},
  backButton: { position: 'absolute', left: 16, top: 25, zIndex: 10 },
  backIcon: { width: 40, height: 40 },

  carouselContainer: { height: '30%', top: '5%',},
  imageContainer: { width: '100%', paddingHorizontal: 20 },
  banner: { height: '100%', width: '100%', borderRadius: 20 },

  scrollContent: { flex: 1, paddingHorizontal: 20, marginTop: '10%' },

  titleContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  productTitle: { fontSize: 18, fontWeight: '700', color: 'black', width: '75%' },
  productPrice: { fontSize: 18, fontWeight: '700', color: 'black' },

  timeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  timeDetails: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 20, height: 20, marginRight: 6 },
  textLabel: { fontSize: 14, fontWeight: '400', color: '#64748B' },
  textLabelValue: { fontSize: 14, fontWeight: '400', color: 'black' },

  locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  userContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },

  descriptionContainer: { marginTop: 20 },
  descriptionTitle: { fontSize: 16, fontWeight: '500', color: 'black' },
  descriptionBox: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#539F46', borderRadius: 5, padding: 10 },
  descriptionText: {
    fontSize: 13,
    fontWeight: '300',
    color: 'black',
    padding: 10
  },
  pageIndicatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },pageIndicator: {
    position: 'absolute',
    top: '80%',
    left: 0,
    right: 0,
    color: '#62A845',
  },

  referalInput: {
    flexDirection: "row",
    borderWidth: 1,
    height: 100,
    borderColor: "#ffffff",
    borderRadius: 2,
    backgroundColor: 'white',
    top: 10,
    elevation: 5,
    shadowColor: 'black',
    marginBottom: 25,
    borderColor: '#539F46',
    borderRadius: 5,
  },
  bottomButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, position: 'absolute', bottom: 0, width: '100%' },
  heartButton: { marginRight: 20 },
  heartIcon: { width: 40, height: 40 },
  heartIconActive: { tintColor: '#f70f11' },

  enquiryButton: { flex: 1, borderRadius: 25, backgroundColor: '#62A845', paddingVertical: 15, alignItems: 'center' },
  enquiryButtonText: { fontSize: 18, color: 'white', fontWeight: '600' }
});

export default BuyingDetails;