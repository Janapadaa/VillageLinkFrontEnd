import React from "react";
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import WebView from 'react-native-webview';

const PrivacyPolicy = (props) => {
  const handleSubmit = () => {
    props.navigation.navigate('otpscreen');
  };

  return (
    <View style={styles.body}>
      <View style={styles.rectangle}>
        <Text style={styles.choosetext}>
          Terms and Conditions
        </Text>
        <Image style={styles.image}
          source={require('../assets/images/local_police.png')} />
      </View>
      <ScrollView style={{ height: 300 }}>
        {/* <WebView 
          source={{ uri: 'https://your-converted-docx-file-url' }} 
          style={{ flex: 1 }}
        /> */}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>
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
    marginBottom: 50,
  },
  choosetext: {
    fontSize: 16,
    fontWeight: '700',
    left: 10,
    color: 'black',
  },
  image: {
    width: 30,
    height: 30,
    right: 10,
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
    marginTop: 30,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  footer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  }
});

export default PrivacyPolicy;
