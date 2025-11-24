import React, { useRef, useState,useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity, TextInput, BackHandler,Linking } from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-element-dropdown';
import { BASE_URL, API_KEY, ACCEPT_LANGUAGE, getAccessToken, IMG_URL,getAcceptLanguage } from "./Api/apiConfig";
import axios from 'axios';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, } from "react-native-alert-notification";
import ImagePicker from 'react-native-image-crop-picker';
import CheckBox from '@react-native-community/checkbox';
// import WebView from 'react-native-webview';
import { PermissionsAndroid, Platform } from 'react-native';
// import Toast,{ErrorToast} from 'react-native-toast-message'; // Add this line
// import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import Toast from 'react-native-simple-toast';
import RNFS from 'react-native-fs';
import { useLanguage } from './Api/LanguageContext';

const CreateProfile = ({ navigation, navigation: { goBack }, route }) => {
  const [isChecked, setIsChecked] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [username, setusername] = useState('')
  const [age, setage] = useState('')
  const [referralCode, setreferralCode] = useState('')
  const [editedUsername, setEditedUsername] = useState(''); // State for user-edited username
  const [editedAge, setEditedAge] = useState(''); 
  const [editedGender, setEditedGender] = useState(''); 
  const [gallery, setGallery] = useState(false);
  const type = route.params.type;
  const from = route.params.from;
  console.log("createprofile_type", type,from);
  const usernameRef = useRef(null);
  const ageRef = useRef(null);
  const referralRef = useRef(null);
 const { languageData } = useLanguage();
  

  
  const getuserdata = async () => {
    try {
      const accessToken = await getAccessToken();
      const lang = await getAcceptLanguage();

      const response = await axios.get(
        `${BASE_URL}/user`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': API_KEY,
            'Accept-Language': lang,
          },
        }
      );
      console.log("createpro", response.data.data);
      setValue(response.data.data.gender);
      setage(String(response.data.data.age));
      setusername(response.data.data.userName)
      setImageUri(response.data.data.image)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleTermsClick = () => {
   // Linking.canOpenURL('https://janapada-s3.s3.amazonaws.com/terms4567.pdf');
     Linking.openURL('https://villagelink.in/terms-and-conditions-and-privacy-policy/');
  };

  React.useEffect(() => {

    if (type === 'view') {
      getuserdata();
    }
    
  
  }, [])

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Check the route name to determine the behavior
      console.log("dsfsd");
      if (type === 'view' && from === 'buy') {
        // If accessed from the Home screen, navigate to the Home screen
        navigation.navigate('buynavigationdrawer');
        return true; // Prevent the default back button behavior
      } else if(type === 'view' && from === 'sell') {
        navigation.navigate('sellnavigationdrawer');
        return true; 
      } else {
        return false;
      }
    });

    return () => backHandler.remove();
  }, [navigation, route]);

  
  const data = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];



  const handleGenderChange = (value) => {
    setSelectedGender(value);
  };

  const handleGoBack = () => {
    if (type === 'view' && from === 'buy') {
      // If accessed from the Home screen, navigate to the Home screen
      navigation.navigate('buynavigationdrawer');

      return true; // Prevent the default back button behavior
    } else if(type === 'view' && from === 'sell') {
      navigation.navigate('sellnavigationdrawer');
      
    } else {
      goBack()
    }
  };
 
  const validateProfileForm = () => {
    if(age < 18){
      console.log("less");
      Toast.showWithGravity(
        'Age must be 18 or above.',
        Toast.SHORT,
        Toast.BOTTOM,
        
      );
      return false;
    }
    if (!username  || !age  || !value ) {
      const numericAge = parseInt(age, 10);

      
      // let errorMessage = 'Please fill in the following mandatory fields:\n';
      // if (!username) errorMessage += 'Name\n';
      // if (!age) errorMessage += 'Age\n';
      // if (!value) errorMessage += 'Gender\n';
      Toast.showWithGravity(
        'Please fill all following mandatory fields',
        Toast.SHORT,
        Toast.BOTTOM,
        
      );
      // Toast.show({
      //   type: 'success',
      //   text1: 'Error',
      //   text2: 'Please fill all following mandatory fields',
       
       
        
        
      // });
            return false;
    }
    return true;
  };

  const handleSubmit = async () => {

    try {
      const isFormValid = validateProfileForm();

      if (!isFormValid) {
        return;
      }

      let formData = new FormData();

      formData.append('userName', username);
      formData.append('age', age);
      formData.append('gender', value);
      formData.append('referralCode', referralCode);

      if (imageUri) {
        // If an image is selected, append it to the form data
        const imageUriParts = imageUri.split('.');
        const fileType = imageUriParts[imageUriParts.length - 1];

        formData.append('image', {
          uri: imageUri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }
      console.log(formData);
      const accessToken = await getAccessToken(); // Await the token retrieval
      const lang = await getAcceptLanguage();

      const response = await axios.put(
        `${BASE_URL}/user`,
        formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`,
          'x-api-key': API_KEY,
          'Accept-Language': lang,
        },
      });

      // Handle the response accordingly
      console.log('API create response:', response.data);
      if(type === 'view'){
        if(from === 'sell'){
          navigation.navigate('buynavigationdrawer');
        }else{
          navigation.navigate('sellnavigationdrawer');
        }
      }else{
        navigation.navigate('findmylocation');
      }
    } catch (error) {
      console.error('API Error:', error.response.data);
      Toast.showWithGravity(
        error.response.data.message,
        Toast.SHORT,
        Toast.BOTTOM,
        
      );
      // Toast.show({
      //   type: 'error',
      //   text1: 'Error',
      //   text2: error.response.data.message,
      // autoHide:true,
      
      //   position:'bottom',
      //   visibilityTime:500,
      //   text1Style:{fontSize:16,fontWeight:'700'},
      //   text2Style:{fontSize:14,fontWeight:'500'},
        
       
      // });

    }


  };
  const finalSubmit = () => {
    navigation.navigate('buyorsell');
  }


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleImagePicker = async () => {
    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        compressImageQuality: 0.8,
      });
      console.log("img",image.path);
      if (image) {
        setGallery(true)
        setImageUri(image.path);
        toggleModal(); 
      }
      
    } catch (error) {
      console.log(error);
    }
  };
  // const handleImagePicker = () => {
  //   toggleModal();
  //   const options = {
  //     title: 'Select Image',
  //     mediaType: 'photo',
  //     maxWidth: 300,
  //     maxHeight: 300,
  //     quality: 1,
  //     path: 'images',
  //   };
    // launchImageLibrary(options, async (response) => {
    //   if (!response.didCancel && !response.error) {
    //     console.log("img",response.assets[0].uri);
    //     setImageUri(response.assets[0].uri);
    //   }
    // });
  // };

  const checkCameraPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'This app needs camera permission to take photos.',
                    buttonPositive: 'OK',
                    buttonNegative: 'Cancel',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Camera permission granted');
                // Now you can open the camera
                handleCameraCapture();
            } else {
                console.log('Camera permission denied');
            }
        } catch (error) {
            console.error('Error checking camera permission:', error);
        }
    }
};

  const handleCameraCapture = () => {
    toggleModal();
    const options = {
      title: 'Select Image',
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
      path: 'images',
    };
    launchCamera(options, async (response) => {
      if (!response.didCancel && !response.error) {
       setGallery(true);
        setImageUri(response.assets[0].uri);
      }
    });
  };
  const handleUsernameChange = (text) => {
    setusername(text)
    
  };

  const handleAgeChnage = (text) => {
    setage(text)
    
  };

  // const toastConfig = {
  //   /*
  //     Overwrite 'success' type,
  //     by modifying the existing `BaseToast` component
  //   */
  //   success: (props) => (
  //     <BaseToast
  //       {...props}
  //       lo
  //       style={{
  //         borderLeftColor:'green',
  //         borderLeftWidth:7,
  //         width:'90%',
  //         height:70,
  //         backgroundColor:'white',
          
  //       }}
  //       contentContainerStyle={{paddingHorizontal:15}}
  //       text1Style={{
  //         fontSize:17,
  //         fontWeight:'700',
  //       }}
  //       text2Style={{
  //         fontSize:14
  //       }}
  //     />
  //   ),
  //   /*
  //     Overwrite 'error' type,
  //     by modifying the existing `ErrorToast` component
  //   */
  //   error: (props) => (
  //     <ErrorToast
  //       {...props}
  //       text2NumberOfLines={3}
  //       style={{
  //         borderLeftColor:'red',
  //         borderLeftWidth:7,
  //         width:'90%',
  //         height:70,
  //         backgroundColor:'white'
  //       }}
  //       contentContainerStyle={{paddingHorizontal:15}}
  //       text1Style={{
  //         fontSize:17,
  //         fontWeight:'700',
  //       }}
  //       text2Style={{
  //         fontSize:14
  //       }}
  //     />
  //   ),
  //   /*
  //     Or create a completely new type - `tomatoToast`,
  //     building the layout from scratch.
  
  //     I can consume any custom `props` I want.
  //     They will be passed when calling the `show` method (see below)
  //   */
  //   // tomatoToast: ({ text1, props }) => (
  //   //   <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
  //   //     <Text>{text1}</Text>
  //   //     <Text>{props.uuid}</Text>
  //   //   </View>
  //   // )
  // };
  

  return (

    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.body}>
        {/* <Toast config={toastConfig}/> */}
      <View style={styles.rectangle}>
        {/* <TouchableOpacity onPress={() => handleGoBack()}>
          <Image style={styles.back}
            source={require('../assets/images/back.png')} />
        </TouchableOpacity> */}

        <View style={{ justifyContent: 'center', alignItems: "center", flexDirection: "row", width: "100%", }}>
          <Text style={styles.logintext}>
          {type === 'view' 
         ? languageData?.edit_profile_screen?.title 
         : languageData?.edit_profile_screen?.title}
          </Text>
          {/* <Image style={styles.image}
            source={require('../assets/images/badge.png')} /> */}
        </View>
      </View>

      <View style={{ width: '85%', height: '70%', borderColor: '#62A845', borderWidth:1.5,borderRadius:20}}>

        <View style={{ justifyContent: 'center', alignItems: 'center' }} >
          {imageUri ? (
           gallery ? (
            <TouchableOpacity style={styles.roundImagePlaceholder} onPress={toggleModal}>
              <Image source={{ uri: imageUri }} style={styles.roundImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.roundImagePlaceholder} onPress={toggleModal}>
              <Image source={{ uri: `${IMG_URL}${imageUri}` }} style={styles.roundImage} />
            </TouchableOpacity>
          )
          ) : (
            <TouchableOpacity style={styles.roundImagePlaceholder} onPress={() => { toggleModal() }}>
              <Image source={require('../assets/images/account1.png')} style={{ width: '85%', height: '90%',top:5 }} />
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity style={styles.cameraIcon} onPress={() => { toggleModal() }}>
            <Image source={require('../assets/images/camera.png')} />
          </TouchableOpacity> */}
        </View>

        <View style={{ flexDirection: 'column', width: '80%', left: 30, marginTop: '15%' }}>
          <Text style={styles.detailsText}>
          {languageData?.edit_profile_screen?.name}* 
      </Text>
        <TouchableOpacity onPress={() =>usernameRef.current && usernameRef.current.focus()} style={styles.nameInput}>
      
      <TextInput
        ref={usernameRef}
        placeholder="Enter Your Name"
        placeholderTextColor='black'
        keyboardType='ascii-capable'
        style={styles.numberinput}
        onChangeText={(text) => handleUsernameChange(text)}
        defaultValue={username}
      />
    </TouchableOpacity>
          <View style={{ flexDirection: 'row', top: 20, width: '100%' }}>
            <View style={{ width: '60%' }}>
              <Text style={styles.detailsText}>
              {languageData?.edit_profile_screen?.age}* 
              </Text>
              <TouchableOpacity onPress={() => ageRef.current && ageRef.current.focus()} style={styles.ageInput}>
                <TextInput
                 ref={ageRef}
                  placeholder={languageData?.edit_profile_screen?.age}
                  placeholderTextColor='black'
                  keyboardType='number-pad'
                  style={styles.numberinput}
                  maxLength={2}
                  onChangeText={(text) => handleAgeChnage(text)}
              //  value={ age}
                defaultValue={age}
                 

                />
              </TouchableOpacity>
            </View>
            <View style={{ width: '80%' }}>
              <Text style={styles.detailsText}>
              {languageData?.edit_profile_screen?.gender}* 
              </Text>
              <View style={styles.genderInput}>
                <Dropdown

                  placeholderStyle={styles.placeholderStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={{color:'black'}}
                  iconStyle={styles.iconStyle}
                  data={data}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? '  Select' : '...'}
                  value={value}
                  selectedTextStyle={{color:'black',paddingLeft:5}}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setValue(item.value);
                    setIsFocus(false);
                  }}
                  
                  
                 
                />

              </View>
            </View>

          </View>

          <View style={{ marginTop: 50 }}>
            <Text style={styles.detailsText}>
            {languageData?.edit_profile_screen?.referral_code}
            </Text>
            <TouchableOpacity onPress={() => referralRef.current && referralRef.current.focus()} style={styles.referalInput}>
              <TextInput
                placeholder= {languageData?.edit_profile_screen?.referral_code_placeholder}
                placeholderTextColor='black'
                keyboardType='number-pad'
                style={styles.numberinput}
                maxLength={10}
                onChangeText={(text) => setreferralCode(text)}
              />
            </TouchableOpacity>
          </View>

        { type !== 'view' && <View style={styles.termsContainer}>
            <CheckBox
              value={isChecked}
              onValueChange={setIsChecked}
              
              style={styles.checkbox}
            />
            <Text style={styles.termsText} onPress={handleTermsClick}>
              I agree to the terms and conditions
            </Text>
          </View>} 
          

      <AlertNotificationRoot/>

        </View>

      </View>



      <Modal isVisible={isModalVisible} onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => handleImagePicker('gallery')}>
            <Text style={styles.modalText}>Choose from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={checkCameraPermission}>
            <Text style={styles.modalText}>Capture with Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.modalText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>




      <View style={{
        flex: 1, width: '100%',
        justifyContent: 'flex-end',
      }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => { handleSubmit() }}>
          <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
          {languageData?.edit_profile_screen?.save_button_text}
          </Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}
const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: 'center',
    paddingVertical:'5%'
  },
  rectangle: {
    flexDirection: "row",
    borderWidth: 1,
    width: "90%",
    height: 50,
    borderColor: "#509E46",
    borderRadius: 5,
    alignItems: "center",
    top: 20,
    marginBottom: 50,
    position:'relative'

  },
  placeholderStyle: {
    fontSize: 16,
    color: 'black'
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black'
  },

  back: {
    height: 25,
    width: 10,
    left: 7
  },
  numberinput: {
    fontSize: 14,
    fontWeight: '400',

    left: 5,
    color: 'black'
  },
  detailsText: {
    color: 'black',
    fontSize: 12,
    fontWeight: '500'
  },
  nameInput: {
    flexDirection: "row",
    borderWidth: 1,
    height: 40,
    borderColor: "#62A845",
    shadowColor:'#62A845',
    shadowRadius:3,
    elevation:3,
    borderRadius: 2,
    backgroundColor: 'white',
    top: 10,
  },
  ageInput: {
    borderWidth: 1,
    width: '50%',
    height: 40,
    borderColor: "#62A845",
    shadowColor:'#62A845',
    shadowRadius:3,
    elevation:3,
    borderRadius: 2,
    backgroundColor: 'white',
    top: 10,
  },
  genderInput: {
    borderWidth: 1,
    width: '50%',
    height: 40,
    borderColor: "#62A845",
    shadowColor:'#62A845',
    shadowRadius:3,
    elevation:3,
    borderRadius: 2,
    backgroundColor: 'white',
    top: 10,
  },
  referalInput: {
    flexDirection: "row",
    borderWidth: 1,
    height: 40,
    borderColor: "#62A845",
    shadowColor:'#62A845',
    shadowRadius:3,
    elevation:3,
    borderRadius: 2,
    backgroundColor: 'white',
    top: 10,
  },

  logintext: {
    fontSize: 16,
    fontWeight: '700',
    
    color: 'black'
  },

  image: {
    width: 35,
    height: 35,
    right: 20,
    top: 5
  },
  roundImage: {
    width: 120,
    height: 120,
    borderRadius: 75,

  },
  roundImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 75,
    top: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    top: 95,
    paddingLeft: 100,
    backgroundColor: 'transparent',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
    color: 'black'
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdownLabel: {
    fontSize: 16,
  },
  dropdownPicker: {
    backgroundColor: '#fff',
  },
  selectedText: {
    marginTop: 10,
    fontSize: 18,
    color: 'green',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "space-between",
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    marginRight: 10,
   
    
  },
  termsText: {
    fontSize: 14,
    color: '#62A845',
    textDecorationLine: 'underline',
  },

})
export default CreateProfile;