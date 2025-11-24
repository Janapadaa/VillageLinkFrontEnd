import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Image, Text, TouchableOpacity, BackHandler, Alert } from "react-native";
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, IMG_URL, getAccessToken,getAcceptLanguage } from '../Api/apiConfig';
import axios from 'axios';

const Featured = ({ navigation, navigation: { goBack }, route }) => {
    const [loading, setLoading] = useState({});
    const [featured, setFeatured] = useState(null);
    const ProductId = route.params.id;
    const planId = route.params.planid;

    useEffect(() => {
        getFeaturePlan();
    }, []);

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

    const getFeaturePlan = async () => {
        try {
            const accessToken = await getAccessToken();
            const lang = await getAcceptLanguage();

            const response = await axios.get(
                `http://34.202.39.56/api/v1/app/featuredPlan/${ProductId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'x-api-key': API_KEY,
                        'Accept-Language': lang,
                    },
                }
            );
            console.log("getfeatureplan", response.data.data);
            setFeatured(response.data.data);
        } catch (error) {
            console.error('Error fetching user data:', error.response);
        }
    };

    const Buynow = async (id) => {
        if (loading[id]) return; // Prevent multiple clicks while loading
        try {
            const accessToken = await getAccessToken();
            const lang = await getAcceptLanguage();

            setLoading({ ...loading, [id]: true }); // Start loading for specific id
            const response = await axios.post(
                `http://34.202.39.56/api/v1/app/featuredPlan/buy`,
                {
                    "planId": id,
                    "productId": planId
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
            console.log("getfeatureplan", response.data);
            // Show success alert
            Alert.alert(
                "Purchase Successful",
                "Your purchase was successful!",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
            // Reset loading after successful response
            setLoading({ ...loading, [id]: false });
        } catch (error) {
            console.error('Error fetching user data:', error.response.data.message);
            Alert.alert(
                "Purchase Status",
                error.response.data.message,
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
            // Reset loading on error
            setLoading({ ...loading, [id]: false });
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.categoriesBox}>
            {item.image.length > 0 && (
                <Image
                    style={styles.cow}
                    source={{ uri: `${IMG_URL}${item.image}` }}
                />
            )}
            <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-between' }}>
                <View>
                    <Text style={styles.categoriesText}>
                        {item.title.en}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '400', color: 'black', top: 5 }}>
                        Duration: {item.duration} Days
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '400', color: 'black', top: 5 }}>
                        Price: ₹ {item.price}
                    </Text>
                </View>

            </View>
            <View style={{ justifyContent: 'space-evenly', width: '100%', alignItems: 'flex-end', flex: 1, flexDirection: 'row', marginBottom: 15, top: 15 }}>
                <TouchableOpacity style={{ backgroundColor: '#539F46', width: 90, borderRadius: 10, padding: 2, alignItems: 'center' }} onPress={() => Buynow(item._id)} disabled={loading[item._id]}>
                    {loading[item._id] ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                            <Text style={{ fontSize: 12, color: 'white' }}>
                                Buy Now
                            </Text>
                        )}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, }}
                    onPress={() => goBack()} >
                    <Image style={{ width: 40, height: 40 }} source={require('../../assets/images/backround.png')} />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#539F46' }}>
                    Featured Plans
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <FlatList
                    style={{ top: '2%', marginBottom: '15%' }}
                    data={featured}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
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
        top: 5
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
        fontWeight: '600',
        color: 'black',
        top: 5

    },
});

export default Featured;
