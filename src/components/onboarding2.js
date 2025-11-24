import React,{useEffect,useState} from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { useLanguage } from "./Api/LanguageContext";

const OnBoarding2 = () => {
     const { languageData } = useLanguage();
    const navigation = useNavigation();
   
    const skip = () => {
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
            </View>
            <Image
                    source={require('../assets/images/cow.png')}
                    style={styles.icon}
                />
            <View style={{alignItems:'center',top:'60%'}}>
            <Text style={styles.text}>
            {languageData?.intro_screen_2?.title}


                </Text>
                <Text style={styles.welcometext}>
                {languageData?.intro_screen_2?.content}
                </Text>
                {/* <Text style={styles.welcometext}>
                The Rural E-Market Place
                </Text> */}
            </View>
            <TouchableOpacity style={{alignItems:'center',top:'70%'}}>
                <Text style={{ fontSize: 16,
        fontWeight: '600',
        color: '#35672D',
        textDecorationLine: 'underline',}}
        onPress={() => { skip() }}>
                {languageData?.intro_screen_2?.skipText}
                </Text>
            </TouchableOpacity>
                
            
                
            


        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#FFFFFF',
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