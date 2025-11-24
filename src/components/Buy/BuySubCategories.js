import React, { useState ,useEffect } from "react";
import { View, FlatList, StyleSheet, Image, Text, TouchableOpacity, BackHandler } from "react-native";
import { SearchBar } from 'react-native-elements';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { PageIndicator } from 'react-native-page-indicator';
import axios from "axios";
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, IMG_URL, getAccessToken,getAcceptLanguage } from "../Api/apiConfig";
import { ALERT_TYPE, Dialog, AlertNotificationRoot,  } from "react-native-alert-notification";
import Toast from 'react-native-toast-message'; // Add this line
import RNFS from 'react-native-fs';

const BuySubCategories = ({ navigation, navigation: { goBack },route }) => {
  const parentId = route?.params?.id
   const mainid = route?.params?.parentTitle
  console.log("subsubpid", mainid);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const isNextButtonDisabled = !selectedCategories;
  const [title, setTitle] = useState(null)
  const [id, setId] = useState(null)
  const [page, setPage] = useState(1); // Initialize page number
  const [hasMoreData, setHasMoreData] = useState(true);

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
    subCategories()
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

      // Merge the newly fetched data with the existing data
      setSubcategories(prevSubcategories => [...prevSubcategories, ...response.data.data.list]);
  
      // setSubcategories(response.data.data.list);
    
  } catch (error) {
      console.error('Error fetching subscription data:', error.message);
  }
};
const handleSelectCategories = (id,tit) => {   
 setTitle(tit);
 console.log("idd",id);
 setId(id)
  setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories === id ? null : id
  );  
};
const handleEndReached = () => {
  if (hasMoreData) {
    setPage(page + 1); // Increment the page number
    subCategories(); // Fetch more data
  }
};

const handleSubmit = (item) => {
  // const title = subcategories[0].title;
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
console.log(title);
    navigation.navigate('buylist', {
      title: title,
      parentId:selectedCategories,
      id:id
    });
  
};

  const filter = () => {
    navigation.navigate('filter');
} 


  return (
    <View style={styles.body}>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <TouchableOpacity style={{ flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center', paddingHorizontal: 16,top:25}}
      onPress={() => goBack()} >
      <Image style={{width:40,height:40}} source={require('../../assets/images/backround.png')} />
      </TouchableOpacity>
      {/* <TouchableOpacity style={{ flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center', paddingHorizontal: 16,top:25}} onPress={() => filter()}>
      <Image style={{width:40,height:40}} source={require('../../assets/images/filter.png')} />
      </TouchableOpacity> */}
            
            </View>
            <Toast/>
              
          {mainid === '6667fc6ba90178b6862b10d1' ?  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '500', top: '8%', color: '#539F46' }}>
                {languageData?.buffalo_screen?.title} 
                </Text>
               
            </View> :  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '500', top: '8%', color: '#539F46' }}>
                {languageData?.agricultural_tools_implements_screen?.title}  
                </Text>
               
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
          onPress={() => handleSelectCategories(item._id,item.title)}
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
           

      <View style={{
        width: '100%',
        justifyContent: 'flex-end',
      }}>
        <AlertNotificationRoot/>

        <TouchableOpacity
          style={styles.button}
          onPress={() => { handleSubmit(selectedCategories) }}
         >
          <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
          {languageData?.agricultural_tools_implements_screen?.next_button_text}
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
  livestocks: {
    height:70,
    width:100
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
export default BuySubCategories;