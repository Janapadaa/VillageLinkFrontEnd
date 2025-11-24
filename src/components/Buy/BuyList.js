import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, FlatList, StyleSheet, Image, Text, TouchableOpacity, Alert, Linking } from "react-native";
import { SearchBar } from 'react-native-elements';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { PageIndicator } from 'react-native-page-indicator';
import axios from "axios";
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, IMG_URL, getAccessToken, getAcceptLanguage } from "../Api/apiConfig";
import Geolocation from '@react-native-community/geolocation';
import RNFS from 'react-native-fs';

const BuyList = ({ navigation, navigation: { goBack }, route }) => {
    const Id = route?.params?.id
    const title = route?.params?.title
    const lat = route?.params.lat
    const lng = route?.params.lng
    const type = route?.params.type || 'list'
    const dist = route?.params?.distance
    const filterAge = route?.params?.age
    const from = route?.params?.from
    const to = route?.params?.to
    const [age, setAge] = useState(filterAge || '');
    const [filterForm, setFilterForm] = useState(from || 0);
    const [filterTo, setFilterTo] = useState(to || 5000000);
    const [distance, setDistance] = useState(dist || 100);

    console.log("IDsss", filterAge);
    const [isWishlistSelected, setWishlistSelected] = useState(false);
    // const [position, setPosition] = useState(null);

    const [categoriesList, setCategoriesList] = useState([]);
    const [phnumber, setPhnumber] = useState('')
    const [loading, setLoading] = useState(true);
    const [clearDisabled, setClearDisabled] = useState(false); // new state

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
        // Check if lat and lng are available in route params
        if (lat && lng) {
            // If lat and lng are available, call list function with provided lat and lng
            list({ coords: { latitude: lat, longitude: lng } });
        } else {

            getCurrentLocation();
        }
    }, [lat, lng, age, filterForm, filterTo, distance]);


    const clearFilter = async () => {
        if (clearDisabled) return; // prevent extra clicks
        setClearDisabled(true);    // disable clear button
        setLoading(true);          // show loading again
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(position);
                // setPosition(position);
                clearList(position);
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
                setClearDisabled(false); // re-enable on error
                setLoading(false);
            },
            {
                enableHighAccuracy: true, // Use GPS for high accuracy
                timeout: 15000, // Timeout after 15 seconds
                maximumAge: 0, // Do not use cached locations
            }
            // { enableHighAccuracy: false, timeout: 5000,  }

        );
        // setAge('');
        // setFilterForm(0);
        // setFilterTo(500000);
        // setDistance(100);
        // getCurrentLocation();
    }
    const clearList = async (position) => {
        try {
            console.log("final loc apis ", position.coords.latitude, position.coords.longitude, Id);
            const accessToken = await getAccessToken();
            const lang = await getAcceptLanguage();


            // Define the payload object
            const payload = {
                "categoryId": Id,
                "location": [position.coords.latitude, position.coords.longitude],
                "distance": 100,
                "skip": 0,
                "limit": 20,
                "price": {
                    "from": 0,
                    "to": 5000000,
                },
                "age": ''
            };

            // Log the payload object
            console.log("Payload:", JSON.stringify(payload, null, 2));

            // Make the API request
            const response = await axios.post(
                `${BASE_URL}/product/list`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'x-api-key': API_KEY,
                        'Accept-Language': lang,
                    }
                }
            );
            console.log("Buy list filtered", response.data.data);
            setCategoriesList(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data list:', error);
        } finally {
            setLoading(false);
            setClearDisabled(false);
        }
    };

    const listFirst = async () => {
        try {
            // console.log("final loc api ", position.coords.latitude, position.coords.longitude);
            const accessToken = await getAccessToken();
            const lang = await getAcceptLanguage();

            const skip = categoriesList.length;
            const response = await axios.post(
                `${BASE_URL}/product/list`,
                {
                    "categoryId": Id,
                    "skip": skip,
                    "limit": 20,
                    "distance": 100,

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
            console.log(" buy list first", response.data.data);
            setCategoriesList(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data list:', error);
        }
    };

    const list = async (position) => {
        try {
            console.log("final loc api ", position.coords.latitude, position.coords.longitude, Id);
            const accessToken = await getAccessToken();
            const lang = await getAcceptLanguage();


            // Define the payload object
            const payload = {
                "categoryId": Id,
                "location": [position.coords.latitude, position.coords.longitude],
                "distance": dist || distance,
                "skip": 0,
                "limit": 20,
                "price": {
                    "from": parseInt(from) || parseInt(filterForm),
                    "to": parseInt(to) || parseInt(filterTo),
                },
                "age": filterAge || ''
            };

            // Log the payload object
            console.log("Payload:", JSON.stringify(payload, null, 2));

            // Make the API request
            const response = await axios.post(
                `${BASE_URL}/product/list`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'x-api-key': API_KEY,
                        'Accept-Language': lang,
                    }
                }
            );
            console.log("Buy list filtered", response.data.data);
            setCategoriesList(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data list:', error);
        }
    };



    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(position);
                // setPosition(position);
                list(position);
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            {
                enableHighAccuracy: false,
                timeout: 20000,
                maximumAge: 10000,
                // enableHighAccuracy: true, // Use GPS for high accuracy
                //  timeout: 15000, // Timeout after 15 seconds
                //   maximumAge: 0, // Do not use cached locations
            }
            // { enableHighAccuracy: false, timeout: 5000,  }

        );
    }

    const ViewDetails = (id) => {
        // Handle language selection as needed
        console.log(`Selected ID: ${id}`);
        navigation.navigate('buydetails', { id: id });
    };
    const handleWishlistToggle = () => {
        setWishlistSelected(!isWishlistSelected);
    };


    const EnquireSubmit = (phoneNumber, productId) => {

        Alert.alert(
            'Enquiry',
            'How would you like to contact?',
            [
                {
                    text: 'WhatsApp',
                    onPress: () => {
                        // Open WhatsApp with a predefined message
                        Linking.openURL(`https://wa.me/+91${phoneNumber}?text=I%20am%20interested%20in%20your%20product-${productId}.`);
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
    const filter = () => {
        navigation.navigate('filter', { id: Id, title: title });
    }
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.categoriesBox} onPress={() => ViewDetails(item._id)}>
            {item.images.length > 0 && (
                <Image
                    style={styles.cow}
                    source={{ uri: `${IMG_URL}${item.images[0]}` }}
                />
            )}
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
                <View style={{ marginRight: '2%', width: '55%' }}>
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
            <View style={{
                justifyContent: 'space-evenly',
                width: '100%',
                flex: 1,
                flexDirection: 'row',
                marginBottom: 15,
                top: 15,
                gap: 5
            }}>
                <TouchableOpacity
                    style={{
                        borderWidth: 0.5,
                        width: '40%',
                        borderColor: '#539F46',
                        borderRadius: 10,
                        paddingVertical: 6,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => ViewDetails(item._id)}
                >
                    <Text style={{ fontSize: 12, color: 'black', textAlign: 'center' }}>
                        {languageData?.amritmahal_screen?.view_button_text}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: '#539F46',
                        width: '60%',
                        borderRadius: 10,
                        paddingVertical: 6,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => { EnquireSubmit(item.user.phoneNumber, item.productId) }}
                >
                    <Text style={{ fontSize: 12, color: 'white', textAlign: 'center' }}>
                        {languageData?.amritmahal_screen?.enquire_button_text}
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
                {type === 'filter' ? <Text style={{ top: '8%', fontSize: 18, fontWeight: '700', color: '#62A845' }}>
                    Filter Applied
                </Text> : <Text> </Text>}
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, top: 25 }} onPress={() => filter()}>
                    <Image style={{ width: 40, height: 40 }} source={require('../../assets/images/filter.png')} />
                </TouchableOpacity>

            </View>


            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', top: '8%', left: '5%' }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#539F46' }}>
                    {title}
                </Text>
                <View style={{ flexDirection: 'row', top: '10%', left: '2%' }}>
                    <Text style={{ fontSize: 13, top: '5%', fontWeight: '500', color: 'black' }}>
                        {languageData?.amritmahal_screen?.results_text} -
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: '500', top: '3%', left: '16%', color: 'black' }}>
                        {categoriesList.total}
                    </Text>
                </View>
                {type === 'filter' ? <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'flex-end', width: '45%' }} onPress={() => clearFilter()} disabled={clearDisabled}>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#62A845' }}>Clear</Text>
                </TouchableOpacity> : <Text> </Text>}

            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#62A845" style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} />
            ) : !categoriesList && categoriesList.total === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: 'black' }}>
                        No ads found in this location
                    </Text>
                </View>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', top: '3%', marginBottom: '15%' }}>
                    <FlatList
                        style={{ top: '10%', }}
                        data={categoriesList.list}
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
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },

    categoriesText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'black',
        top: 5,
        textAlign: 'left', // Center the text
        flexWrap: 'wrap',

    },
    livestocks: {
        height: 40,
        width: 60
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
export default BuyList;