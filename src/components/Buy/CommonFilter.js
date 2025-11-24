import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Image, Text, TouchableOpacity, BackHandler } from "react-native";
import axios from "axios";
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, getAccessToken ,getAcceptLanguage} from "../Api/apiConfig";

const CommonFilter = ({ navigation, route }) => {
    const [keyData, setKeyData] = useState([]);
    const type = route.params.type;

    useEffect(() => {
        fetchKeyWords();
    }, []);

    const fetchKeyWords = async () => {
        try {
            const accessToken = await getAccessToken();
            const lang = await getAcceptLanguage();

            const response = await axios.get(
                `${BASE_URL}/category/keyword`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'x-api-key': API_KEY,
                        'Accept-Language': lang,
                    },
                }
            );
            setKeyData(response.data.data);
        } catch (error) {
            console.error('Error fetching user data:', error.response.data);
        }
    };

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

    const CategoryItem = ({ title }) => (
        <TouchableOpacity
            style={styles.categoryContainer}
            onPress={() => {
                type === 'buy'
                    ? navigation.navigate('buysubcategories', { id: title._id })
                    : navigation.navigate('sellsubcategories', { id: title._id });
            }}
        >
            <Text style={styles.categoryText} numberOfLines={2} ellipsizeMode="tail">
                {title.title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.body}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, top: 25 }}
                    onPress={() => navigation.goBack()}
                >
                    <Image style={{ width: 40, height: 40 }} source={require('../../assets/images/backfilter.png')} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: 'black', top: 30 }}>
                    Search
                </Text>
            </View>

            <View style={{ flexDirection: 'row', top: '10%', marginHorizontal: 10 }}>
                <FlatList
                    style={{ marginBottom: '30%' }}
                    data={keyData}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <CategoryItem title={item} />}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    body: {
        backgroundColor: "#FFFFFF",
        flexGrow: 1,
    },
    listContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '4%',
        bottom: '2%',
    },
    categoryContainer: {
        backgroundColor: '#62A845',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginHorizontal: 5,
        marginBottom: 10,
        width: '30%', // Ensure the container has a fixed width to fit within a column
        alignItems: 'center',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '400',
        color: 'white',
        textAlign: 'center',
    },
});

export default CommonFilter;
