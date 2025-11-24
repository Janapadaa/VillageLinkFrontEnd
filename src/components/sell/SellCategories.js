import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, IMG_URL, getAccessToken,getAcceptLanguage } from "../Api/apiConfig";
import { BackHandler } from "react-native";
import Toast from "react-native-toast-message";
import RNFS from 'react-native-fs';

const SellCategories = ({ navigation, navigation: { goBack },route }) => {
    const parentId = route?.params?.id
    console.log("pid", parentId);
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const isNextButtonDisabled = !selectedCategories;
    const [page, setPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [totalCount, setTotalCount] = useState(null);
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
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                navigation.goBack();
                return true;
            }
        );

        return () => backHandler.remove();
    }, [navigation]);
    useEffect(() => {
        subCategories()
    }, [])

    const subCategories = async () => {
        try {
            const accessToken = await getAccessToken();
            const lang = await getAcceptLanguage();

            const skip = subcategories.length;
            const response = await axios.post(
                `${BASE_URL}/category`,
                {
                    "keyword": "",
                    "parentId": parentId,
                    "skip": skip,
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
            setTotalCount(response.data.data.total);

            if (response.data.data.list.length === 0) {
                setHasMoreData(false);
            }
            console.log("cat", response.data.data.list);
            setSubcategories(prevSubcategories => [...prevSubcategories, ...response.data.data.list]);

            // setSubcategories(response.data.data.list);


        } catch (error) {
            console.error('Error fetching subscription data:', error.message);
        }
    };

    const handleSelectCategories = (id) => {
        // Handle language selection as needed
        console.log(`Selected language:`, id);
        setSelectedCategories((prevSelectedCategories) =>
            prevSelectedCategories === id ? null : id
        );
        //  setSelectedCategories(item);
    };


    const handleSubmit = (item) => {
        if (!item || !item.length) {
            Toast.show({
                type: 'error',
                text1: 'Select one',
                text2: 'Please Select To Continue',
                position: 'top',
                topOffset: 23,
                text1Style: { fontSize: 16, fontWeight: '400' }
            });
            return;
        }
        const selectedCategory = subcategories.find(
            (category) => category._id === selectedCategories
        );

        if (selectedCategory) {
            const parentTitle = selectedCategory.parentData.title;


            navigation.navigate('sellsubcategories', {
                id: item,
                parentTitle: parentTitle,
                homeid: selectedCategory.parentData._id
            });
        }
    }

    const handleEndReached = () => {
        if (hasMoreData) {
            setPage(page + 1); // Increment the page number
            subCategories(); // Fetch more data
        }
    };


    return (
        <View style={styles.body}>
            {totalCount === 0 ?
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <TouchableOpacity style={{ flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center', paddingHorizontal: 16,top:25}}
        onPress={() => goBack()} >
        <Image style={{width:40,height:40}} source={require('../../assets/images/backround.png')} />
        </TouchableOpacity>
        </View>
    :  
     <View style={styles.rectangle}>
    <Image style={styles.back}
        source={require('../../assets/images/1.png')} />
    <View style={{ justifyContent: 'space-between', alignItems: "center", flexDirection: "row", width: "100%", }}>
        <View style={{ flexDirection: 'column' }}>
            <Text style={styles.logintext}>
            {languageData?.agricultural_tools_implements_sell_screen?.title}

            </Text>
        </View>

    </View>
</View> }
          
            {totalCount === 0 ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', top: '3%', marginBottom: '10%' }}>
                <Text style={{ fontSize: 16, fontWeight: '500', color: 'black' }}>Coming Soon ...</Text>
            </View> :
                (
                    <>
                        {parentId === '6667fc6ba90178b6862b10d1' ? <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 14, fontWeight: '500', top: '8%', color: '#539F46' }}>
                            {languageData?.livestock_agri_produce_screen?.title}
                            </Text>
                            {/* <Text style={{ fontSize: 14, fontWeight: '500', top: '8%', color: 'black', left: 5 }}>
                                Marketplace
                            </Text> */}
                        </View> : <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 14, fontWeight: '500', top: '8%', color: '#539F46' }}>
                            {languageData?.farm_equipments_screen?.title}
                            </Text>
                            {/* <Text style={{ fontSize: 14, fontWeight: '500', top: '8%', color: 'black', left: 5 }}>
                                Marketplace
                            </Text> */}
                        </View>}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', top: '3%', marginBottom: '10%' }}>
                            <FlatList
                                style={{ top: '10%', }}
                                data={subcategories}
                                keyExtractor={(item) => item._id}
                                numColumns={2} // Adjust the number of columns as needed
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.categoriesBox,
                                            selectedCategories === item._id && { borderColor: "#62A845" },
                                        ]}
                                        onPress={() => handleSelectCategories(item._id)}
                                    >
                                        <Image
                                            style={styles.livestocks}
                                            source={{ uri: `${IMG_URL}${item.image}` }}

                                        // source={require('../../assets/images/livestock.png')}
                                        />
                                        <Text style={styles.categoriesText}>{item.title}</Text>
                                    </TouchableOpacity>
                                )}
                                onEndReached={handleEndReached} // Add event handler for reaching the end of the list
                                onEndReachedThreshold={0.5}
                            />
                        </View>
                        <Toast />
                        <View style={{
                            width: '100%',
                            justifyContent: 'flex-end',
                        }}>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => { handleSubmit(selectedCategories) }}
                            >
                                <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
                                {languageData?.agricultural_tools_implements_sell_screen?.next_button_text}

                                </Text>

                            </TouchableOpacity>
                        </View>
                    </>
                )}







        </View>
    )
}
const styles = StyleSheet.create({
    body: {
        backgroundColor: "white",
        flex: 1,
        paddingVertical:'5%'
    },
    categoriesBox: {
        height: 125,
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
        height: 70,
        width: 100
    },

    categoriesText: {
        fontSize: 12,
        fontWeight: '500',
        color: 'black',
        top: 10

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
        color: 'black'

    },
    livestocks: {
        height: 70,
        width: 100
    },
    nextButton: {
        backgroundColor: '#000000',
        borderRadius: 25,
        height: 50,
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 20,
        marginTop: 30,

    },
    button: {
        backgroundColor: '#000000',
        borderRadius: 5,
        height: 50,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,

    }

})
export default SellCategories;