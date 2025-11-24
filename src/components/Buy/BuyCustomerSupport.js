import React, { useState,useEffect } from "react";
import { View, Image, Text, TouchableOpacity, Alert, Linking, TextInput, StyleSheet, ScrollView, BackHandler } from "react-native";
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, getAccessToken,getAcceptLanguage } from "../Api/apiConfig";
import axios from "axios";
import RNFS from 'react-native-fs';

import { ALERT_TYPE, Dialog, AlertNotificationRoot, } from "react-native-alert-notification";

const BuyCustomerSupport = ({ navigation, navigation: { goBack } }) => {
  const [message, setMessage] = useState("");
  const [supportResponse, setSupportResponse] = useState([]);
  // const [successMessage, setSuccessMessage] = useState(null);
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

  const ViewDetails = (categories) => {
  
    console.log(`Selected language: ${categories}`);
    navigation.navigate("buydetails");
  };
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack(); 
        return true; 
      }
    );
  
    return () => backHandler.remove();
  }, [navigation]);

  const sendRequest = async () => {
    try {
      const accessToken = await getAccessToken(); 
      const lang = await getAcceptLanguage();

        const response = await axios.post(
          `${BASE_URL}/support`,
           {
            "message": message

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
        console.log("Support", response.data);
        setSupportResponse(response.data);
        // setSuccessMessage(response.data.message);
       
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Succes',
          textBody: response.data.message,
          button: 'OK',
        });
    } catch (error) {
        console.error('Error fetching subscription data:', error.message);
    }
  };

  const handleSend = () => {
    if (message.trim() === "") {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Error',
        textBody: 'Please type something before sending',
        button: 'OK',
      });
    } else {
      sendRequest();
      setMessage("");
    }
  };

 

  return (
    <View style={styles.body}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, top: 25 }}
          onPress={() => goBack()}
        >
          <Image style={{ width: 40, height: 40 }} source={require("../../assets/images/backround.png")} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", top: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", top: "8%", color: "#539F46" }}>
        {languageData?.contact_customer_support_screen?.title}
        </Text>
      </View>

      <ScrollView style={{ top: "7%", flex: 1, marginBottom: 40 }} showsVerticalScrollIndicator={false}>
    
        <View style={styles.inputContainer}>
          {/* <Text style={styles.inputHeading}>Contact Customer Support</Text> */}
          <TextInput
            style={styles.inputField}
            multiline
            placeholder={languageData?.contact_customer_support_screen?.message_placeholder}
            placeholderTextColor={'black'}
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>
            {languageData?.contact_customer_support_screen?.send_button_text}
              </Text>
          </TouchableOpacity>
          {/* {successMessage && (
            <View style={styles.successMessageContainer}>
              <Text style={styles.successMessageText}>{successMessage}</Text>
            </View>
          )} */}
        </View>
        <AlertNotificationRoot/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    flex: 1,
    paddingVertical:'5%'
  },
  successMessageContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#539F46",
    borderRadius: 8,
    justifyContent:'center',
    alignItems:'center'
  },
  successMessageText: {
    color: "white",
    fontWeight: "bold",
  },
  inputContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  inputHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    height: 120,
    marginBottom: 16,
    color:'black'
    
  },
  sendButton: {
    backgroundColor: "#539F46",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BuyCustomerSupport;
