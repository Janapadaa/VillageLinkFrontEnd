import React, { useState,useEffect } from "react";
import { View, ScrollView, StyleSheet, Image, Text, Alert, TouchableOpacity, TextInput, BackHandler, ActivityIndicator } from "react-native";
import axios from 'axios';
import { BASE_URL, API_KEY, ACCEPT_LANGUAGE ,getAcceptLanguage} from "./Api/apiConfig";
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import { useLanguage } from "./Api/LanguageContext";

const OtpScreen = ({ navigation, navigation: { goBack } }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [loading, setLoading] = useState(false);
  const { languageData } = useLanguage();

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
  };

  const handleSubmit = async () => {
    if (phoneNumber.length !== 10) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid ten-digit phone number',
        position: 'top',
        topOffset: 23,
        text1Style: { fontSize: 16, fontWeight: '400' }
      });
    } else {
      setLoading(true);
      try {
        const lang = await getAcceptLanguage();

        const response = await axios.post(
          `${BASE_URL}/auth/send-otp`,
          {
            phoneNumber: phoneNumber,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': API_KEY,
              'Accept-Language': lang,
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
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.body}>
      <View style={styles.rectangle}>
        {/* <TouchableOpacity onPress={() => handleBackPress()}>
          <Image style={styles.back}
            source={require('../assets/images/back.png')} />
        </TouchableOpacity> */}

        <View style={{ justifyContent: 'center', alignItems: "center", flexDirection: "row", flex: 1 }}>
          <Text style={styles.logintext}>
            {languageData?.login_screen?.title}
          </Text>
        </View>
      </View>
      <Toast />

      <Image style={styles.otp}
        source={require('../assets/images/otp1.png')} />
      <Text style={{
        fontSize: 16,
        fontWeight: '700', color: 'black'
      }}>
        {languageData?.login_screen?.content_1}
      </Text>
      <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-around' }}>
        <View style={styles.regiontext}>
          <Text style={styles.otptext}>
            +91
          </Text>
        </View>
        <View style={styles.numberview}>
          <TextInput
            placeholder= {languageData?.login_screen?.placeholder}
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
          {languageData?.login_screen?.content_2}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => { handleSubmit() }}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
              {languageData?.login_screen?.submitText}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    flexGrow: 1,
    alignItems: "center",
    paddingVertical:'5%'
  },
  rectangle: {
    flexDirection: "row",
    width: "90%",
    height: 50,
    borderWidth: 1,
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
    left: 5,
    color: 'black',
    
  },
  otptext: {
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 20
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
    marginHorizontal: '20%',
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'red',
    borderWidth: 2
  },
  errorText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14
  },
});

export default OtpScreen;
