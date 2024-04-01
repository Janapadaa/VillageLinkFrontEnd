import React, {useEffect} from "react";
import { View,StyleSheet,Image,Text } from "react-native";
import { getAccessToken } from './Api/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = (props) => {

    
    // useEffect(() => {
    //     setTimeout(() => {
    //         props.navigation.navigate('language'); 
    //     },1500);
    // })
    useEffect(() => {
        const checkAccessToken = async () => {
          try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (accessToken) {
              props.navigation.navigate('buynavigationdrawer');
            } else {
              props.navigation.navigate('language');
            }
          } catch (error) {
            console.error('Error checking access token:', error);
          }
        };
      
        checkAccessToken();
      }, []);

        return(
            <View style={styles.body}>
                <Image source={require('../assets/images/Logo.png')}/>
                <Text style={styles.text}> Janapada </Text>
                <Text style={styles.destext}> The Farmer’s Marketplace </Text>
                <View style={styles.bottomContainer}>
                    <Text style={styles.loading}>Loading...</Text>
                    <Text style={styles.version}>Version 1.0</Text>
                </View>
            </View>
        )
}

const styles= StyleSheet.create({
    body: {
        backgroundColor: "#F8FFEF",
        flex:1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo:{
        alignSelf: 'center',
        width: 100,
        height: 100,
    },
    text:{
        fontSize: 18,
        color: '#7BC824',
        fontWeight:'700',
        textShadowColor:'rgba(0, 0, 0, 0.2)',
        textShadowOffset: {width: -1,height:1},
        textShadowRadius:5,
    },
    destext:{
        fontSize: 14,
        marginTop:20,
        marginBottom: 60,
        color: 'rgba(0, 0, 0, 0.63)',
        fontWeight:'400',
    },
    loading:{
        fontSize: 16,
        color: 'black',
        fontWeight:'700',
    },
    version:{
        fontSize: 14,
        marginTop : 70,
        color: 'rgba(0, 0, 0, 0.63)',
        fontWeight:'400',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
      },
})
export default Splash;