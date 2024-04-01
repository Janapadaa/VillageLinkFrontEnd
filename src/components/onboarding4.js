import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

const OnBoarding4 = () => {
    return (
        <View style={styles.body}>
            <View style={{alignItems:'center',top:'10%'}}>
            <Image
                    source={require('../assets/images/bggreen.png')}
                    style={styles.roundImage}
                />
                <Image
                    source={require('../assets/images/fibers.png')}
                    style={styles.icon}
                />
                
            </View>
            <View style={{alignItems:'center',top:'60%'}}>
            <Text style={styles.text}>
            Buy Feeds and Suppliments
                </Text>
                <Text style={styles.welcometext}>
                High protein nutrients and food
                </Text>
                <Text style={styles.welcometext}>
                are availaable at janapada
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
        width: 195,
        height: 145,
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
export default OnBoarding4;