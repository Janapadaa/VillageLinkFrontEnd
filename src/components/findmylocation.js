import React, {useEffect,useState} from "react";
import { View, Alert, StyleSheet, Image, Text, TouchableOpacity, PermissionsAndroid } from "react-native";
// import WebView from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { ALERT_TYPE, Dialog, AlertNotificationRoot,  } from "react-native-alert-notification";
import { BASE_URL,API_KEY,ACCEPT_LANGUAGE,getAccessToken,getAcceptLanguage } from "./Api/apiConfig";
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

const FindMyLocation = ({navigation, navigation: { goBack }}) => {
  const [position, setPosition] = useState(null);

  const handleSubmit = async () => {
    

    try {
      const accessToken = await getAccessToken(); // Await the token retrieval
      const lang = await getAcceptLanguage();

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
            'Accept-Language': lang,
          },
        }
      );
      navigation.navigate('buyorsell')
      console.log(position.coords.latitude, position.coords.longitude);
      console.log('API Response:', response.data);

     
        } catch (error) {
      console.error('API Error:', error.message);
      // navigation.navigate('buyorsell')
      Dialog.show({
        type: ALERT_TYPE.INFO,
        title: 'Fetching Location',
        textBody: 'Get Your Current location',
        button: 'OK',
      });
      // Alert.alert( 'Failed to get your location'); // Display an error message to the user
    }
  };
  
  useEffect(() => {
    // getCurrentLocation()
    handleEnabledPressed()
},[])

async function handleEnabledPressed() {
  if (Platform.OS === 'android') {
    try {
      const enableResult = await promptForEnableLocationIfNeeded();
      console.log('enableResult', enableResult);
      requestLocationPermission();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
       
      }
    }
  }
}

const requestLocationPermission = async () => {
  try {
    const locationPermission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
    const hasPermission = await PermissionsAndroid.check(locationPermission);
    
    if (hasPermission) {
      console.log('Location permission already granted');
      // Proceed to get the current location
      getCurrentLocation();
    } else {
      console.log('Requesting location permission...');
      const granted = await PermissionsAndroid.request(
        locationPermission,
        {
          title: 'Location Permission',
          message: 'This app requires access to your location.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel'
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        
        getCurrentLocation();
      } else {
        console.log('Location permission denied');
      }
    }
  } catch (error) {
    console.error('Error requesting location permission:', error);
  }
};

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
   
    // { enableHighAccuracy: false, timeout: 5000,  }
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
      <Image style={{height:'40%',width:'60%',top:'5%',}} source={require('../assets/images/location.png')}/>

      <AlertNotificationRoot/>

      
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
    left: 100,
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