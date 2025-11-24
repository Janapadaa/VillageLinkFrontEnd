import React, { useState,useEffect } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, Image, Text, TouchableOpacity, Alert, Linking, BackHandler } from "react-native";
import { SearchBar } from 'react-native-elements';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { PageIndicator } from 'react-native-page-indicator';
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, IMG_URL, getAccessToken,getAcceptLanguage } from "../Api/apiConfig";
import axios from "axios";
import RNFS from 'react-native-fs';
import { useLanguage } from "../Api/LanguageContext";

const BuyMyAds = ({ navigation, navigation: { goBack } }) => {

    const [isWishlistSelected, setWishlistSelected] = useState(false);
    const [adsData, setAdsData] = useState([]);
    const [loading, setLoading] = useState(true);
       const { languageData } = useLanguage();
  

    React.useEffect(() => {
        fetchAdsData()

    }, [])

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          () => {
            navigation.goBack(); 
            return true; 
          }
        );
      
        return () => backHandler.remove();
      }, [navigation]);

    const fetchAdsData = async () => {
        try {
            const accessToken = await getAccessToken(); // Await the token retrieval
            const lang = await getAcceptLanguage();

            const response = await axios.get(
                `${BASE_URL}/user/ads`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'x-api-key': API_KEY,
                        'Accept-Language': lang,
                    },
                }
            );
            console.log(response.data.data);
            setAdsData(response.data.data)
            setLoading(false);

        } catch (error) {
            console.error('Error fetching user data:', error.response);
        }
    };
    const ViewDetails = (categories) => {
        // Handle language selection as needed
        console.log(`Selected language: ${categories}`);
        navigation.navigate('buydetails',{id:categories});
    };
    const Featured = (id,planid) => {  
        console.log("uu",id);    
         navigation.navigate('featured',{id:id,planid:planid});
    };
    const handleWishlistToggle = () => {
        setWishlistSelected(!isWishlistSelected);
    };


    const EnquireSubmit = () => {

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
    }
    const filter = () => {
        navigation.navigate('filter');
    }
    const handleRemoveImage = async (id) => {
        try {
            const accessToken = await getAccessToken(); // Await the token retrieval
            const lang = await getAcceptLanguage();

            const response = await axios.delete(
                `${BASE_URL}/product/delete/${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'x-api-key': API_KEY,
                        'Accept-Language': lang,
                    },
                }
            );
            console.log(response);
            fetchAdsData()
            

        } catch (error) {
            console.error('Error fetching user data:', error.response);
        }
       
    };
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.categoriesBox} onPress={() => ViewDetails(item._id)}>
            {item.images.length > 0 && (
                <View style={styles.imageContainer}>
                    <Image 
                        style={styles.cow} 
                        source={{ uri: `${IMG_URL}${item.images[0]}` }}
                    />
                    <TouchableOpacity 
                        style={styles.deleteIcon} 
                        onPress={() => handleRemoveImage(item._id)}
                    >
                        <Image 
                            source={require('../../assets/images/remove.png')} 
                            style={styles.removeIcon} 
                        />
                    </TouchableOpacity>
                </View>
            )}
                <View style={{ flexDirection: 'row', width: '100%',justifyContent:'space-evenly'}}>
                <View style={{marginRight:'2%',width:'55%'}}>
                    <Text style={styles.categoriesText} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: 'black', top: 5 }}>
                        {item.price}
                    </Text>
                </View>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', top: 6 }}>
                        <Image style={{ width: 10, height: 10 }} source={require('../../assets/images/thumb_up.png')} />
                        <Text style={{ fontSize: 8, fontWeight: '400', color: 'black', left: 5, alignSelf: 'flex-start' }}>
                            {item.likes} Likes
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', top: 7 }}>
                        <Image style={{ width: 10, height: 10 }} source={require('../../assets/images/fav.png')} />
                        <Text style={{ fontSize: 8, fontWeight: '400', color: 'black', left: 5 }}>
                            {item.favourites} Wishlist
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', top: 9 }}>
                        <Image style={{ width: 10, height: 10 }} source={require('../../assets/images/views.png')} />
                        <Text style={{ fontSize: 8, fontWeight: '400', color: 'black', left: 5 }}>
                            {item.views} Views
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{ justifyContent: 'space-evenly', width: '100%', alignItems: 'flex-end', flex: 1, flexDirection: 'row', marginBottom: 15, top: 15 }}>
                <TouchableOpacity style={{ borderWidth: 0.5, width: 50, borderColor: '#539F46', borderRadius: 10, padding: 2, alignItems: 'center' }} onPress={() => ViewDetails(item._id)}>
                    <Text style={{ fontSize: 12, color: 'black' }}>
                        View
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#539F46', width: 90, borderRadius: 10, padding: 2, alignItems: 'center' }} onPress={() => Featured(item.subCategoryId, item._id)}>
                    <Text style={{ fontSize: 12, color: 'white' }}>
                        Featured
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.body}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, top: 25 }}
                    onPress={() => goBack()} >
                    <Image style={{ width: 40, height: 40 }} source={require('../../assets/images/backround.png')} />
                </TouchableOpacity>


            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'center', top: 10, }}>
                <Text style={{ fontSize: 18, fontWeight: '700', top: '8%', color: '#539F46' }}>
                {languageData?.my_listing_screen?.title}

                </Text>


            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#62A845" style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} />
            ) : adsData.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold',color:'black' }}>
                {languageData?.my_listing_screen?.no_ads_found}

                </Text>
              </View>
            ) : (
                <View style={{flex: 1,justifyContent:'center',alignItems:'center',top:'3%'}}>
                    <FlatList
                style={{ top: '5%',marginBottom:'15%' }}
                data={adsData}
               keyExtractor={item => item.id}
               renderItem={renderItem}
               showsVerticalScrollIndicator={false}
               numColumns={2}
           />
                    </View>
                
            )}


        </View>
    )
}
const styles = StyleSheet.create({
    body: {
        backgroundColor: "white",
        flex: 1,
        padding:'5%'
    },
    categoriesBox: {
        position: 'relative',
        width: 150,
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 2,
        borderRadius: 10,
        elevation: 5,
        justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
    top:5
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
    imageContainer: {
        position: 'relative',
       
    }, deleteIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 5,
       
    },
    removeIcon: {
        width: 25,
        height: 25,
    },

    cow: {
        height: 110,
        width: 145,
        borderBottomRightRadius:10,
        borderBottomLeftRadius:10,
        borderTopRightRadius:10,
        borderTopLeftRadius:10
    },

    categoriesText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'black',
        top: 5,
        textAlign:'left',
        flexWrap:'wrap'

    },

    back: {
        height: 25,
        width: 25,
        left: 7
    },

    logintext: {
        fontSize: 16,
        fontWeight: '500',
        left: 20,

    },
    wishlistIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
    },



})
export default BuyMyAds;