import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-element-dropdown';
import { BASE_URL, API_KEY, ACCEPT_LANGUAGE, getAccessToken, IMG_URL } from "./Api/apiConfig";
import axios from 'axios';

// import WebView from 'react-native-webview';

const CreateProfile = ({ navigation, navigation: { goBack }, route }) => {
  const [imageUri, setImageUri] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [username, setusername] = useState('')
  const [age, setage] = useState('')
  const [referralCode, setreferralCode] = useState('')

  const type = route.params.type;
  console.log("createprofile_type", type);


  const getuserdata = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `${BASE_URL}/user`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': API_KEY,
            'Accept-Language': ACCEPT_LANGUAGE,
          },
        }
      );
      console.log("createpro", response.data.data);
      setValue(response.data.data.gender);
      setage(String(response.data.data.age));
      setusername(response.data.data.userName)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  if (type === 'view') {
    getuserdata();
  }

  const data = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];



  const handleGenderChange = (value) => {
    setSelectedGender(value);
  };

  const validateProfileForm = () => {
    if (!username || !age || !value) {
      let errorMessage = 'Please fill in the following mandatory fields:\n';
      if (!username) errorMessage += '- Name\n';
      if (!age) errorMessage += '- Age\n';
      if (!value) errorMessage += '- Gender\n';

      Alert.alert('Validation Error', errorMessage);
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

      const response = await axios.put(
        `${BASE_URL}/user`,
        formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`,
          'x-api-key': API_KEY,
          'Accept-Language': ACCEPT_LANGUAGE,
        },
      });

      // Handle the response accordingly
      console.log('API create response:', response.data);
      if(type === 'view'){
        navigation.navigate('buynavigationdrawer');
      }else{
        navigation.navigate('findmylocation');
      }
    } catch (error) {
      console.error('API Error:', error.response.data);

    }


  };
  const finalSubmit = () => {
    navigation.navigate('buyorsell');
  }


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleImagePicker = () => {
    toggleModal();
    const options = {
      title: 'Select Image',
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
      path: 'images',
    };
    launchImageLibrary(options, async (response) => {
      if (!response.didCancel && !response.error) {
        console.log("img",response.assets[0].uri);
        setImageUri(response.assets[0].uri);
      }
    });
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
        console.log(response.assets[0].uri);
        setImageUri(response.assets[0].uri);
      }
    });
  };

  return (

    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.body}>
      <View style={styles.rectangle}>
        <TouchableOpacity onPress={() => goBack()}>
          <Image style={styles.back}
            source={require('../assets/images/back.png')} />
        </TouchableOpacity>

        <View style={{ justifyContent: 'space-between', alignItems: "center", flexDirection: "row", width: "100%", }}>
          <Text style={styles.logintext}>
            Verify Account
          </Text>
          <Image style={styles.image}
            source={require('../assets/images/badge.png')} />
        </View>
      </View>

      <View style={{ width: '85%', height: '70%', backgroundColor: '#62A845', }}>

        <View style={{ justifyContent: 'center', alignItems: 'center' }} >
          {imageUri ? (
            <TouchableOpacity style={styles.roundImagePlaceholder} onPress={() => { toggleModal() }}>

              <Image
              source={{ uri: `${IMG_URL}${imageUri}` }}
               
               style={styles.roundImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.roundImagePlaceholder} onPress={() => { toggleModal() }}>
              <Image source={require('../assets/images/account.png')} style={{ width: 70, height: 70 }} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.cameraIcon} onPress={() => { toggleModal() }}>
            <Image source={require('../assets/images/camera.png')} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'column', width: '80%', left: 30, marginTop: '15%' }}>
          <Text style={styles.detailsText}>
            Name*
          </Text>
          <View style={styles.nameInput}>
            <TextInput
              placeholder="Enter Your Name"
              placeholderTextColor='black'
              keyboardType='ascii-capable'
              style={styles.numberinput}
              onChangeText={(text) => setusername(text)}
              value={username}
             
            />
          </View>
          <View style={{ flexDirection: 'row', top: 20, width: '100%' }}>
            <View style={{ width: '60%' }}>
              <Text style={styles.detailsText}>
                Age*
              </Text>
              <View style={styles.ageInput}>
                <TextInput
                  placeholder="Age"
                  placeholderTextColor='black'
                  keyboardType='number-pad'
                  style={styles.numberinput}
                  maxLength={2}
                  onChangeText={(text) => setage(text)}
                  value={age}
                 

                />
              </View>
            </View>
            <View style={{ width: '80%' }}>
              <Text style={styles.detailsText}>
                Gender*
              </Text>
              <View style={styles.genderInput}>
                <Dropdown

                  placeholderStyle={styles.placeholderStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={data}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? '  Select' : '...'}
                  value={type === 'view' ? value : value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setValue(item.value);
                    setIsFocus(false);
                  }}
                  disabled={type === 'view'}
                />

              </View>
            </View>

          </View>

          <View style={{ marginTop: 50 }}>
            <Text style={styles.detailsText}>
              Referral Code
            </Text>
            <View style={styles.referalInput}>
              <TextInput
                placeholder="Enter Your Phone Number"
                placeholderTextColor='black'
                keyboardType='number-pad'
                style={styles.numberinput}
                maxLength={10}
                onChangeText={(text) => setreferralCode(text)}
              />
            </View>
          </View>



        </View>

      </View>



      <Modal isVisible={isModalVisible} onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => handleImagePicker('gallery')}>
            <Text style={styles.modalText}>Choose from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCameraCapture}>
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
             Save
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
    marginBottom: 50

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
    borderColor: "#ffffff",
    borderRadius: 2,
    backgroundColor: 'white',
    top: 10,
  },
  ageInput: {
    borderWidth: 1,
    width: '50%',
    height: 40,
    borderColor: "#ffffff",
    borderRadius: 2,
    backgroundColor: 'white',
    top: 10,
  },
  genderInput: {
    borderWidth: 1,
    width: '50%',
    height: 40,
    borderColor: "#ffffff",
    borderRadius: 2,
    backgroundColor: 'white',
    top: 10,
  },
  referalInput: {
    flexDirection: "row",
    borderWidth: 1,
    height: 40,
    borderColor: "#ffffff",
    borderRadius: 2,
    backgroundColor: 'white',
    top: 10,
  },

  logintext: {
    fontSize: 16,
    fontWeight: '700',
    left: 20,
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
    width: 120,
    height: 120,
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
  }

})
export default CreateProfile;