import React, { useRef, useState,useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, Alert,TouchableOpacity, TextInput, KeyboardAvoidingView } from "react-native";
// import WebView from 'react-native-webview';
import OTPTextView from 'react-native-otp-textinput';
import axios from 'axios';
import { BASE_URL, API_KEY, ACCEPT_LANGUAGE, setAccessToken,getAccessToken, getDeviceToken,getAcceptLanguage } from "./Api/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from "react-native-alert-notification";
import RNFS from 'react-native-fs';

import { useLanguage } from './Api/LanguageContext';

const OtpVerification = ({navigation, navigation: { goBack },route}) => {
  // const [otpInput, setOtpInput] = useState("");
  const [resendButtonEnabled, setResendButtonEnabled] = useState(true);
  const [counter, setCounter] = React.useState(10);

  const { phoneNumber, verificationCode } = route.params;
  const [otpInput, setOtpInput] = useState(verificationCode || "");
  

       const { languageData } = useLanguage();
  
  const handleSubmit = async () => {
    if (!otpInput) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }
  
    try {
      const deviceToken = await getDeviceToken(); 
      const lang = await getAcceptLanguage();

console.log("devicetoken",deviceToken);
      console.log('Request Payload:', {
        shortCode: "+91",
        phoneNumber: phoneNumber,
        verificationCode: otpInput,
        deviceToken: deviceToken,
        language: ACCEPT_LANGUAGE,
      });
      const response = await axios.post(
        `${BASE_URL}/auth/verify-otp`,
        {
          shortCode: "+91",
          phoneNumber: phoneNumber,
          verificationCode: otpInput,
          deviceToken: deviceToken,
          language: ACCEPT_LANGUAGE,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'Accept-Language': lang,
          },
        }
      );
    
  
      if (response.data && response.data.success) {
        
        console.log('Verification successful',response.data.data);
        setAccessToken(response.data.data.accessToken);
        await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
        if (response.data.data.user.userName) {
          navigation.navigate('buyorsell');
        } else {
          navigation.navigate('createprofile',{type:"create"});
        }
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Invalid verification code. Please try again.',
          button: 'OK',
        });
       
      }
    } catch (error) {
      console.error('API Error:', error.response.data);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Failed to verify OTP. Please try again.',
        button: 'OK',
      });
     // Alert.alert('Error', 'Failed to verify OTP. Please try again.'); // Display an error message to the user
    }
  };
  

  React.useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
      setResendButtonEnabled(counter === 0);

    return () => clearInterval(timer);
  }, [counter]);
  return (
    <ScrollView 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.body}>
      <View style={styles.rectangle}>
      <TouchableOpacity onPress={() => goBack()}>
      <Image style={styles.back}
          source={require('../assets/images/back.png')} />
      </TouchableOpacity>
      
        <View style={{justifyContent: 'center',alignItems: "center",flexDirection: "row",width:'100%'}}>
        <Text style={styles.logintext}>
        {languageData?.verify_account_screen?.title}
        </Text>
        {/* <Image style={styles.image}
          source={require('../assets/images/verifyotp.png')} /> */}
        </View>
      </View>

      <Image style={styles.otp}
        source={require('../assets/images/otpverify1.png')} />
      <Text style={{fontSize: 16,color: 'black',fontWeight: '700',}}>
      {languageData?.verify_account_screen?.content_1}
      </Text>

      <View style={{flexDirection:'row',width:'50%',justifyContent:'space-between',top:20}}> 
      <Text style={{fontSize:12,color:'black'}}>
        OTP Code
      </Text>

      <Text style={{fontSize:12,color:'black'}}>
        {'00:0' + counter}
      </Text>
      </View>
      
      <View style={{ top: 30 }}>
        <OTPTextView
          handleTextChange={setOtpInput}
          containerStyle={styles.textInputContainer}
          textInputStyle={styles.roundedTextInput}
          inputCount={4}
          //defaultValue={verificationCode}
          
        />
      </View>
      <AlertNotificationRoot/>
      <View style={{top :'8%', flexDirection: 'row' }}>
        <Text style={{  color: '#000000' }}>
        {languageData?.verify_account_screen?.resend_text}
        </Text>

        {resendButtonEnabled && (
    <TouchableOpacity
    //  onPress={() => { handleSubmit() }}
     >
      <Text style={{ left: 3, color: '#509E46' }}>
        Resend
      </Text>
    </TouchableOpacity>
  )}

      </View>



      <View style={{
         width: '100%',
        justifyContent: 'flex-end',
        flex:1
      }}>

        <TouchableOpacity
          style={styles.button}
          onPress={() => { handleSubmit() }}>
          <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
          {languageData?.verify_account_screen?.verify_button_text}
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
    paddingVertical:'5%'


  },
  rectangle: {
    flexDirection: "row",
    borderWidth: 1,
    width: "90%",
    height: 50,
    borderColor: "#509E46",
    borderRadius: 5,
    top: 20,
    marginBottom: 50

  },
  otp:{
    width:190,
    height:210,
    marginBottom:20,
    marginTop:5
  },
  logintext: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black'
  },
  numberinput: {
    fontSize: 16,
    fontWeight: '400',
    top: 3,
    left: 5,
    color: 'black'
  },
  back :{
    height:25,
    width:10,
    top:12,
    left:7
  },

  image: {
    width: 25,
    height: 20,
    right: 20
  },
  textInputContainer: {
    marginBottom: 20,
  },
  roundedTextInput: {
    borderRadius: 5,
    borderWidth: 1,
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
export default OtpVerification;