import React, { useState ,useEffect} from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity, ActivityIndicator,FlatList, } from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Dropdown from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import { Alert } from 'react-native';
import CheckBox from 'react-native-check-box'
import Video from 'react-native-video';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, getAccessToken } from '../Api/apiConfig';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

// import WebView from 'react-native-webview';

const UploadImages = ({ navigation, navigation: { goBack },route }) => {
    const [images, setImages] = useState([]);
    const [videoUri, setVideoUri] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [position, setPosition] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const parent = route?.params?.parent;
    const type = route?.params?.type || [];
    const catIds =route?.params?.details;
    const mainid=route?.params?.mainid
    const id =route?.params?.id;
    console.log('mainid',mainid);
    let livestockAttributes = [];
    let farmEquipmentsAttributes = [];
    let priceValue ='' ;
    let descriptionValue ='';
    let lat='';
    let lng='';
    let typevalue= '';
    let renttype='';
    let place='';

    if(mainid === '65fc731c2e0b4ae365115908'){
        console.log('recieved_liv',route.params.livestockAttributes);
         livestockAttributes = route?.params?.livestockAttributes || [];

         const placeObj = livestockAttributes.find(item => item.key === 'place');
         place = placeObj ? placeObj.value : '';

        const priceObject = livestockAttributes.find(item => item.key === 'price');
        priceValue = priceObject ? priceObject.value : null;
   
        const descriptionObject = livestockAttributes.find(item => item.key === 'description');
        descriptionValue = descriptionObject ? descriptionObject?.value : null;
        console.log("descrip",descriptionValue);

        const typeObject = livestockAttributes.find(item => item.key === 'type');
         typevalue = 'sell'
        

        const latobj = livestockAttributes.find(item => item.key === 'location');
         lat = latobj ?  (latobj?.value?.lat || "") : null;

        const lngobj = livestockAttributes.find(item => item.key === 'location');
         lng = lngobj ? (latobj?.value?.lng || "") : null;

         renttype='';

        console.log('lat',lat,'lng',lng);



   } else{
    console.log('recieved_farm',route.params.farmEquipmentAttributesAttributes);
         farmEquipmentsAttributes = route?.params?.farmEquipmentAttributesAttributes || [];

         const placeObj = farmEquipmentsAttributes.find(item => item.key === 'place');
         place = placeObj ? placeObj.value : '';

        const priceObject = farmEquipmentsAttributes.find(item => item.key === 'price');
        priceValue = priceObject ? priceObject.value : '';
   
        const descriptionObject = farmEquipmentsAttributes.find(item => item.key === 'description');
        descriptionValue = descriptionObject ? descriptionObject?.value : null;
        console.log("descrip",descriptionValue);

        const typeObject = farmEquipmentsAttributes.find(item => item.key === 'type');
         typevalue = typeObject ? typeObject.value : null;
       
        const latobj = farmEquipmentsAttributes.find(item => item.key === 'location');
        lat = latobj ? (latobj?.value?.lat || "") : null;

        const lngobj = farmEquipmentsAttributes.find(item => item.key === 'location');
        lng = lngobj ? (lngobj?.value?.lat || ""): null;

        const rentobj = farmEquipmentsAttributes.find(item => item.key === 'renttype');
        renttype = rentobj && rentobj.value !== null ? rentobj.value : "";
       



    }
  
     

    const handleCheckBoxClick = () => {
        setIsChecked(!isChecked);
        
    };

    useEffect(() => {
       console.log(route.params.livestockAttributes);
         getCurrentLocation()
    },[])
    const handleSubmit = async () => {
        if (images.length === 0) {
            Alert.alert('Validation Error', 'Select at least one image to proceed');
            return;
        }
        try {
            const accessToken = await getAccessToken(); 
            setIsLoading(true); 
          let formData = new FormData();
    
          formData.append('title',parent );
          formData.append('description', descriptionValue);
        //   formData.append('images', "");
        //   formData.append('thumbnail', "");
        //   formData.append('video', "");
        if (!lat || !lng ) {
            console.log('current');
            formData.append('location', JSON.stringify([position.coords.latitude, position.coords.longitude])); 
        }else{
            console.log('manual');
            formData.append('location', JSON.stringify([lat,lng])); 
        }
          formData.append('categoryId', mainid);
          formData.append('subCategoryId', catIds[0].parentData._id);
          formData.append('subSubCategoryId',id);
          formData.append('place', place);
          formData.append('listingType',typevalue );
          formData.append('price', priceValue);
          formData.append('rentDuration', renttype);
          if (mainid === '65fc731c2e0b4ae365115908') {
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
          console.log("form",formData);
          const response = await axios.post(
            `${BASE_URL}/product`,
             formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${accessToken}`,
              'x-api-key': API_KEY,
              'Accept-Language': ACCEPT_LANGUAGE,
            },
          });
    
          // Handle the response accordingly
          console.log('API Response:', response.data);
          alertSubmit()
        } catch (error) {
          console.error('API Error:',  error);
         
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
    const getCurrentLocation = () =>{
        Geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            setPosition(position);
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
       }

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
            const images = await ImagePicker.openPicker({
                multiple: true,
                mediaType: 'photo',
                compressImageQuality: 0.8,
            });

            setImages([...images.map((image) => image.path)]);
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
        } catch (error) {
            console.log(error);
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
                setImages(newImages.slice(-5)); // Keep only the latest 5 images
            }
        });
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
                            Upload Images
                        </Text>
                    </View>

                </View>
            </View>

            <View style={{ flex: 1, backgroundColor: '#F3FBF4', width: '95%', top: 20, marginBottom: 10, }}>
           
                <View style={{ flexDirection: 'column', width: '80%', marginTop: '5%' }}>
                    <TouchableOpacity
                        style={styles.categoriesBox}
                        onPress={() => toggleModal()}
                    >
                        <Image
                            source={require('../../assets/images/camerasell.png')} />
                        <Text style={{ color: 'black', fontSize: 14, top: 10 }}>
                            Upload Images
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ top: 10 }}>
                {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#539F46" />
                </View>
            )}
                    <FlatList
                        data={images}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={3} // Display 3 images per row
                        renderItem={({ item }) => (

                            <Image
                                style={{ width: '30%', aspectRatio: 1, borderWidth: 2, borderColor: "#62A845", margin: '1%' }}
                                source={{ uri: item }}
                            />

                        )}
                    />
                </View>

                {videoUri && (
                <Video
                    source={{ uri: videoUri }}
                    style={{ width: '50%', aspectRatio: 1, borderWidth: 2, borderColor: "#62A845", margin: '1%',top:'2%' }}
                    controls
                />
            )}

                <CheckBox
                    style={{ padding: 10 ,top:30}}
                    onClick={handleCheckBoxClick}
                    isChecked={isChecked}
                    rightText={mainid === '65fc731c2e0b4ae365115908' ? 'Good health declaration /Vaccine info' : 'Good condition & FC validation declaration'}
                    rightTextStyle={{ fontSize: 16, color: 'black' }}
                />
                  {/* <View style={{ width: '50%', top: '13%' }}>
                        <Text style={styles.detailsText}>
                            Location
                        </Text>
                        <GooglePlacesAutocomplete
                            placeholder="Search for a location"
                            onPress={(data, details = null) => {
                                console.log("location",data);
                                // handleFarmEquipmentsAttributeChange('location', data.description);
                            }}
                            
                            query={{
                                key: 'AIzaSyCAVZr638AD5Welu4kHBGaPbYkHxy1-fIU',
                                language: 'en', // Optional: Specify the language of the results
                                components: 'country:in', // Limit results to India
                            }}
                            onFail={error => console.log("error",error)}
                            styles={{
                                container: {
                                    flex: 0 ,
                                },
                                listView: {
                                  position:'absolute',
                                    top: 55,
                                    left: 10,
                                    right: 10,
                                    backgroundColor: 'white',
                                    borderRadius: 5,
                                    elevation: 3,
                                    zIndex: 1000,
                                },
                            }}
                        />
                    </View> */}

            </View>



           



            <Modal isVisible={isModalVisible} onRequestClose={toggleModal}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => handleImagePicker('gallery')}>
                        <Text style={styles.modalText}>Choose from Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCameraCapture}>
                        <Text style={styles.modalText}>Capture with Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleVideoPicker}>
                        <Text style={styles.modalText}>Upload Video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleModal}>
                        <Text style={styles.modalText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>




            <View style={{

                justifyContent: 'flex-end',
                flexDirection: 'row',
                backgroundColor: '#F3FBF4',
                marginHorizontal: 10,
                marginBottom: 10

            }}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => { goBack() }}>
                    <Text style={{ fontSize: 18, color: 'black', fontWeight: '600' }}>
                        Back
                    </Text>

                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => {
                       { mainid === '65fc731c2e0b4ae365115908' ? 
                       livestockAttributes.push({ key: 'Good health declaration', value: isChecked }) 
                       :
                       farmEquipmentsAttributes.push({ key: 'Good condition & FC validation declaration', value: isChecked })

                    }
                        
                         handleSubmit() }}>
                    <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
                        Submit
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
    rectangle: {
        flexDirection: "row",
        width: "90%",
        height: 50,
        justifyContent: "space-between",
        alignItems: "center",
        top: 10,
        left: 10,
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