import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

const OnBoarding6 = () => {
  return (
    <View style={styles.body}>
      <View style={{ alignItems: 'center', top: '10%' }}>
        <Image
          source={require('../assets/images/bggreen.png')}
          style={styles.roundImage}
        />
      </View>
      <Image
        source={require('../assets/images/farmer.png')}
        style={styles.icon}
      />
      <Image
        source={require('../assets/images/tamil.png')}
        style={{ width: 25, height: 24, top: '21%', left: '63%', position: 'absolute', }} 
        />
      <Image
        source={require('../assets/images/malayalam.png')}
        style={{ width: 33, height: 25, top: '18%', left: '59%', position: 'absolute', }} 
        />
        <Image
        source={require('../assets/images/kannada.png')}
        style={{ width: 35, height: 29, top: '14%', left: '57%', position: 'absolute', }} 
        />
         <Image
        source={require('../assets/images/hindia.png')}
        style={{ width: 24, height: 22, top: '15%', left: '35%', position: 'absolute', }} 
        />
         <Image
        source={require('../assets/images/telugu.png')}
        style={{ width: 43, height: 35, top: '20%', left: '30%', position: 'absolute', }} 
        />
      <View style={{ alignItems: 'center', top: '60%' }}>
        <Text style={styles.text}>
        Multiple Language Support
        </Text>
        <Text style={styles.welcometext}>
        Switch Language and user Friendly
        </Text>
      </View>






    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#F8FFEF",
    flex: 1,
    width: '100%',

  },

  roundImage: {
    width: 230,
    height: 230,
    position: 'absolute',

  },
  icon: {
    width: 98,
    height: 196,
    top: '13%',
    left: '39%',
    position: 'absolute',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#35672D',
  },
  welcometext: {
    fontSize: 14,
    fontWeight: '400',
    color: '#35672D',
    top: 20
  }
}
)
export default OnBoarding6;