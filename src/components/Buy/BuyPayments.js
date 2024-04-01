import React, { useState } from "react";
import { View, Animated, Dimensions, StyleSheet, Image, Text, TouchableOpacity,Alert,Linking } from "react-native";
import { SearchBar } from 'react-native-elements';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { PageIndicator } from 'react-native-page-indicator';

const BuyPayments = ({ navigation, navigation: { goBack } }) => {


   
   
  

    return (
        <View style={styles.body}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, top: 25 }}
                    onPress={() => goBack()} >
                    <Image style={{ width: 40, height: 40 }} source={require('../../assets/images/backround.png')} />
                </TouchableOpacity>
               
            </View>


            <View style={{ flexDirection: 'row',justifyContent:'center', top: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', top: '8%', color: '#539F46' }}>
                    Balance
                </Text>
               

            </View>
            <View style={{justifyContent:'center',alignItems:'center'}}>
            <View style={{top:20,height:'50%',width:'80%',backgroundColor:'#F3FBF4',borderWidth:1,borderRadius:25, borderColor:'#539F46',elevation:10,justifyContent:'center',}}>
                <View style={{flexDirection:'row'}}>
                <Text style={{ fontSize: 18, fontWeight: '700',  color: '#539F46',left:10 }}>
                    My Available  Balance
                </Text>
                <Text style={{fontSize:16,fontWeight:'700',color:'black',left:45,top:2}}>
                ₹ 100
                </Text>
                </View>
                <View style={{justifyContent:'center',alignItems:'center',top:20}}>
                <TouchableOpacity style={styles.sendButton} >
            <Text style={styles.sendButtonText}>Recharge</Text>
          </TouchableOpacity>
                </View>
               
                
          
           </View>
            </View>
          


        </View>
    )
}
const styles = StyleSheet.create({
    body: {
        backgroundColor: "white",
        flex: 1,
    },
    sendButton: {
        width:'30%',
        backgroundColor: "#539F46",
       
        borderRadius: 8,
        padding: 10,
        alignItems: "center",
      },
      sendButtonText: {
        color: "white",
        fontWeight: "bold",
      },



})
export default BuyPayments;