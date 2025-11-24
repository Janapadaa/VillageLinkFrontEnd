import React, { useState, useEffect } from "react";
import { View, FlatList, Dimensions, StyleSheet, Image, Text, TouchableOpacity, Alert, Linking, ActivityIndicator, BackHandler } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { PageIndicator } from 'react-native-page-indicator';
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, IMG_URL, getAccessToken,getAcceptLanguage } from "../Api/apiConfig";
import axios from "axios";
import { color } from "react-native-elements/dist/helpers";
import RNFS from 'react-native-fs';

const BuyWishlist = ({ navigation, navigation: { goBack } }) => {

    const [isWishlistSelected, setWishlistSelected] = useState(false);
    const [wishlistData, setWishlistData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [languageData, setLanguageData] = useState(null);
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
    useEffect(() => {
        wishlist()
    }, [])
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          () => {
            navigation.goBack(); 
            return true; 
          }
        );
      
        return () => backHandler.remove();
      }, [navigation]);

    const wishlist = async () => {
        try {
            const accessToken = await getAccessToken();
            const lang = await getAcceptLanguage();

            const response = await axios.get(
                `${BASE_URL}/product/favourites`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'x-api-key': API_KEY,
                        'Accept-Language': lang,
                    },
                }
            );
            setWishlistData(response.data.data)
            console.log("wish", response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching subscription data:', error.data);
        }
    };

    const ViewDetails = (id) => {
        // Handle language selection as needed
        console.log(`Selected ID: ${id}`);
        navigation.navigate('buydetails', { id: id });
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
    const renderItem = ({ item }) => (
        <View style={styles.categoriesBox}>

{item.product.images.length > 0 && (
        <View style={{ position: 'relative' }}>
        <Image 
          style={styles.cow} 
          source={{ uri: `${IMG_URL}${item.product.images[0]}` }}
        />
        <TouchableOpacity style={styles.wishlistIcon} onPress={() => handleWishlistToggle()}>
          <Image style={{ width: 20, height: 20 ,tintColor : '#f70f11'}} source={require('../../assets/images/detailsheart.png')} />
        </TouchableOpacity>
      </View>
        
      )}
                 <View style={{ flexDirection: 'row', width: '100%',justifyContent:'space-evenly'}}>
                <View style={{marginRight:'2%',width:'55%'}}>
                    <Text style={styles.categoriesText} numberOfLines={2}>
                        {item.product.title}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: 'black', top: 5 }}>
                        {item.product.price}
                    </Text>
                </View>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', top: 6 }}>
                        <Image style={{ width: 10, height: 10 }} source={require('../../assets/images/thumb_up.png')} />
                        <Text style={{ fontSize: 8, fontWeight: '400', color: 'black', left: 5, alignSelf: 'flex-start' }}>
                            {item.product.likes} Likes
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', top: 7 }}>
                        <Image style={{ width: 10, height: 10 }} source={require('../../assets/images/fav.png')} />
                        <Text style={{ fontSize: 8, fontWeight: '400', color: 'black', left: 5 }}>
                            {item.product.favourites} Wishlist
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', top: 9 }}>
                        <Image style={{ width: 10, height: 10 }} source={require('../../assets/images/views.png')} />
                        <Text style={{ fontSize: 8, fontWeight: '400', color: 'black', left: 5 }}>
                            {item.product.views} Views
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{ justifyContent: 'space-evenly', width: '100%', alignItems: 'flex-end', flex: 1, flexDirection: 'row', marginBottom: 15, top: 15 }}>
                <TouchableOpacity style={{ borderWidth: 0.5, width: 50, borderColor: '#539F46', borderRadius: 10, padding: 2, alignItems: 'center' }} onPress={() => ViewDetails(item.product._id)}>
                    <Text style={{ fontSize: 12 ,color:'black'}}>
                        View
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#539F46', width: 90, borderRadius: 10, padding: 2, alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: 'white' }}>
                        Enquire Now
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );


    return (
        <View style={styles.body}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, top: 25 }}
                    onPress={() => goBack()} >
                    <Image style={{ width: 40, height: 40 }} source={require('../../assets/images/backround.png')} />
                </TouchableOpacity>
                {/* <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, top: 25 }} onPress={() => filter()}>
                    <Image style={{ width: 40, height: 40 }} source={require('../../assets/images/filter.png')} />
                </TouchableOpacity> */}

            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'center',  }}>
                <Text style={{ fontSize: 18, fontWeight: '700', top: '2%', color: '#539F46' }}>
                {languageData?.wishlist_screen?.title}

                </Text>

            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#62A845" style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} />
            ) : wishlistData.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold',color:'black' }}>
                {languageData?.wishlist_screen?.no_wishlist_found}
                </Text>
              </View>
            ) :( <View style={{flex: 1,justifyContent:'center',alignItems:'center',top:'3%'}}>
            <FlatList
                style={{ top: '10%', }}
                data={wishlistData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                numColumns={2}
            />
                </View>)}
           

           


        </View>
    )
}
const styles = StyleSheet.create({
    body: {
        backgroundColor: "white",
        flex: 1,
        paddingVertical:'2%'

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
        marginHorizontal: 10 
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
export default BuyWishlist;