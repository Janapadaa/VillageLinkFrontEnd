import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

const OnBoarding5 = () => {
    return (
        <View style={styles.body}>
            <View style={{alignItems:'center',top:'10%'}}>
            <Image
                    source={require('../assets/images/bggreen.png')}
                    style={styles.roundImage}
                />
                <Image
                    source={require('../assets/images/fertilizers.png')}
                    style={styles.icon}
                />
                
            </View>
            <View style={{alignItems:'center',top:'60%'}}>
            <Text style={styles.text}>
            Manures, Fertilizers and Pesticides
                </Text>
                <Text style={styles.welcometext}>
                Available at janapada
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
        width: 145,
        height: 130,
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
export default OnBoarding5;