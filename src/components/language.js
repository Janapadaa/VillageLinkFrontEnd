import React, { useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

const Language = ({navigation,route}) => {
  const type = route?.params?.type
  console.log("language",type);
  const [selectedLanguage, setSelectedLanguage] = useState(null);


  const handleLanguagePress = (language) => {
    // Handle language selection as needed
    console.log(`Selected language: ${language}`);
    setSelectedLanguage((prevSelectedLanguage) =>
    prevSelectedLanguage === language ? null : language
  );
  };

  const handleSubmit =() =>{
    navigation.navigate('buynavigationdrawer'); 
  }
  const finalSubmit =() =>{
    navigation.navigate('onboardingscreens'); 
  }
  return (
    <View style={styles.body}>
      <View style={styles.rectangle}>
        <Text style={styles.choosetext}>
          Choose Language
        </Text>
        <Image style={styles.image}
          source={require('../assets/images/g_translate.png')} />
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.languageBox,
            selectedLanguage === "English" && { backgroundColor: "#62A845" }, 
          ]}
          onPress={() => handleLanguagePress("English")}
        >
          <View style={styles.row}>
            <View>
              <Image
                source={require('../assets/images/roundimg.png')}
                style={styles.roundImage}
              />
              <Image
                source={require('../assets/images/A.png')}
                style={styles.letterImage}
              />
            </View>
            <View>
              <Text style={styles.languageText}>English</Text>
            </View>
          </View>

        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageBox,
            selectedLanguage === "Tamil" && { backgroundColor: "#62A845" }, 
          ]}
          onPress={() => handleLanguagePress("Tamil")}
        >
          <View style={styles.row}>
            <View>
              <Image
                source={require('../assets/images/roundimg.png')}
                style={styles.roundImage}
              />
              <Image
                source={require('../assets/images/அ.png')}
                style={styles.letterImage}
              />
            </View>
            <View>
              <Text style={styles.languageText}>தமிழ்</Text>
            </View>
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
          <View style={styles.row}>
            <View>
              <Image
                source={require('../assets/images/roundimg.png')}
                style={styles.roundImage}
              />
              <Image
                source={require('../assets/images/ఆ.png')}
                style={styles.letterImage}
              />
            </View>
            <View>
              <Text style={styles.languageText}>తెలుగు</Text>
            </View>
          </View>

        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageBox,
            selectedLanguage === "Kannada" && { backgroundColor: "#62A845" }, 
          ]}
          onPress={() => handleLanguagePress("Kannada")}
        >
          <View style={styles.row}>
            <View>
              <Image
                source={require('../assets/images/roundimg.png')}
                style={styles.roundImage}
              />
              <Image
                source={require('../assets/images/అ.png')}
                style={styles.letterImage}
              />
            </View>
            <View>
              <Text style={styles.languageText}>ಕನ್ನಡ</Text>
            </View>
          </View>

        </TouchableOpacity>
      </View>
      <View style={styles.row}>
      <TouchableOpacity
          style={[
            styles.languageBox,
            selectedLanguage === "Hindi" && { backgroundColor: "#62A845" }, 
          ]}
          onPress={() => handleLanguagePress("Hindi")}
        >
          <View style={styles.row}>
            <View>
              <Image
                source={require('../assets/images/roundimg.png')}
                style={styles.roundImage}
              />
              <Image
                source={require('../assets/images/अ.png')}
                style={styles.letterImage}
              />
            </View>
            <View>
              <Text style={styles.languageText}>हिंदी</Text>
            </View>
          </View>

        </TouchableOpacity>

      </View>
      <View style={{flex: 1,width:'100%',
    justifyContent: 'flex-end',}}>
 <TouchableOpacity
        style={styles.button}
        onPress={() => { {type === 'menu' ? handleSubmit() : finalSubmit()} }}>      
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
  choosetext: {
    fontSize: 14,
    fontWeight: '500',
    left: 10,
    color: 'black'
  },
  image: {
    width: 30,
    height: 30,
    right: 10
  },
  row: {
    width: '80%',
    flexDirection: "row",
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  languageBox: {
    flexDirection: "row",
    width: 135,
    height: 85,
    backgroundColor: "#F1F1F1",
    borderRadius: 5,
    justifyContent: 'space-between',
    alignItems: "center",
    marginHorizontal: 5,
    position: 'relative',
  },
  languageText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    top: 5,
    left: 6,
    color:'black'
  },
  roundImage: {
    width: 40,
    height: 40,
    left: 11,
    position: 'absolute',

  },
  letterImage: {
    width: 25,
    height: 25,
    left: 19,
    top: 9,
    position: 'absolute',
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
export default Language;