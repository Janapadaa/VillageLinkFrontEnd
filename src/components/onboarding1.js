import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

const OnBoarding1 = () => {
    return (
        <View style={styles.body}>
            <View style={{alignItems:'center',top:'10%'}}>
            <Image
                    source={require('../assets/images/bggreen.png')}
                    style={styles.roundImage}
                />
                <Image
                    source={require('../assets/images/namaste.png')}
                    style={styles.icon}
                />
                
            </View>
            <View style={{alignItems:'center',top:'60%'}}>
            <Text style={styles.text}>
                Namastae
                </Text>
                <Text style={styles.welcometext}>
                Welcome to Janapada    
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
        alignItems:'center',
    },

    roundImage: {
        width: 230,
        height: 230,
        position: 'absolute',

    },
    icon: {
        width: 120,
        height: 135,
        top: 50,
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
export default OnBoarding1;