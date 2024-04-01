import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, Alert, Linking, TextInput, StyleSheet, ScrollView } from "react-native";
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, getAccessToken } from "../Api/apiConfig";
import axios from "axios";


const BuyCustomerSupport = ({ navigation, navigation: { goBack } }) => {
  const [message, setMessage] = useState("");
  const [supportResponse, setSupportResponse] = useState([]);
  // const [successMessage, setSuccessMessage] = useState(null);

  const ViewDetails = (categories) => {
  
    console.log(`Selected language: ${categories}`);
    navigation.navigate("buydetails");
  };

  const sendRequest = async () => {
    try {
      const accessToken = await getAccessToken(); 
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
                    'Accept-Language': ACCEPT_LANGUAGE,
                },
            }
        );
        console.log("Support", response.data);
        setSupportResponse(response.data);
        // setSuccessMessage(response.data.message);
        Alert.alert("Success", response.data.message);
    } catch (error) {
        console.error('Error fetching subscription data:', error.message);
    }
  };

  const handleSend = () => {
    if (message.trim() === "") {
      Alert.alert("Error", "Please type something before sending.");
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
        <Text style={{ fontSize: 18, fontWeight: "700", top: "8%", color: "#539F46" }}>Contact Customer Support</Text>
      </View>

      <ScrollView style={{ top: "7%", flex: 1, marginBottom: 40 }} showsVerticalScrollIndicator={false}>
    
        <View style={styles.inputContainer}>
          {/* <Text style={styles.inputHeading}>Contact Customer Support</Text> */}
          <TextInput
            style={styles.inputField}
            multiline
            placeholder="Type your message here..."
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
          {/* {successMessage && (
            <View style={styles.successMessageContainer}>
              <Text style={styles.successMessageText}>{successMessage}</Text>
            </View>
          )} */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    flex: 1,
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
