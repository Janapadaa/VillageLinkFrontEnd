import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, BackHandler } from 'react-native';
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, getAccessToken ,getAcceptLanguage} from '../Api/apiConfig';
import axios from 'axios';
import RNFS from 'react-native-fs';

const BuyReferralCode = ({ navigation, navigation: { goBack } }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
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
    getReferralcode();
  }, []);
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

  const getReferralcode = async () => {
    try {
      const accessToken = await getAccessToken();
      const lang = await getAcceptLanguage();

      const response = await axios.get(
        `${BASE_URL}/user`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': API_KEY,
            'Accept-Language': lang,
          },
        }
      );
      console.log("refcode", response.data.data);
      setPhoneNumber(response.data.data.phoneNumber);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, top: 25 }}
          onPress={() => goBack()}
        >
          <Image style={{ width: 40, height: 40 }} source={require("../../assets/images/backround.png")} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.referralCodeLabel}>
        {languageData?.referral_code_screen?.content_1}

          </Text>
        <Text style={styles.referralCode} selectable={true}>{phoneNumber}</Text>
        <Text style={styles.description}>
        {languageData?.referral_code_screen?.content_2}

        </Text>
        
        {/* <TouchableOpacity style={styles.copyButton} >
          <Text style={styles.copyButtonText} >Copy to Clipboard</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding:'5%'
  },
  content: {
    top: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  referralCodeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color:'black'
  },
  referralCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#62A845',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
  },
  copyButton: {
    backgroundColor: '#62A845',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BuyReferralCode;
