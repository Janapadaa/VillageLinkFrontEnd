import React, { useState } from "react";
import { View, Animated, Dimensions, StyleSheet, Image, Text, TouchableOpacity, } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { PageIndicator } from 'react-native-page-indicator';
import { Slider } from "react-native-elements";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const Filter = ({ navigation, navigation: { goBack },route }) => {
    const Id = route?.params?.id
    const title = route?.params?.title
console.log("id",Id);
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [sliderValue, setSliderValue] = useState(200000);
    const [sliderdistance,setSliderDistance]=useState(10);
    const [sliderage,setSliderAge]=useState(12);

    const handleselecteCategories = (categories) => {
        // Handle language selection as needed
        console.log(`Selected language: ${categories}`);
        setSelectedCategories((prevSelectedCategories) =>
            prevSelectedCategories === categories ? null : categories
        );
    };

    const handleSubmit = () => {

        navigation.navigate('sellsubcategories');
    }
    

    return (
        <ScrollView contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, top: 25 }}
                    onPress={() => goBack()} >
                    <Image style={{ width: 40, height: 40, }} source={require('../../assets/images/backfilter.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, top: 25 }} >
                    <Text style={{ color: 'white' }}>Clear filter</Text>
                </TouchableOpacity>

            </View>




            <View style={{ top:'7%', flexGrow:1,marginHorizontal: '10%'}} >
                <Text style={{ fontSize: 18, fontWeight: '700', color: 'white' }}>
                    Filter By
                </Text>
                <View style={{ top: 15 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>
                        By Location
                    </Text>
                    <GooglePlacesAutocomplete           
                        placeholder="Search  location"
                        onPress={(data, details = null) => {
                            console.log("location",JSON.stringify(details?.geometry?.location));
                             navigation.navigate('buylist', { lat: details?.geometry?.location.lat, lng : details?.geometry?.location.lng ,id:Id,title:title});

                        }}
                        GooglePlacesDetailsQuery={{
                            fields: 'geometry',
                          }}
                          fetchDetails={true}
                        query={{
                            key: 'AIzaSyCAVZr638AD5Welu4kHBGaPbYkHxy1-fIU',
                            language: 'en', 
                            components: 'country:in', 
                        }}
                        onFail={error => console.log("error",error)}
                        styles={{
                            container: {
                                flex: 1 ,
                                borderWidth:0.5,
                                borderColor:'#539F46',
                                borderRadius:5,
                                elevation: 10,
                                shadowColor: 'black',
                            },
                            listView: {},
                        }}
                    />
                </View>
                <View style={{ top: '7%',marginBottom:20 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>
                        By Price
                    </Text>
                    <View style={{backgroundColor:'white',borderRadius:15,top:'10%',marginHorizontal:20}}>
                <View style={styles.sliderContainer}>
                    <Text style={styles.minValue}>₹ 1000</Text>
                    <Text style={styles.maxValue}>₹ 200000</Text>
                    </View>
                <Slider
                    style={styles.slider}
                    minimumValue={1000}
                    maximumValue={200000}
                    step={1000}
                    value={sliderValue}
                    onValueChange={value => setSliderValue(value)}
                    minimumTrackTintColor="#62A845"
                    maximumTrackTintColor="#F2F2F2"
                    thumbTintColor='#FFFFFF'
                    thumbStyle={{height:15,width:15,borderRadius:1,borderColor:'#F2F2F2',elevation:10,borderRadius:10}}
                />
                <Text style={styles.currentValue}>₹ {sliderValue.toFixed(0)}</Text>
                <TouchableOpacity style={{alignSelf:'flex-end',right:20,marginBottom:5}} >
                    <Text style={{fontSize:14,fontWeight:500,color:'black'}}>Apply</Text>
                </TouchableOpacity>
                </View>
                </View>
                <View style={{ top: '10%',marginBottom:20 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>
                    By Distance
                    </Text>
                    <View style={{backgroundColor:'white',borderRadius:15,top:'10%',marginHorizontal:20}}>
                <View style={styles.sliderContainer}>
                    <Text style={styles.minValue}>0 Km</Text>
                    <Text style={styles.maxValue}>10 Km</Text>
                    </View>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    value={sliderdistance}
                    onValueChange={value => setSliderDistance(value)}
                    minimumTrackTintColor="#62A845"
                    maximumTrackTintColor="#F2F2F2"
                    thumbTintColor='#FFFFFF'
                    thumbStyle={{height:15,width:15,borderRadius:1,borderColor:'#F2F2F2',elevation:10,borderRadius:10}}
                />
                <Text style={styles.currentValue}> {sliderdistance.toFixed(0)} Km</Text>
                <TouchableOpacity style={{alignSelf:'flex-end',right:20,marginBottom:5}} >
                    <Text style={{fontSize:14,fontWeight:500,color:'black'}}>Apply</Text>
                </TouchableOpacity>
                </View>
                </View>
                {/* <View style={{ top: '10%',marginBottom:50 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>
                    By Age
                    </Text>
                    <View style={{backgroundColor:'white',borderRadius:15,top:'10%',marginHorizontal:20,marginBottom:60}}>
                <View style={styles.sliderContainer}>
                    <Text style={styles.minValue}>1 Year</Text>
                    <Text style={styles.maxValue}>12 Year</Text>
                    </View>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={12}
                    step={1}
                    value={sliderage}
                    onValueChange={value => setSliderAge(value)}
                    minimumTrackTintColor="#62A845"
                    maximumTrackTintColor="#F2F2F2"
                    thumbTintColor='#FFFFFF'
                    thumbStyle={{height:15,width:15,borderRadius:1,borderColor:'#F2F2F2',elevation:10,borderRadius:10}}
                />
                <Text style={styles.currentValue}> {sliderage.toFixed(0)} Year</Text>
                <TouchableOpacity style={{alignSelf:'flex-end',right:20,}} >
                    <Text style={{fontSize:14,fontWeight:500,color:'black',}}>Apply</Text>
                </TouchableOpacity>
                </View>
                </View> */}
                
             </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    body: {
        backgroundColor: "#62A845",
        flexGrow: 1,
    },
    searchButton: {
        height: 40,
        backgroundColor: '#EFF1F3',
        borderRadius: 10,
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    searchicon: {
        width: 30,
        height: 30,
        top: 5,
        right: 30,
        tintColor: 'grey'
    },
    sliderContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal:20,
            top:15
          },
          minValue: {
            color: 'gray',
          },
          maxValue: {
            color: 'gray',
          },
          slider: {
            marginVertical: 5,
            marginHorizontal:20,
          },
          currentValue: {
            fontSize: 12,
            fontWeight: '700',
            marginBottom: 20,
            marginHorizontal:20,
            color:'#848484'
          },

})
export default Filter;
