import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, BackHandler } from "react-native";
import { setAcceptLanguage, BASE_URL,ACCEPT_LANGUAGE,API_KEY,getAccessToken } from "./Api/apiConfig";
import axios from 'axios';
import RNFS from 'react-native-fs';
import { useLanguage } from "./Api/LanguageContext";

const Language = ({ navigation,route }) => {
  const type = route?.params?.type;
  console.log("language", type);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const { setLanguageData } = useLanguage();   // 👈 bring in setter

  const handleLanguagePress = async (language) => {
    console.log(`Selected language: ${language}`);
    setSelectedLanguage(language);

    // Map selected language to the corresponding API language code
    const languageMap = {
        English: "en",
        Tamil: "ta",
        Telugu: "te",
        Kannada: "kn",
        Hindi: "hi",
    };

    const selectedLangCode = languageMap[language] || "en"; 
   await setAcceptLanguage(selectedLangCode);
};
const finalSubmit = async () => {
  try {
    const accessToken = await getAccessToken();
    console.log("lan", ACCEPT_LANGUAGE);

    const response = await axios.get(
      `${BASE_URL}/language`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'x-api-key': API_KEY,
          'Accept-Language': ACCEPT_LANGUAGE,
        },
      }
    );

    console.log("language_response", response.data.data);

    // Convert response data to a JSON string
    const jsonData = JSON.stringify(response.data.data, null, 2);
    
    // Define file path
    const filePath = `${RNFS.DocumentDirectoryPath}/languageData.json`;

    // Save JSON response to a file
    await RNFS.writeFile(filePath, jsonData, 'utf8');
    console.log('Data saved to', filePath);
    setLanguageData(response.data.data);

    // Redirect to onboardingscreens
    if(type === 'menu'){
      navigation.reset({
        index: 0,
        routes: [{ name: 'buynavigationdrawer' }],
      });    }else{
      navigation.navigate('onboardingscreens');
    }
   

  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };
  
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
  
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (type === 'menu') {
        navigation.navigate('buynavigationdrawer'); // Navigate to the menu screen
      } else {
        BackHandler.exitApp(); // Default back navigation
      }
      return true;
    });

    return () => backHandler.remove();
  }, [navigation, type]);

  const handleSubmit = () => {
    navigation.navigate('buynavigationdrawer');
  };

  

  

  return (
    <View style={styles.body}>
      <View style={styles.rectangle}>
        <Text style={styles.choosetext}>Choose Language</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.languageBox,
            selectedLanguage === "English" && { backgroundColor: "#62A845" },
          ]}
          onPress={() => handleLanguagePress("English")}
        >
          <View>
            <Text style={styles.languageText}>English</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageBox,
            selectedLanguage === "Tamil" && { backgroundColor: "#62A845" },
            
          ]}
          //onPress={() => handleLanguagePress("Tamil")}
          onPress={null}
        >
          <View >
            <Text style={styles.comingSoon}>Coming soon..</Text>
            <Text style={styles.comingSoon}> தமிழ்</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.languageBox,
            selectedLanguage === "Telugu" && { backgroundColor: "#62A845" },
          ]}
          onPress={() => handleLanguagePress("Telugu")}
        >
          <View>
            <Text style={styles.languageText}>తెలుగు</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageBox,
            selectedLanguage === "Kannada" && { backgroundColor: "#62A845" },
          ]}
          onPress={() => handleLanguagePress("Kannada")}
        >
          <View>
            <Text style={styles.languageText}>ಕನ್ನಡ</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.languageBox,
            selectedLanguage === "Hindi" && { backgroundColor: "#62A845" },
          ]}
         // onPress={() => handleLanguagePress("Hindi")}
          onPress={null}
        >
          <View>
            <Text style={styles.comingSoon}>Coming soon..</Text>
            <Text style={styles.comingSoon}> हिंदी</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => { finalSubmit() }}>
          <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    flex: 1,
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
    justifyContent: "center",
    alignItems: "center",
    top: 20,
    marginBottom: 50
  },
  choosetext: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black'
  },
  row: {
    width: '80%',
    flexDirection: "row",
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  languageBox: {
    width: 135,
    height: 85,
    backgroundColor: "#F1F1F1",
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: "center",
    marginHorizontal: 5,
  },
  comingSoon:{
    fontSize: 14,
    fontWeight: "bold",
    color: 'black',
    textAlign:'center',
    opacity:0.5
    
  },
  languageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: 'black',
    textAlign:'center'
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
});

export default Language;
