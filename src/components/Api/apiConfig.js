export const BASE_URL = 'http://34.202.39.56/api/v1/app';
export const API_KEY = 't2tO6Sn6pdFBu0wd3yiWtM49gV8ryGBON2tpHc5NdjVzROI2jbGYLa97ZXlIwnAhg6zbpNUnKcL4H0q1sNBPt1d3x00aM8kZ82F7sYy1N4WhPCY2HE8F6NPvzhClfa5w';
export const ACCEPT_LANGUAGE = 'en'; 
export const IMG_URL ='https://janapada-s3.s3.amazonaws.com/';
let ACCESS_TOKEN = ''; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setAccessToken = async (token) => {
  console.log('Setting Access Token:', token);
  ACCESS_TOKEN = token;
  await AsyncStorage.setItem('accessToken', ACCESS_TOKEN);

};  

export const getAccessToken = async () => {
    const storedToken = await AsyncStorage.getItem('accessToken');
    console.log('Retrieved Access Token:', storedToken);
    return storedToken;
};

export const clearAccessToken = async () => {
  console.log('Clearing Access Token');
  ACCESS_TOKEN = '';
  await AsyncStorage.removeItem('accessToken');

};