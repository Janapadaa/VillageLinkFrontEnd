import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, Alert,TouchableOpacity, TextInput, KeyboardAvoidingView } from "react-native";
// import WebView from 'react-native-webview';
import OTPTextView from 'react-native-otp-textinput';
import axios from 'axios';
import { BASE_URL, API_KEY, ACCEPT_LANGUAGE, setAccessToken,getAccessToken } from "./Api/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';


const OtpVerification = ({navigation, navigation: { goBack },route}) => {
  // const [otpInput, setOtpInput] = useState("");
  const [resendButtonEnabled, setResendButtonEnabled] = useState(true);
  const [counter, setCounter] = React.useState(10);

  const { phoneNumber, verificationCode } = route.params;
  const [otpInput, setOtpInput] = useState(verificationCode || "");

  const handleSubmit = async () => {
    if (!otpInput) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }
  
    try {
      console.log('Request Payload:', {
        shortCode: "+91",
        phoneNumber: phoneNumber,
        verificationCode: otpInput,
        deviceToken: "TEST",
        language: "ta",
      });
      const response = await axios.post(
        `${BASE_URL}/auth/verify-otp`,
        {
          shortCode: "+91",
          phoneNumber: phoneNumber,
          verificationCode: otpInput,
          deviceToken: "TEST",
          language: "en",
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'Accept-Language': ACCEPT_LANGUAGE,
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
        Alert.alert('Error', 'Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('API Error:', error.response.data);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.'); // Display an error message to the user
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
      
        <View style={{justifyContent: 'space-between',alignItems: "center",flexDirection: "row",width: "100%",}}>
        <Text style={styles.logintext}>
          Verify Account
        </Text>
        <Image style={styles.image}
          source={require('../assets/images/verifyotp.png')} />
        </View>
      </View>

      <Image style={styles.otp}
        source={require('../assets/images/otpverify.png')} />
      <Text style={{fontSize: 16,color: 'black',fontWeight: '700',}}>
        Enter The Verification Code Sent To Your Number
      </Text>

      <View style={{flexDirection:'row',width:'50%',justifyContent:'space-between',top:20}}> 
      <Text style={{fontSize:12,color:'black'}}>
        OTP Code
      </Text>

      <Text style={{fontSize:12,color:'black'}}>
        {'00:' + counter}
      </Text>
      </View>
      
      <View style={{ top: 30 }}>
        <OTPTextView
          handleTextChange={setOtpInput}
          containerStyle={styles.textInputContainer}
          textInputStyle={styles.roundedTextInput}
          inputCount={4}
          defaultValue={verificationCode}
        />
      </View>
      <View style={{top :'8%', flexDirection: 'row' }}>
        <Text style={{  color: '#000000' }}>
          Didn’t Receive the code?
        </Text>

        {resendButtonEnabled && (
    <TouchableOpacity onPress={() => { handleSubmit() }}>
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
            Verify
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
    top: 20,
    marginBottom: 50

  },
  otp:{
    width:190,
    height:190,
    bottom:20
  },
  logintext: {
    fontSize: 16,
    fontWeight: '700',
    left: 20,
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