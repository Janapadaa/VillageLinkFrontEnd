import React, { useState, useRef,useEffect } from "react";
import { View, Alert, Dimensions, StyleSheet, Image, Text, TouchableOpacity, } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { PageIndicator } from 'react-native-page-indicator';
import { Slider } from "react-native-elements";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Toast from 'react-native-toast-message'; // Add this line
import { Dropdown } from 'react-native-element-dropdown';
import RNFS from 'react-native-fs';

const Filter = ({ navigation, navigation: { goBack }, route }) => {
  const Id = route?.params?.id
  const title = route?.params?.title
  console.log("id", Id,title);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [sliderValue, setSliderValue] = useState(5000000);
  const [sliderdistance, setSliderDistance] = useState(0);
  
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [age, setAge] = useState(null);
  const [isAgeFocus, setIsAgeFocus] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const [languageData, setLanguageData] = useState(null);
  useEffect(() => {
      const filePath = `${RNFS.DocumentDirectoryPath}/languageData.json`;
  
      RNFS.readFile(filePath, 'utf8')
        .then((data) => {
          setLanguageData(JSON.parse(data)); 
        })
        .catch((error) => {
          console.error("Error reading file:", error);
        });
  }, []);

  const handleselecteCategories = (categories) => {
    // Handle language selection as needed
    console.log(`Selected language: ${categories}`);
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories === categories ? null : categories
    );
  };
  const googlePlacesRef = useRef(null);

  const ageData = [
    { label: '0-2 years', value: '0-2 years' },
    { label: '2-5 years', value: '2-5 years' },
    { label: '5 to 10 years', value: '5 to 10 years' },
    { label: '10-15 years', value: '10-15 years' },
    { label: '15 and above', value: '15 and above' },

];

const handleApplyFilters = (age,distance,from,to) => {
  // Check if all filters are empty
  if (!from && !to && !distance && !lat && !lng && !age) {
    Alert.alert(
      'No Filters Applied',
      'You have not applied any filters. Do you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            // Navigate with default filters (empty)
            navigation.navigate('buylist', {
              from: fromValue,
              to: toValue,
              price: 'price',
              distance: sliderdistance,
              lat: lat,
              lng:lng,
              age: age,
              id: Id,
              title: title,
              type: 'filter',
            });
          },
        },
      ]
    );
    return;
  }
  if (parseFloat(to) <= parseFloat(from)) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'To value must be greater than From value.',
      position: 'top',
      topOffset: 20,
      text1Style: { fontSize: 16, fontWeight: '700' },
      text2Style: { fontSize: 14, fontWeight: '500' },
    });
    return;
  }

 const log ={
  age: age,
  type: 'filter',
  id:Id,
  title: title,
  from: from,
  to: to,
  price: 'price',
  distance: distance,
  lat:lat,
  lng:lng
 }
