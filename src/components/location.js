import React from "react";
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
// import WebView from 'react-native-webview';

const Location = ({ navigation, navigation: { goBack } }) => {

  const handleSubmit = () => {
    navigation.navigate('findmylocation');
  }
  return (
    <View style={styles.body}>
      <View style={styles.rectangle}>
        <TouchableOpacity onPress={() => goBack()}>
          <Image style={styles.back}
            source={require('../assets/images/back.png')} />
        </TouchableOpacity>

        <View style={{ justifyContent: 'space-between', alignItems: "center", flexDirection: "row", width: "100%", }}>
          <Text style={styles.logintext}>
            Choose Location
          </Text>
          <Image style={styles.image}
            source={require('../assets/images/add_location.png')} />
        </View>
      </View>
      <View style={{ top: '20%' }}>
        <Image style={{ height: 100, width: 100, left: 38 }} source={require('../assets/images/map.png')} />
        <Text style={styles.locationtext}> Where is Your Location? </Text>
      </View>

      <View style={{
        flex: 1, width: '100%',
        justifyContent: 'flex-end',
      }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => { handleSubmit() }}>
          <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
            Find My Location
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
  back: {
    height: 25,
    width: 10,
    left: 7
  },
  logintext: {
    fontSize: 16,
    fontWeight: '700',
    left: 20,
    color: 'black'
  },
  choosetext: {
    fontSize: 16,
    fontWeight: '700',
    left: 10,
    color: 'black'
  },
  locationtext: {
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
    top: 10
  },
  image: {
    width: 25,
    height: 30,
    right: 20,
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
export default Location;