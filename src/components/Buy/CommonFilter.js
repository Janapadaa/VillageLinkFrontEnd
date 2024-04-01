import React, { useState, useEffect } from "react";
import { View, FlatList, Dimensions, StyleSheet, Image, Text, TouchableOpacity, } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { PageIndicator } from 'react-native-page-indicator';
import { Slider } from "react-native-elements";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, getAccessToken } from "../Api/apiConfig";
import axios from "axios";

const CommonFilter = ({ navigation, navigation: { goBack } }) => {
    const [keyData,setKeyData] =useState([]);

    useEffect(() => {
        fetchKeyWords();
    }, []);

    const fetchKeyWords = async () => {
        try {
            const accessToken = await getAccessToken(); 
            const response = await axios.get(
                `${BASE_URL}/category/keyword`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'x-api-key': API_KEY,
                        'Accept-Language': ACCEPT_LANGUAGE,
                    },
                }
            );
            console.log("key",response.data);
            setKeyData(response.data.data)
        } catch (error) {
            console.error('Error fetching user data:', error.response.data);
        }
    };

    const handleSubmit = () => {
        navigation.navigate('sellsubcategories');
    }

    const CategoryItem = ({ title }) => (
        <TouchableOpacity style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', }}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, top: 25 }} onPress={() => goBack()} >
                    <Image style={{ width: 40, height: 40, }} source={require('../../assets/images/backfilter.png')} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: 'black' ,top: 30}}>
                    Search
                </Text>
            </View>

            <View style={{ top: 40,marginHorizontal:'5%' }}>
                <View style={{width:'100%',height:35,borderWidth:0.5,borderColor:'grey',borderRadius:5,justifyContent:'center'}}>
                    <Text style={{left:20,fontSize:14,fontWeight:500}}>
                        Find Here
                    </Text>
                </View>
            </View>

            <View style={{  flexDirection: 'row',top:'15%',marginHorizontal:10 }} >
                <FlatList
                    data={keyData}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <CategoryItem title={item.title}  />}
                    horizontal={true}
                    contentContainerStyle={styles.listContainer}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
                <View style={{flexDirection:'column',top:'5%',marginHorizontal:20}}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: 'black' }}>
                        Popular Categories
                    </Text>

                    <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between' ,top:10,}} >
                        <Text>
                            Livestock
                        </Text>
                        <Image style={{height:20,width:20,}} source={require('../../assets/images/next_filter.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between' ,top:20}}>
                        <Text>
                        Farm Equipment
                        </Text>
                        <Image style={{height:20,width:20,}} source={require('../../assets/images/next_filter.png')} />
                    </TouchableOpacity>
                </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: "#FFFFFF",
        flexGrow: 1,
    },
    listContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '5%',
        marginBottom: '10%',
    },
    categoryContainer: {
        backgroundColor: '#62A845',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        marginBottom: 10,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '400',
        color: 'white',
    },
})

export default CommonFilter;
