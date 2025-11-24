import React, { useState ,useEffect } from "react";
import { View, FlatList, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, IMG_URL, getAccessToken,getAcceptLanguage } from "../Api/apiConfig";
import { BackHandler } from "react-native";
import Toast from "react-native-toast-message";
import RNFS from 'react-native-fs';

const SellSubCategories = ({ navigation, navigation: { goBack },route }) => {
  const parentId = route?.params?.id
  const title = route?.params?.parentTitle
  const maindid=route?.params?.homeid
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const isNextButtonDisabled = !selectedCategories;
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  console.log("til",parentId);
  useEffect(() => {
    subCategories()
}, [])

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


const handleEndReached = () => {
  if (hasMoreData) {
    setPage(page + 1); // Increment the page number
    subCategories(); // Fetch more data
  }
};

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
      console.log(" Sub cats", response.data.data.list);
      if (response.data.data.list.length === 0) {
        setHasMoreData(false);
      }
      setSubcategories(prevSubcategories => [...prevSubcategories, ...response.data.data.list]);

    //  setSubcategories(response.data.data.list);

  } catch (error) {
      console.error('Error fetching subscription data:', error.message);
  }
};
  

  const handleSelectCategories = (id) => {   
    console.log(`Selected :`,id);
    setSelectedCategories((prevSelectedCategories) =>
        prevSelectedCategories === id ? null : id
    );  
  };

  const handleSubmit = (item) => {
    if (!item || !item.length) {
      Toast.show({
        type: 'error',
        text1: 'Select one',
        text2: 'Please Select To Continue',
        position:'top',
        topOffset:23,
        text1Style:{fontSize:16,fontWeight:'400'}
      });
      return; 
    }
    console.log(`Selected language:`,selectedCategories);
    const selectedCategory = subcategories.find(
      (category) => category._id === selectedCategories
    );

    if (selectedCategory) {
      const parentTitle = selectedCategory.parentData.title;
    
        
      navigation.navigate('details', {
        type: title,
        parentTitle: parentTitle,
        parentId:selectedCategories,
        categoriesDetails:subcategories,
        homeid:maindid
      });
    }
  };


  return (
    <View style={styles.body}>
      <View style={styles.rectangle}>
        <Image style={styles.back}
          source={require('../../assets/images/2.png')} />
        <View style={{ justifyContent: 'space-between', alignItems: "center", flexDirection: "row", width: "100%", }}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.logintext}>
            {languageData?.agricultural_tools_implements_sell_screen?.title}
            </Text>
          </View>

        </View>
      </View>
      {maindid === '6667fc6ba90178b6862b10d1' ? <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ fontSize: 14, fontWeight: '500', top: '8%', color: '#539F46' }}>
        {languageData?.buffalo_screen?.title}
        </Text>
        {/* <Text style={{ fontSize: 14, fontWeight: '500', top: '8%', color: 'black', left: 5 }}>
          Breed
        </Text> */}
      </View> : <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ fontSize: 14, fontWeight: '500', top: '8%', color: '#539F46' }}>
        {languageData?.agricultural_tools_implements_sell_screen?.choose_brand_text}
        </Text>
        {/* <Text style={{ fontSize: 14, fontWeight: '500', top: '8%', color: 'black', left: 5 }}>
          Brand
        </Text> */}
      </View>}
      
      <View style={{flex: 1,justifyContent:'center',alignItems:'center',top:'3%',marginBottom:'10%'}}>
      <FlatList
        style={{ top: '5%', }}
        data={subcategories}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
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

            //  source={require('../../assets/images/livestock.png')}
            />
            <Text style={styles.categoriesText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        onEndReached={handleEndReached} 
        onEndReachedThreshold={0.5}
      />
        </View>
<Toast/>
     

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
    </View>
  )
}
const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    flex: 1,
    paddingVertical:'5%'

  },
  livestocks: {
    height:70,
    width:100
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
    color:'black'

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
export default SellSubCategories;