import React,{useEffect,useState} from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { useLanguage } from "./Api/LanguageContext";

const OnBoarding3 = () => {
       const { languageData } = useLanguage();
  
    const navigation = useNavigation();
   
    const handleSubmit = () => {
        navigation.navigate('otpscreen');
        // navigation.navigate('privacypolicy');
      }
    return (
        <View style={styles.body}>
            <View style={{alignItems:'center',top:'10%'}}>
            <Image
                    source={require('../assets/images/bggreen.png')}
                    style={styles.roundImage}
                />
                <Image
                    source={require('../assets/images/tractor.png')}
                    style={styles.icon}
                />
                
            </View>
            <View style={{alignItems:'center',top:'60%'}}>
            <Text style={styles.text}>
            {languageData?.intro_screen_3?.title}

                </Text>
                <Text style={styles.welcometext}>
                {languageData?.intro_screen_3?.content}
                </Text>
                {/* <Text style={styles.welcometext}>
                Hardware nearby
                </Text> */}
            </View>

            {/* <TouchableOpacity style={{alignItems:'center',top:'70%'}}> */}
                {/* <Text style={{ fontSize: 16,
        fontWeight: '600',
        color: '#35672D',
        textDecorationLine: 'underline',}}
        onPress={() => { skip() }}>
                    Skip
                </Text> */}
                  <View style={{
        flex: 1, width: '100%',
        justifyContent: 'flex-end',
      }}>
  <TouchableOpacity
          style={styles.button}
          onPress={() => { handleSubmit() }}>
          <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
            Continue
          </Text>

        </TouchableOpacity>
      </View>
                
            {/* </TouchableOpacity> */}
                
            
                
            


        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        width: '100%',
        alignItems:'center',
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
export default OnBoarding3;