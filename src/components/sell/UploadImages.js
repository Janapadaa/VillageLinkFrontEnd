import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity, ActivityIndicator, FlatList, } from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Dropdown from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import { Alert } from 'react-native';
import CheckBox from 'react-native-check-box'
import Video from 'react-native-video';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, getAccessToken,getAcceptLanguage } from '../Api/apiConfig';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { BackHandler } from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import RNFS from 'react-native-fs';

// import WebView from 'react-native-webview';

const UploadImages = ({ navigation, navigation: { goBack }, route }) => {
    const [images, setImages] = useState([]);
    const [videoUri, setVideoUri] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [position, setPosition] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [languageData, setLanguageData] = useState(null);
    useEffect(() => {
        const filePath = `${RNFS.DocumentDirectoryPath}/languageData.json`;
    console.log(filePath);
    
        RNFS.readFile(filePath, 'utf8')
          .then((data) => {
            setLanguageData(JSON.parse(data)); 
          })
          .catch((error) => {
            console.error("Error reading file:", error);
          });
    }, []);
    const parent = route?.params?.parent;
    const type = route?.params?.type || []; 
    const catIds = route?.params?.details;
    const mainid = route?.params?.mainid
    const id = route?.params?.id;
    console.log('mainid', mainid);
    let livestockAttributes = [];
    let farmEquipmentsAttributes = [];
    let priceValue = '';
    let descriptionValue = '';
    let lat = '';
    let lng = '';
    let typevalue = '';
    let renttype = '';
    let place = '';

    if (mainid === '6667fc6ba90178b6862b10d1') {
        console.log('recieved_liv', route.params.livestockAttributes);
        livestockAttributes = route?.params?.livestockAttributes || [];

        const placeObj = livestockAttributes.find(item => item.key === 'place');
        place = placeObj ? placeObj.value : '';

        const priceObject = livestockAttributes.find(item => item.key === 'price');
        priceValue = priceObject ? priceObject.value : null;

        const descriptionObject = livestockAttributes.find(item => item.key === 'description');
        descriptionValue = descriptionObject ? descriptionObject?.value : null;
        console.log("descrip", descriptionValue);

        const typeObject = livestockAttributes.find(item => item.key === 'type');
        typevalue = 'sell'


        const latobj = livestockAttributes.find(item => item.key === 'location');
        lat = latobj ? (latobj?.value?.lat || "") : null;

        const lngobj = livestockAttributes.find(item => item.key === 'location');
        lng = lngobj ? (lngobj?.value?.lng || "") : null;

        renttype = '';

        console.log('lat', lat);



    } else {
        console.log('recieved_farm', route.params.farmEquipmentAttributesAttributes);
        farmEquipmentsAttributes = route?.params?.farmEquipmentAttributesAttributes || [];

        const placeObj = farmEquipmentsAttributes.find(item => item.key === 'place');
        place = placeObj ? placeObj.value : '';

        const priceObject = farmEquipmentsAttributes.find(item => item.key === 'price');
        priceValue = priceObject ? priceObject.value : '';

        const descriptionObject = farmEquipmentsAttributes.find(item => item.key === 'description');
        descriptionValue = descriptionObject ? descriptionObject?.value : null;
        console.log("descrip", descriptionValue);

        const typeObject = farmEquipmentsAttributes.find(item => item.key === 'type');
        typevalue = typeObject ? typeObject.value : null;

        const latobj = farmEquipmentsAttributes.find(item => item.key === 'location');
        lat = latobj ? (latobj?.value?.lat || "") : null;

        const lngobj = farmEquipmentsAttributes.find(item => item.key === 'location');
        lng = lngobj ? (lngobj?.value?.lng || "") : null;

        const rentobj = farmEquipmentsAttributes.find(item => item.key === 'renttype');
        renttype = rentobj && rentobj.value !== null ? rentobj.value : "";




    }



    const handleCheckBoxClick = () => {
        setIsChecked(!isChecked);

    };
    useEffect(() => {
        // getCurrentLocation()
        handleEnabledPressed()
    },[])
    
    async function handleEnabledPressed() {
      if (Platform.OS === 'android') {
        try {
          const enableResult = await promptForEnableLocationIfNeeded();
          console.log('enableResult', enableResult);
          requestLocationPermission();
    
          // The user has accepted to enable the location services
          // data can be :
          //  - "already-enabled" if the location services has been already enabled
          //  - "enabled" if user has clicked on OK button in the popup
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
            // The user has not accepted to enable the location services or something went wrong during the process
            // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
            // codes :
            //  - ERR00 : The user has clicked on Cancel button in the popup
            //  - ERR01 : If the Settings change are unavailable
            //  - ERR02 : If the popup has failed to open
            //  - ERR03 : Internal error
          }
        }
      }
    }
    
   
    useEffect(() => {
        console.log(route.params.livestockAttributes);
        handleEnabledPressed()
         //getCurrentLocation()
    }, [])
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                navigation.goBack();
                return true;
            }
        );

        return () => backHandler.remove();
    }, [navigation]);

    async function handleEnabledPressed() {
        if (Platform.OS === 'android') {
          try {
            const enableResult = await promptForEnableLocationIfNeeded();
            console.log('enableResult', enableResult);
            requestLocationPermission();
      
            // The user has accepted to enable the location services
            // data can be :
            //  - "already-enabled" if the location services has been already enabled
            //  - "enabled" if user has clicked on OK button in the popup
          } catch (error) {
            if (error instanceof Error) {
              console.error(error.message);
              // The user has not accepted to enable the location services or something went wrong during the process
              // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
              // codes :
              //  - ERR00 : The user has clicked on Cancel button in the popup
              //  - ERR01 : If the Settings change are unavailable
              //  - ERR02 : If the popup has failed to open
              //  - ERR03 : Internal error
            }
          }
        }
      }
      const requestLocationPermission = async () => {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
          ]);
          if (
            granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED ||
            granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log('Location permission already granted');
            // Proceed to get the current location
            getCurrentLocation();
          } else {
            console.log('Requesting location permission...');
            const granted = await PermissionsAndroid.request(
              locationPermission,
              {
                title: 'Location Permission',
                message: 'This app requires access to your location.',
                buttonPositive: 'OK',
                buttonNegative: 'Cancel'
              }
            );
      
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('Location permission granted');
              
              getCurrentLocation();
            } else {
              console.log('Location permission denied');
              // Handle case where location permission is denied
            }
          }
        } catch (error) {
          console.error('Error requesting location permission:', error);
        }
      };
    const handleSubmit = async () => {
       
        if (images.length === 0) {
            Alert.alert('Validation Error', 'Select at least one image to proceed');
            return;
        }
        try {
            if (isLoading) return;

            setIsLoading(true);
            const accessToken = await getAccessToken();
            const lang = await getAcceptLanguage();

            //    setIsLoading(true); 
            let formData = new FormData();

            formData.append('title', parent);
            formData.append('description', descriptionValue);
            //   formData.append('images', "");
            //   formData.append('thumbnail', "");
            //   formData.append('video', "");
            if (!lat || !lng) {
                console.log("below if");
                console.log('current_live', position.position.coords.latitude, position.position.coords.longitude);
                formData.append('location', JSON.stringify([position.position.coords.latitude, position.position.coords.longitude]));
                
            } else {
                console.log('manual');
                formData.append('location', JSON.stringify([lat, lng]));
                formData.append('place', place);
            }
            formData.append('categoryId', mainid);
            formData.append('subCategoryId', catIds[0].parentData._id);
            formData.append('subSubCategoryId', id);
            formData.append('listingType', typevalue);
            formData.append('price', priceValue);
            formData.append('rentDuration', renttype);
            if (mainid === '6667fc6ba90178b6862b10d1') {
                formData.append('attributes', JSON.stringify(livestockAttributes));
            } else {
                formData.append('attributes', JSON.stringify(farmEquipmentsAttributes));
            }
            images.forEach((image, index) => {
                const imageUriParts = image.split('.');
                const fileType = imageUriParts[imageUriParts.length - 1];

                formData.append(`images`, {
                    uri: image,
                    name: `photo_${index}.${fileType}`,
                    type: `image/${fileType}`,
                });
            });
            if (videoUri) {
                const videoUriParts = videoUri.split('.');
                const videoType = videoUriParts[videoUriParts.length - 1];

                formData.append('video', {
                    uri: videoUri,
                    name: `video.${videoType}`,
                    type: `video/${videoType}`,
                });
            }
            console.log("form", formData);
            const response = await axios.post(
                `${BASE_URL}/product`,
                formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`,
                    'x-api-key': API_KEY,
                    'Accept-Language': lang,
                },
            });

            // Handle the response accordingly
            console.log('API Response:', response.data);
            alertSubmit()
        } catch (error) {
            console.log('API Error:', error.message);

        } finally {
            setIsLoading(false);
        }
    };
    const alertSubmit = () => {

        Alert.alert(
            'Success',
            'Ads Saved Successfully',
            [
                {
                    text: 'OK',
                    onPress: () => {

                        navigation.navigate('sellnavigationdrawer');
                    },
                },
            ],
            { cancelable: false }
        );
    };
    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log("Current Location:", position);
               setPosition({position});
            },
            (error) => {
                console.error("Error getting location:", error.message);
                Alert.alert(
                    "Location Error",
                    "Unable to fetch your location. Please try again or check your GPS settings."
                );
            },
            
        );
    };
    
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // const handleImagePicker = () => {
    //     const options = {
    //       title: 'Select Image',
    //       mediaType: 'photo',
    //       maxWidth: 300,
    //       maxHeight: 300,
    //       quality: 1,
    //       path: 'images',
    //     };

    //     launchImageLibrary(options, async (response) => {
    //       if (!response.didCancel && !response.error) {
    //         const newImages = [...images, response.assets[0].uri];
    //         setImages(newImages.slice(-5)); // Keep only the latest 5 images
    //       }
    //     });
    //   };
    const handleImagePicker = async () => {
        try {
            const selectedImages = await ImagePicker.openPicker({
                multiple: true,
                mediaType: 'photo',
                compressImageQuality: 0.8,
            });

            setImages(prevImages => [...prevImages, ...selectedImages.map(image => image.path)]);
            toggleModal(); 
        } catch (error) {
            console.log(error);
        }
    };
    const handleVideoPicker = async () => {
        try {
            const video = await ImagePicker.openPicker({
                mediaType: 'video',
            });

            setVideoUri(video.path);
            toggleModal(); 
        } catch (error) {
            console.log(error);
        }
    };
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
                const newImages = [...images, response.assets[0].uri];
                setImages(prevImages => [...prevImages, response.assets[0].uri]);
                toggleModal(); 
            }
        });
    };

    const handleRemoveImage = (id) => {

        const updatedImages = images.filter((image) => image !== id);
        setImages(updatedImages);
    };
    const handleRemoveVideo = () => {
        // Logic to remove the video
        setVideoUri(null); // Assuming setVideoUri is the setter function for videoUri state
    };

    return (
        <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled" // Allow tapping outside of text inputs to dismiss keyboard
        >

            <View style={styles.rectangle}>
                <Image style={styles.back}
                    source={require('../../assets/images/4.png')} />
                <View style={{ justifyContent: 'space-between', alignItems: "center", flexDirection: "row", width: "100%", }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.logintext}>
                        {languageData?.upload_images_Farmequipments_screen?.title}
                        </Text>
                    </View>

                </View>
            </View>

            <View style={{ flex: 1, backgroundColor: '#FFFFF', width: '95%', top: 20, marginBottom: 10, }}>

                <View style={{ flexDirection: 'column', width: '80%', marginTop: '5%' }}>
                    <TouchableOpacity
                        style={styles.categoriesBox}
                        onPress={() => toggleModal()}
                    >
                        <Image
                            source={require('../../assets/images/camerasell.png')} />
                        <Text style={{ color: 'black', fontSize: 14, top: 10 }}>
                        {languageData?.upload_images_Farmequipments_screen?.upload_images_text}

                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ top: 10,  }}>
                    {/* {isLoading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#539F46" />
                        </View>
                    )} */}

                    <FlatList
                        data={images}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                        renderItem={({ item }) => (
                            <View style={styles.imageContainer}>
                                <Image style={styles.images} source={{ uri: item }} />
                                <TouchableOpacity style={styles.deleteIcon} onPress={() => {

                                    handleRemoveImage(item)
                                }}>
                                    <Image source={require('../../assets/images/remove.png')} style={styles.removeIcon} />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>

                {videoUri && (
                    <View style={styles.videoContainer}>
                    <Video
                        source={{ uri: videoUri }}
                        style={{ height:'100%',width: '100%', aspectRatio: 1,  margin: '1%', top: '2%' }}
                        controls
                    />
                    <TouchableOpacity style={styles.deleteIcon} onPress={handleRemoveVideo}>
                        <Image source={require('../../assets/images/remove.png')} style={styles.removeIcon} />
                    </TouchableOpacity>
                </View>
                )}

                <CheckBox
                    style={{ padding: 10, top: 30 }}
                    onClick={handleCheckBoxClick}
                    isChecked={isChecked}
                    rightText={mainid === '6667fc6ba90178b6862b10d1' ?
                        languageData?.upload_images_screen?.health_declaration_field_name
                        : 
                         languageData?.upload_images_Farmequipments_screen?.good_condition_fc_validation_text

                       }
                    rightTextStyle={{ fontSize: 16, color: 'black' }}
                />
                

            </View>







            <Modal isVisible={isModalVisible} onRequestClose={toggleModal}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => handleImagePicker('gallery')}>
                        <Text style={styles.modalText}>Choose from gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={checkCameraPermission}>
                        <Text style={styles.modalText}>Capture with camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleVideoPicker}>
                        <Text style={styles.modalText}>Upload video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleModal}>
                        <Text style={styles.modalText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>




            <View style={{

                justifyContent: 'flex-end',
                flexDirection: 'row',
                backgroundColor: '#FFFFFF',
                marginHorizontal: 10,
                marginBottom: 10

            }}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => { goBack() }}>
                    <Text style={{ fontSize: 18, color: 'black', fontWeight: '600' }}>
                    {languageData?.upload_images_Farmequipments_screen?.back_button_text}

                    </Text>

                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => {
                        {
                            mainid === '6667fc6ba90178b6862b10d1' ?
                            livestockAttributes.push({ key: 'Good health declaration', value: isChecked })
                            :
                            farmEquipmentsAttributes.push({ key: 'Good condition & FC validation declaration', value: isChecked })

                        }

                        handleSubmit()
                    }}
                    disabled={isLoading} >
                    {isLoading ? (
                        // Show loader when submission process is ongoing
                        <ActivityIndicator color="white" />
                    ) : (
                        // Show button text when not loading
                        <Text style={{ fontSize: 18, color: "white", fontWeight: "600" }}>
                           {languageData?.upload_images_Farmequipments_screen?.submit_button_text}

                        </Text>
                    )}

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
        padding:'5%'

    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fffff',
    },
   
    categoriesBox: {
        height: 100,
        width: 125,
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 2,
        borderRadius: 10,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        position: 'relative',
        marginHorizontal: 10,
        width: 110, // Adjust the width to maintain a proper grid layout
        height: 110,
    },
    videoContainer: {
        position: 'relative',
        width: '50%',
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: "#62A845",
        margin: '1%',
        marginTop: '2%',
      },
    images: {
        width: 120,
        height: 100,
        borderWidth: 2,
        borderColor: '#62A845',
        borderRadius: 10, // Optional for rounded corners


    },
    deleteIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 5,
    },
    removeIcon: {
        width: 25,
        height: 25,
    },
    rectangle: {
        flexDirection: "row",
        width: "100%",
        height: 50,
        justifyContent: "space-between",
        alignItems: "center",
        top: 10,
        
    },
    back: {
        height: 25,
        width: 25,
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
        height: 90,
        borderColor: "#ffffff",
        borderRadius: 2,
        backgroundColor: 'white',
        top: 10,
    },
    phonenumber: {
        lexDirection: "row",
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
        top: 10,
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

    nextButton: {
        backgroundColor: '#000000',
        borderRadius: 25,
        height: 50,
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
        marginTop: 30,

    },
    backButton: {
        borderRadius: 25,
        height: 50,
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
        marginTop: 30,
        borderColor: '#539F46',
        borderWidth: 1

    }

})
export default UploadImages;