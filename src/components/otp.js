import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Image, Text, Alert, TouchableOpacity, TextInput, BackHandler } from "react-native";
// import WebView from 'react-native-webview';
import axios from 'axios';
import { BASE_URL, API_KEY, ACCEPT_LANGUAGE } from "./Api/apiConfig";
import Toast from 'react-native-toast-message'; // Add this line


const OtpScreen = ({ navigation, navigation: { goBack } }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
    if (text.length !== 10) {
      console.log("dd");
      // setPhoneNumberError('Please enter a valid ten-digit phone number');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid ten-digit phone number',
        
        position:'top'
      });
    } else {
      setPhoneNumberError('');
    }
  };


  const handleSubmit = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setPhoneNumberError('Please enter a valid ten-digit phone number');
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/send-otp`,
        {
          phoneNumber: phoneNumber,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'Accept-Language': ACCEPT_LANGUAGE,
          },
        }
      );

      console.log('API Response:', response.data);

      navigation.navigate('otpverify', {
        phoneNumber: phoneNumber,
        verificationCode: response.data.data.verificationCode,
      });
    } catch (error) {
      console.error('API Error:', error.message);
      Alert.alert('Error', 'Failed to send OTP. Please try again.'); // Display an error message to the user
    }
  };
  const handleBackPress = () => {
    BackHandler.exitApp()
    return true;
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.body}>
      <View style={styles.rectangle}>
        <TouchableOpacity onPress={() =>
          handleBackPress()}>
          <Image style={styles.back}
            source={require('../assets/images/back.png')} />
        </TouchableOpacity>

        <View style={{ justifyContent: 'center', alignItems: "center", flexDirection: "row", flex: 1 }}>
          <Text style={styles.logintext}>
            Login
          </Text>
          {/* <Image style={styles.image}
          source={require('../assets/images/account_circle.png')} /> */}
        </View>
      </View>
      <Toast/>
     
      <Image style={styles.otp}
        source={require('../assets/images/otp.png')} />
      <Text style={{
        fontSize: 16,
        fontWeight: '700', color: 'black'
      }}>
        Enter your Phone Number
      </Text>
      <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-around' }}>
        <View style={styles.regiontext}>
          <Text style={styles.otptext}>
            +91
          </Text>
        </View>
        <View style={styles.numberview}>
          <TextInput
            placeholder="Enter Your Number"
            placeholderTextColor='black'
            keyboardType="numeric"
            style={styles.numberinput}
            maxLength={10}
            value={phoneNumber}
            onChangeText={(text) => handlePhoneNumberChange(text)}

          />


        </View>

      </View>



      <View style={{
        flex: 1, width: '100%',
        justifyContent: 'flex-end',
      }}>
        <View style={styles.referalview}>
          <Text style={{ color: '#000000' }}>
            Your phone number is your referral code
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => { handleSubmit() }}>
          <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
            Submit
          </Text>

        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}
const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    flexGrow: 1,
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
  regiontext: {
    flexDirection: "row",
    borderWidth: 1,
    height: 40,
    width: 50,
    borderColor: "#00000",
    borderRadius: 5,
    justifyContent: "space-between",
    alignItems: "center",
    top: 20,
    left: 20,
    marginBottom: 50

  },
  numberview: {
    flexDirection: "row",
    borderWidth: 1,
    height: 40,
    width: '60%',
    borderColor: "#00000",
    borderRadius: 8,
    justifyContent: "space-between",
    alignItems: "center",
    top: 20,
    marginBottom: 50
  },
  referalview: {
    borderWidth: 1,
    height: 30,
    paddingHorizontal: 10,
    borderColor: "#00000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    top: 20,
    marginBottom: 30,
    marginHorizontal: 20

  },
  back: {
    height: 25,
    width: 10,
    left: 7
  },
  logintext: {
    fontSize: 18,
    fontWeight: '800',

    color: 'black'
  },
  numberinput: {
    fontSize: 16,
    fontWeight: '400',
    top: 2,
    left: 5,
    color: 'black'
  },
  otptext: {
    fontSize: 16,
    fontWeight: '400',
    left: 5,
    color: 'black'
  },
  image: {
    width: 30,
    height: 30,
    right: 20
  },
  otp: {
    width: 160,
    height: 180,
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
  },
  errorContainer: {
    position: 'absolute',
    top: '15%',
    width: '100%',
    marginHorizontal:'20%',
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    borderRadius:10,
    borderColor:'red',
    borderWidth:2
  },
  errorText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize:14
  },

})
export default OtpScreen;