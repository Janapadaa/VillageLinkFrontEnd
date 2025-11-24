import React, { useEffect } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { getAccessToken } from './Api/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { setDeviceToken } from "./Api/apiConfig";

const Splash = (props) => {

  if (!firebase.apps.length) {
    firebase.initializeApp();
  } else {
    firebase.app(); // if already initialized, use that one
  }

  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        
        // Delay navigation by 5 seconds (5000 milliseconds)
        setTimeout(() => {
          if (accessToken) {
            props.navigation.navigate('buynavigationdrawer');
          } else {
            // props.navigation.navigate('onboardingscreens');
            props.navigation.navigate('language');

          }
        }, 3000); // 5-second delay
      } catch (error) {
        console.error('Error checking access token:', error);
      }
    };

    checkAccessToken();
  }, []);

  useEffect(() => {
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      } else {
        console.log("Failed the status ", authStatus);
      }
    };

    const getToken = async () => {
      const token = await messaging().getToken();
      console.log("FCM TOKEN:", token);
      await setDeviceToken(token);
    };

    requestUserPermission();
    getToken();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.body}>
      <Image source={require('../assets/images/logohome.png')} style={styles.logo} />
      <Text style={styles.destext}> The Rural E-Market Place </Text>
      <View style={styles.bottomContainer}>
        <Text style={styles.loading}>Loading...</Text>
        <Text style={styles.version}>Version 1.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#F8FFEF",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    alignSelf: 'center',
    width: 150,
    height: 100,
  },
  destext: {
    fontSize: 14,
    marginBottom: 30,
    color: 'rgba(0, 0, 0, 0.63)',
    fontWeight: '400',
  },
  loading: {
    fontSize: 16,
    color: 'black',
    fontWeight: '700',
  },
  version: {
    fontSize: 14,
    marginTop: 70,
    color: 'rgba(0, 0, 0, 0.63)',
    fontWeight: '400',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
});

export default Splash;
