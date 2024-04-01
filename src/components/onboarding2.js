import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

const OnBoarding2 = () => {
    return (
        <View style={styles.body}>
            <View style={{alignItems:'center',top:'10%'}}>
            <Image
                    source={require('../assets/images/bggreen.png')}
                    style={styles.roundImage}
                />
            </View>
            <Image
                    source={require('../assets/images/cow.png')}
                    style={styles.icon}
                />
            <View style={{alignItems:'center',top:'60%'}}>
            <Text style={styles.text}>
            Buy and Sell Your Cattle

                </Text>
                <Text style={styles.welcometext}>
                Janapaada is a your one -stop    
                </Text>
                <Text style={styles.welcometext}>
                Former marketplace
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
        width: 191,
        height: 209,
        top: '13%',
        left:'21%',
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
export default OnBoarding2;