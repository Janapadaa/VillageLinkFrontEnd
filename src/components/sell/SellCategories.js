import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, IMG_URL, getAccessToken } from "../Api/apiConfig";
const SellCategories = ({ navigation, route }) => {
    const parentId = route?.params?.id
     console.log("pid", parentId);
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const isNextButtonDisabled = !selectedCategories;

    useEffect(() => {
        subCategories()
    }, [])

    const subCategories = async () => {
        try {
            const accessToken = await getAccessToken(); 
            const response = await axios.post(
                `${BASE_URL}/category`,
                {
                    "keyword": "",
                    "parentId": parentId,
                    "skip": 0,
                    "limit": 10
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
            console.log("cat", response.data.data.list);
            setSubcategories(response.data.data.list);


        } catch (error) {
            console.error('Error fetching subscription data:', error.message);
        }
    };

    const handleSelectCategories = (id) => {
        // Handle language selection as needed
        console.log(`Selected language:`,id);
        setSelectedCategories((prevSelectedCategories) =>
            prevSelectedCategories === id ? null : id
        );
      //  setSelectedCategories(item);
      };
    

    const handleSubmit = (item) => {
        const selectedCategory = subcategories.find(
            (category) => category._id === selectedCategories
          );
      
          if (selectedCategory) {
            const parentTitle = selectedCategory.parentData.title;
          
      
            navigation.navigate('sellsubcategories', {
                id:item,
              parentTitle: parentTitle,
              homeid:selectedCategory.parentData._id
            });
          }
    }

   

    return (
        <View style={styles.body}>
            <View style={styles.rectangle}>
                <Image style={styles.back}
                    source={require('../../assets/images/1.png')} />
                <View style={{ justifyContent: 'space-between', alignItems: "center", flexDirection: "row", width: "100%", }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.logintext}>
                            Choose Category
                        </Text>
                    </View>

                </View>
            </View>
            {parentId === '65fc731c2e0b4ae365115908' ? <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '500', top: '8%', color: '#539F46' }}>
                    Livestock
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '500', top: '8%', color: 'black', left: 5 }}>
                    Marketplace
                </Text>
            </View> : <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '500', top: '8%', color: '#539F46' }}>
                Farm Equipments 
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '500', top: '8%', color: 'black', left: 5 }}>
                    Marketplace
                </Text>
            </View> }
            
            <View style={{flex: 1,justifyContent:'center',alignItems:'center',top:'3%',marginBottom:'10%'}}>
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
      />
            </View>
           
            <View style={{
                width: '100%',
                justifyContent: 'flex-end',
            }}>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => { handleSubmit(selectedCategories) }}
                    disabled={isNextButtonDisabled}>
                    <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
                        Next
                    </Text>

                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    body: {
        backgroundColor: "white",
        flex: 1,
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

    },
    livestocks:{
        height:70,
        width:100
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