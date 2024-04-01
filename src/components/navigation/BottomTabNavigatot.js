import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SellNavigationDrawer from './SellNavigationDrawer';
import CreateProfile from '../createprofile';
import Language from '../language';
import OtpVerification from '../otpverification';
import OtpScreen from '../otp';
import { Image } from 'react-native';

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
      <BottomTab.Navigator
        tabBarOptions={{
            tabBarShowLabel: false,
          style: {
            height: 60,
            borderTopWidth: 0,
          },
        }}
      >
         <BottomTab.Screen
          name="Profile"
          component={SellNavigationDrawer}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('../../assets/images/profilebottom.png')}
                style={{height:20,}}
              />
            ),
          }}
        />
        <BottomTab.Screen
          name="Wallet"
          component={SellNavigationDrawer}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('../../assets/images/walletmenu.png')}
                style={{height:20,}}
              />
            ),
          }}
        />
        <BottomTab.Screen
          name="Home"
          component={SellNavigationDrawer}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('../../assets/images/homebottom.png')}
                style={{height:20,}}
              />
            ),
          }}
        />
        <BottomTab.Screen
          name="profile"
          component={CreateProfile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('../../assets/images/profilebottom.png')}  // Update the path based on your actual path
                style={{height:20,}}
              />
            ),
          }}
        />
        {/* Add more screens for other bottom tab items */}
      </BottomTab.Navigator>
    );
  };

export default BottomTabNavigator;
