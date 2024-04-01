import React, {useEffect,useState} from "react";
import { View, Alert, StyleSheet, Image, Text, TouchableOpacity, PermissionsAndroid } from "react-native";
// import WebView from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { BASE_URL,API_KEY,ACCEPT_LANGUAGE,getAccessToken } from "./Api/apiConfig";
const FindMyLocation = ({navigation, navigation: { goBack }}) => {
  const [position, setPosition] = useState(null);

  const handleSubmit = async () => {
    

    try {
      const accessToken = await getAccessToken(); // Await the token retrieval

      const response = await axios.put(
        `${BASE_URL}/user/location`,
        {
          location: [position.coords.latitude, position.coords.longitude],
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
      navigation.navigate('buyorsell')
      console.log(position.coords.latitude, position.coords.longitude);
      console.log('API Response:', response.data);

     
        } catch (error) {
      console.error('API Error:', error.message);
      navigation.navigate('buyorsell')
     // Alert.alert( 'Failed to get your location'); // Display an error message to the user
    }
  };
  useEffect(() => {
    requestLocationPermission();
    getCurrentLocation()
},[])
 const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
        title:'Location Permission',
        message:'Location',
        buttonPositive:'OK',
        buttonNegative:"Cancel"
      },
    );
    if(granted === PermissionsAndroid.RESULTS.GRANTED){
      console.log('location access',granted);
      getCurrentLocation()
    }else{
      console.log("denied");
    }
  }catch(e){
    console.warn(e);
  }
 }

 const getCurrentLocation = ()=>{
  Geolocation.getCurrentPosition(
    (position) => {
      console.log(position);
      setPosition(position);
    },
    (error) => {
      // See error code charts below.
      console.log("errrr",error.code, error);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
);
 }

  return (
    <View style={styles.body}>
       <View style={styles.rectangle}>
      <TouchableOpacity onPress={() => goBack()}>
      <Image style={styles.back}
          source={require('../assets/images/back.png')} />
      </TouchableOpacity>
      
        <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row",width: "100%",}}>
        <Text style={styles.logintext}>
        Choose Location
        </Text>
        <Image style={styles.image}
          source={require('../assets/images/add_location.png')} />
        </View>
      </View>
      <Image style={{height:150,width:150,top:'20%'}} source={require('../assets/images/map.png')}/>

      
      <View style={{
        flex: 1, width: '100%',
        justifyContent: 'flex-end',
      }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => { handleSubmit() }}>
          <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
          Continue
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
    alignItems: "center",
   
  },
  rectangle: {
    flexDirection: "row",
    borderWidth: 1,
    width: "90%",
    height: 50,
    borderColor: "#509E46",
    borderRadius: 5,
    justifyContent: "space-between",
    alignItems: "center",
    top: 20,
    marginBottom: 50
  },
  back :{
    height:25,
    width:10,
    left:7
  },
  logintext: {
    fontSize: 16,
    fontWeight: '700',
    left: 20,
    color: 'black'
  },
  choosetext: {
    fontSize: 16,
    fontWeight: '700',
    left: 10,
    color: 'black'
  },
 locationtext: {
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
    top:10
  },
  image: {
    width: 25,
    height: 30,
    right: 20,
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
    marginTop: 30
  }

})
export default FindMyLocation;