console.log("loggggg",log);
  navigation.navigate('buylist', {
        age: age,
        type: 'filter',
        id:Id,
        title: title,
        from: from,
        to: to,
        price: 'price',
        distance: distance,
        lat:lat,
        lng:lng
      });
};


  const handleSubmit = () => {

    navigation.navigate('sellsubcategories');
  }
  const handleClearFilter = () => {
    googlePlacesRef.current?.setAddressText('');
    setSliderValue(1000);
    setSliderDistance(0);
  }
  
  const handleApplyDistanse = async () => {
    if (sliderdistance <= 0) {
      // If either "From" or "To" is empty, show an alert
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please Set Values',
        position: 'top',
        topOffset: 20,
        text1Style: { fontSize: 16, fontWeight: '700' },
        text2Style: { fontSize: 14, fontWeight: '500' },


      });
      return;

    }

    // Both fields are filled, navigate to the target screen and pass route parameters
    // navigation.navigate('buylist', { lat: details?.geometry?.location.lat, lng: details?.geometry?.location.lng, id: Id, title: title, type: 'filter' });

    navigation.navigate('buylist', {distance: sliderdistance,type: 'filter',id:Id,title: title });
  };

  // const handleAge = (age) => {
  //   console.log("age",age);
  //   navigation.navigate('buylist', {
  //     age: age,
  //     type: 'filter',
  //     id:Id,
  //     title: title
  //     // Replace 'Your price value here' with the actual price value
  //   });

  // }

  return (
    <ScrollView contentContainerStyle={styles.body}
      showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Toast />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, top: 25 }}
          onPress={() => goBack()} >
          <Image style={{ width: 40, height: 40, }} source={require('../../assets/images/backfilter.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClearFilter} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, top: 25 }}  >
          <Text style={{ color: 'white' }}>{languageData?.filter_screen?.clear_filter_button_text}</Text>
        </TouchableOpacity>

      </View>




      <View style={{ top: '7%', flexGrow: 1, marginHorizontal: '10%' }} >
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: 'white' }}>
        {languageData?.filter_screen?.filter_by_text}
        </Text>
        <TouchableOpacity   onPress={() => handleApplyFilters(age, sliderdistance, fromValue, toValue)} >
          <Text style={{ fontSize: 18, fontWeight: '700', color: 'white' }}>
          {languageData?.filter_screen?.apply_button_text}
          </Text>
        </TouchableOpacity>
        </View>
       
        <View style={{ top: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>
          {languageData?.filter_screen?.by_location_text}
          </Text>
          <GooglePlacesAutocomplete
            keyboardShouldPersistTaps="handled"
            ref={googlePlacesRef}
            placeholder={languageData?.filter_screen?.search_location_placeholder}
            textInputProps={{ placeholderTextColor: 'black' }}
            onPress={(data, details = null) => {
              console.log("location", JSON.stringify(details?.geometry?.location));
              setTimeout(() => {
                setLat(details?.geometry?.location.lat)
                setLng(details?.geometry?.location.lng)
               
              }, 200); // Delay navigation slightly
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
            onFail={error => console.log("error", error)}
            styles={{
              container: {
                flex: 1,
                borderWidth: 0.5,
                borderColor: '#539F46',
                borderRadius: 5,
                elevation: 10,
                shadowColor: 'black',
              },
              textInput: {
                color: 'black'
              },
              description: {
                color: 'black'
              }
            }}
          />
        </View>
        <View style={{ top: '7%', marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>
          {languageData?.filter_screen?.by_price_text}
          </Text>
          <View style={{ backgroundColor: 'white', borderRadius: 15, top: '10%', marginHorizontal: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
              <TextInput
                style={{color:'black'}}
                value={fromValue}
                onChangeText={text => setFromValue(text)}
                placeholder={languageData?.filter_screen?.from_placeholder}
                placeholderTextColor={'black'}
                maxLength={8}
                keyboardType="numeric"
              />
              <Text style={{ marginHorizontal: 10 }}>-</Text>
              <TextInput
                style={{color:'black'}}
                value={toValue}
                onChangeText={text => setToValue(text)}
                placeholder={languageData?.filter_screen?.to_placeholder}
                placeholderTextColor={'black'}
                maxLength={8}
                keyboardType="numeric"
              />
            </View>
            {/* <TouchableOpacity style={{ alignSelf: 'flex-end', right: 20, marginBottom: 5 }} onPress={handleApply}>
              <Text style={{ fontSize: 14, fontWeight: 500, color: 'black' }}>Apply</Text>
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={{ top: '10%', marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>
          {languageData?.filter_screen?.by_distance_text}
          </Text>
          <View style={{ backgroundColor: 'white', borderRadius: 15, top: '10%', marginHorizontal: 20 }}>
            <View style={styles.sliderContainer}>
              <Text style={styles.minValue}>0 Km</Text>
              <Text style={styles.maxValue}>250 Km</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={250}
              step={10}
              value={sliderdistance}
              onValueChange={value => setSliderDistance(value)}
              minimumTrackTintColor="#62A845"
              maximumTrackTintColor="#F2F2F2"
              thumbTintColor='#FFFFFF'
              thumbStyle={{ height: 15, width: 15, borderRadius: 1, borderColor: '#F2F2F2', elevation: 10, borderRadius: 10 }}
            />
            <Text style={styles.currentValue}> {sliderdistance.toFixed(0)} Km</Text>
            {/* <TouchableOpacity style={{ alignSelf: 'flex-end', right: 20, marginBottom: 5 }} onPress={handleApplyDistanse} >
              <Text style={{ fontSize: 14, fontWeight: 500, color: 'black' }}>Apply</Text>
            </TouchableOpacity> */}
          </View>
        </View>
        {/* <View style={{ top: '10%',marginBottom:'40%' }}>
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

        <View style={{ flex:1,flexDirection: 'row', top: '25%', width: '100%' }}>
          <View style={{ width: '100%' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>
          {languageData?.filter_screen?.age_text}
            </Text>
            <View style={{ width: '85%', marginHorizontal: 20 ,borderWidth:2,borderColor:'white',top:15,backgroundColor:'white',borderRadius:10}}>
            <View style={[styles.stockType, { borderColor: age ? '#539F46' : 'red' }]}>
              <Dropdown
                data={ageData}
                placeholderStyle={{ color: 'black' }}
                selectedTextStyle={{ fontSize: 16, color: 'black', left: 4 }}
                maxHeight={300}
                labelField="label"
                itemTextStyle={{ color: 'black' }}
                valueField="value"
                placeholder={!isAgeFocus ? languageData?.filter_screen?.select_placeholder : '...'}
                value={age}
                onFocus={() => setIsAgeFocus(true)}
                onBlur={() => setIsAgeFocus(false)}
                onChange={item => {
                  setAge(item.value);
                  setIsAgeFocus(false);
                 
                }}
              />
            </View>
</View>
           
          </View>


        </View>

      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  body: {
    backgroundColor: "#62A845",
    flexGrow: 1,
    paddingVertical:'5%'
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
    marginHorizontal: 20,
    top: 15
  },
  minValue: {
    color: 'gray',
  },
  maxValue: {
    color: 'gray',
  },
  slider: {
    marginVertical: 5,
    marginHorizontal: 20,
  },
  currentValue: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 20,
    marginHorizontal: 20,
    color: '#848484'
  },

})
export default Filter;
