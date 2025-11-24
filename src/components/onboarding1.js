import React,{useEffect,useState} from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import RNFS from 'react-native-fs';
import { useLanguage } from "./Api/LanguageContext";

const OnBoarding1 = () => {
  const { languageData } = useLanguage();

    // const [languageData, setLanguageData] = useState(null);
    // useEffect(() => {
    //     const filePath = `${RNFS.DocumentDirectoryPath}/languageData.json`;
    
    //     RNFS.readFile(filePath, 'utf8')
    //       .then((data) => {
    //         setLanguageData(JSON.parse(data)); 
    //       })
    //       .catch((error) => {
    //         console.error("Error reading file:", error);
    //       });
    // }, []);
    const navigation = useNavigation();
    const skip = () => {
        navigation.navigate('otpscreen');
        // navigation.navigate('privacypolicy');
      }
      useEffect(() => {
        const backAction = () => {
          BackHandler.exitApp();
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => backHandler.remove();
      }, []);
    
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
            {languageData?.intro_screen_1?.title}

                </Text>
                <Text style={styles.welcometext}>
                {languageData?.intro_screen_1?.content}  
                </Text>
            </View>


            <TouchableOpacity style={{alignItems:'center',top:'70%'}}>
                <Text style={{ fontSize: 16,
        fontWeight: '600',
        color: '#35672D',
        textDecorationLine: 'underline',}}
        onPress={() => { skip() }}>
                    {languageData?.intro_screen_1?.skipText}
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