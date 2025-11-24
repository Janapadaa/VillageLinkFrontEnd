import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity, TextInput, PermissionsAndroid, Platform, Alert, BackHandler } from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
// import WebView from 'react-native-webview';
import CheckBox from 'react-native-check-box'
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, getAccessToken,getAcceptLanguage } from '../Api/apiConfig';
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, } from "react-native-alert-notification";
import Toast from 'react-native-toast-message'; // Add this line
import Geolocation from 'react-native-geolocation-service';
import RNFS from 'react-native-fs';


const Details = ({ navigation, navigation: { goBack }, route }) => {
    const Type = route?.params?.type
    console.log("details route", route?.params.type);
    const parent = route.params.parentTitle
    const parentId = route.params.parentId
    const detailsArray = route.params.categoriesDetails;
    const mainid = route?.params?.homeid
    console.log("detailssss", detailsArray[0].parentId);
    const [model, setModel] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [value, setValue] = useState(null);
    const [modelValue, setModelValue] = useState(null);
    const [stockType, setStockType] = useState(null);
    const [stockGender, setStockGender] = useState(null);
    const [age, setAge] = useState(null);
    const [milkYield, setMilkYield] = useState(null);
    const [hrsDay, setHrsDay] = useState(null);
    const [userPhonenumber, setPhonenumber] = useState('');
    const [position, setPosition] = useState(null);
    const [initialAddress, setInitialAddress] = useState('');

    const [isFocus, setIsFocus] = useState(false);
    const [isTypeFocus, setIsTypeFocus] = useState(false);
    const [isMilkYieldFocus, setIsMilkYieldFocus] = useState(false);
    const [isAgeFocus, setIsAgeFocus] = useState(false);
    const [ishrsdayFocus, setIshrsdayFocus] = useState(false);
    const [ishrskmsFocus, setIshrskmsFocus] = useState(false);

    const phoneNumber = useRef(null);
    const description = useRef(null);
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
  


    const [livestockAttributes, setLivestockAttributes] = useState({
        type: null,
        gender: null,
        age: null,
        milkYield: null,
        price: null,
        quantityAvailable: null,
        phonenumber: null,
        description: null,
        weight: null,
        location: null,
        place: '',
    });
    const [farmEquipmentAttributes, setFarmEquipmentsAttributes] = useState({
        type: null,
        price: null,
        model: null,
        year: null,
        hrsdriven: null,
        phonenumber: null,
        description: null,
        location: null,
        hrsOrDay: null,
        place: '',
        renttype: null,
    });
    const data = [
        { label: 'Sell', value: 'sell' },
        { label: 'Rent', value: 'rent' },
    ];
    const hrsDayData = [
        { label: 'Hrs', value: 'hour' },
        { label: 'Day', value: 'day' },
    ];
    const gender = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ];
    const chickenGender = [
        { label: 'Rooster', value: 'Rooster' },
        { label: 'Hen', value: 'Hen' },
    ];

    // const kmsOrHrsData = [
    //     { label: 'Kms', value: 'kms' },
    //     { label: 'Hrs', value: 'hour' },
    // ];

    const type = [
        { label: 'Milking cow ', value: 'Milking cow ' },
        { label: 'Pregnant cow', value: 'Pregnant cow' },
        { label: ' Cow Calf', value: ' Cow Calf' },


    ];
    const typebuffalo = [
        { label: 'Milking Buffalo', value: 'Milking Buffalo' },
        { label: 'Pregnant Buffalo', value: 'Pregnant Buffalo' },
        { label: 'Buffalo Calf', value: 'Buffalo Calf' },


    ];
    const typebull = [
        { label: 'Buffalo Calf', value: 'Buffalo Calf' },
        { label: 'Bullock / Buffalo bull', value: 'Bullock / Buffalo bull' },

    ];

    const milkYieldData = [
        { label: '0-10', value: '0-10' },
        { label: '11-20', value: '11-20' },
        { label: '21-30', value: '21-30' },
        { label: '30 and above', value: '30 and above' },

    ];

    const ageData = [
        { label: '0-2 years', value: '0-2 years' },
        { label: '2-5 years', value: '2-5 years' },
        { label: '5 to 10 years', value: '5 to 10 years' },
        { label: '10-15 years', value: '10-15 years' },
        { label: '15 and above', value: '15 and above' },

    ];

    const farmmodel = model.map(model => ({
        label: model.name,
        value: model.name
    }));
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

    useEffect(() => {
      
        getuserdata()
        modellist()
    }, [])

    const modellist = async () => {
        console.log('parentmodelid',parentId);
        try {
            const accessToken = await getAccessToken();
            const lang = await getAcceptLanguage();

            const response = await axios.post(
                `${BASE_URL}/product/model/list`,
                {
                    "keyword": "",
                    "parentId": parentId,
                    "skip": 0,
                    "limit": 10
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'x-api-key': API_KEY,
                        'Accept-Language': lang,
                    },
                }
            );

            setModel(response.data.data);
            console.log("model", model);

        } catch (error) {
            console.error('Error fetching subscription data:', error.message);
        }
    };
    useEffect(() => {
        setLivestockAttributes((prevAttributes) => ({
            ...prevAttributes,
            phonenumber: userPhonenumber, // Set phnumber as phonenumber
        }));
    }, [userPhonenumber]);

    const handleLivestockAttributeChange = (attribute, attributeValue) => {
        setLivestockAttributes((prevAttributes) => ({
            ...prevAttributes,
            [attribute]: attributeValue,
        }));
    };
    useEffect(() => {
        setFarmEquipmentsAttributes((prevAttributes) => ({
            ...prevAttributes,
            phonenumber: userPhonenumber, // Set phnumber as phonenumber
        }));
    }, [userPhonenumber]);

    const handleFarmEquipmentsAttributeChange = (attribute, attributeValue) => {
        setFarmEquipmentsAttributes((prevAttributes) => ({
            ...prevAttributes,
            [attribute]: attributeValue,
        }));
    };


    const isCowBuffaloBull = parent.toLowerCase() === 'cow' || parent.toLowerCase() === 'buffalo' || parent.toLowerCase() === 'bull';

    const livestockAttributeKeys = Object.keys(livestockAttributes);

    const livestockAttributesArray = Object.entries(livestockAttributes).map(([key, value]) => {
        const mappedKey = livestockAttributeKeys[key] || key;
        return { key: mappedKey, value };
    });

    const farmEquipmentAttributeKeys = Object.keys(farmEquipmentAttributes);

    const farmEquipmentAttributesArray = Object.entries(farmEquipmentAttributes).map(([key, value]) => {
        const mappedKey = farmEquipmentAttributeKeys[key] || key;
        return { key: mappedKey, value };
    });


    const handleCheckBoxClick = () => {
        setIsChecked(!isChecked);
    };

    const validateLivestockForm = () => {
        if (
            (!stockType || !stockGender) &&
            (!milkYield || !livestockAttributes.weight) &&
            !age &&
            // !livestockAttributes.location || 
            !livestockAttributes.price ||
            !livestockAttributes.quantityAvailable
            // !livestockAttributes.phonenumber



        ) {
            let errorMessage = 'Please fill all  mandatory fields:\n';
           

            Toast.show({
                type: 'error',
                text1: 'Validation',
                text2: 'Please fill all following mandatory fields',
                position: 'top',
                topOffset: 23,
                text1Style: { fontSize: 16, fontWeight: '400' }
            });
            return false;
        }
        navigation.navigate('uploadimages', { livestockAttributes: livestockAttributesArray, type: 'Live Stock', parent: parent, details: detailsArray, mainid: mainid, id: parentId });


    };
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
            console.log("createpro", response.data.data.phoneNumber);
            setPhonenumber(response.data.data.phoneNumber)
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const validateFormEquipments = () => {
        if (
            !value ||
            !farmEquipmentAttributes.model ||
            !farmEquipmentAttributes.price ||
            !farmEquipmentAttributes.year
            // !farmEquipmentAttributes.hrsdriven ||
        ) {
            let errorMessage = 'Please fill all mandatory fields:\n';
            // if (!value) errorMessage += 'Type\n';
            // if (!farmEquipmentAttributes.model) errorMessage += 'Model\n';
            // if (!farmEquipmentAttributes.price) errorMessage += 'Price\n';
            // if (!farmEquipmentAttributes.year) errorMessage += 'Year\n';
            // // if (!farmEquipmentAttributes.hrsdriven) errorMessage += '- Kms/ Hrs. driven\n';
            // if (!farmEquipmentAttributes.phonenumber) errorMessage += 'Phone Number\n';


            // Dialog.show({
            //     type: ALERT_TYPE.WARNING,
            //     title: 'Validation Error',
            //     textBody: errorMessage,
            //     button: 'OK',
            // });
            Toast.show({
                type: 'error',
                text1: 'Validation',
                text2: 'Please fill all following mandatory fields',
                position: 'top',
                topOffset: 23,
                text1Style: { fontSize: 16, fontWeight: '400' }
            });
            return false;
        }
        // if (farmEquipmentAttributes.type === 'rent') {
        //     if (!farmEquipmentAttributes.hrsOrDay) {
        //         Alert.alert('Validation Error', 'Please fill in the Rent Duration field');
        //         return false;
        //     }
        // }
        navigation.navigate('uploadimages', { farmEquipmentAttributesAttributes: farmEquipmentAttributesArray, type: 'farmequipments', parent: parent, details: detailsArray, mainid: mainid, id: parentId });
    };
    const handleSubmit = () => {
        if (mainid === '6667fc6ba90178b6862b10d1') {
            validateLivestockForm()
        } else {
            validateFormEquipments()

        }
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
                console.log(response.assets[0].uri);
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
    const dataToPass = detailsArray[0].parentId === '6667ffbca90178b6862b11a4'
    ? type
    : detailsArray[0].parentId === '6669afa3a90178b6862b183f'
      ? typebull
      : typebuffalo;
  
    const Datagender = detailsArray[0].parentId === '6673ed38390199357ab4a81d' ? chickenGender : gender ;

    //Live stocks
    const renderLivestocksView = () => (
        <View style={styles.body}>
            <View style={styles.rectangle}>
                <Image style={styles.back}
                    source={require('../../assets/images/3.png')} />
                <View style={{ justifyContent: 'space-between', alignItems: "center", flexDirection: "row", width: "100%", }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.logintext}>
                        {languageData?.animal_details_screens?.gir_sell_screen?.title}
                        </Text>
                    </View>

                </View>
            </View>
            <Toast />
            <ScrollView style={{ flex: 1, backgroundColor: '#FFFFF', top: '3%', marginBottom: 10, marginHorizontal: 10 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">




                <View style={{ flexDirection: 'column', width: '80%', left: 20, }}>
                    {isCowBuffaloBull ? (
                        <View style={{ flexDirection: 'row', top: 10, width: '100%' }}>
                            <View style={{ width: '60%' }}>
                                <Text style={styles.detailsText}>
                                {languageData?.animal_details_screens?.deoni_sell_screen?.type_field_name}*

                                </Text>
                                <View style={[styles.stockType, { borderColor: stockType ? '#539F46' : 'red' }]}>
                                    <Dropdown
                                        placeholderStyle={{ color: 'black',left:5 }}
                                        data={dataToPass} selectedTextStyle={{ fontSize: 14, color: 'black', left: 4 }}
                                        maxHeight={300}
                                        itemTextStyle={{ color: 'black' }}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isTypeFocus ? 
                                            languageData?.animal_details_screens?.deoni_sell_screen?.type_placeholder
                                            : '...'}
                                        value={stockType}
                                        onFocus={() => setIsTypeFocus(true)}
                                        onBlur={() => setIsTypeFocus(false)}
                                        onChange={item => {
                                            setStockType(item.value);
                                            setIsTypeFocus(false);
                                            handleLivestockAttributeChange('cowtype', item.value);
                                        }}
                                    />
                                </View>
                            </View>
                            {  detailsArray[0].parentId !== '6669afa3a90178b6862b183f' && 
                              <View style={{ width: '60%' }}>
                                <Text style={styles.detailsText}>
                                {languageData?.animal_details_screens?.deoni_sell_screen?.milk_yield_field_name}
                                </Text>
                                <View style={[styles.stockType, { borderColor: milkYield ? '#539F46' : 'red' }]}>
                                    <Dropdown
                                        placeholderStyle={{ color: 'black',left:5  }}
                                        data={milkYieldData}
                                        selectedTextStyle={{ fontSize: 14, color: 'black', left: 4 }}
                                        maxHeight={300}
                                        itemTextStyle={{ color: 'black' }}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isMilkYieldFocus ? 
                                            languageData?.animal_details_screens?.deoni_sell_screen?.type_placeholder
                                            : '...'}
                                        value={milkYield}
                                        onFocus={() => setIsMilkYieldFocus(true)}
                                        onBlur={() => setIsMilkYieldFocus(false)}
                                        onChange={item => {
                                            setMilkYield(item.value);
                                            setIsMilkYieldFocus(false);
                                            handleLivestockAttributeChange('milk_yiled', item.value);
                                        }}
                                    />
                                </View>
                            </View>}
                          
                        </View>

                    ) : (

                        <View style={{ flexDirection: 'row', top: 10, width: '100%' }}>
                            <View style={{ width: '60%' }}>
                                <Text style={styles.detailsText}>
                                {languageData?.buffalo_sell_screen?.bannur_sell_screen?.gender_field_name}

                                </Text>
                                <View style={[styles.genderInput, { borderColor: stockGender ? '#539F46' : 'red' }]}>
                                    <Dropdown
                                        placeholderStyle={{ color: 'black',left:5  }}
                                        data={Datagender}
                                        selectedTextStyle={{ fontSize: 14, color: 'black', left: 4 }}
                                        maxHeight={300}
                                        itemTextStyle={{ color: 'black' }}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocus ? 
                                            languageData?.animal_details_screens?.deoni_sell_screen?.type_placeholder
                                            : '...'}
                                        value={stockGender}
                                        onFocus={() => setIsFocus(true)}
                                        onBlur={() => setIsFocus(false)}
                                        onChange={item => {
                                            setStockGender(item.value);
                                            setIsFocus(false);
                                            handleLivestockAttributeChange('gender', item.value);
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={{ width: '60%' }}>
                                <Text style={styles.detailsText}>
                                {languageData?.buffalo_sell_screen?.bannur_sell_screen?.weight_field_name}
                                </Text>
                                <View style={[styles.ageInput, { borderColor: livestockAttributes.weight ? '#539F46' : 'red' }]}>
                                    <TextInput
                                        placeholder="0"
                                        placeholderTextColor='black'
                                        keyboardType='number-pad'
                                        style={styles.numberinput}
                                        onChangeText={(text) => {
                                            if (/^\d+$/.test(text)) {
                                                handleLivestockAttributeChange('weight', text);
                                            } else if (text !== '') { // Check if the input is not empty
                                                // Show an alert if the input is not a number
                                                Toast.show({
                                                    type: 'error',
                                                    text1: 'Invalid Input',
                                                    text2: 'Please enter numbers only.',
                                                    position: 'top',
                                                    topOffset: 10,
                                                    duration: 1500, // Adjust duration as needed
                                                    text1Style: { fontSize: 16, fontWeight: '700', color: 'red' }, // Text style for the main text
                                                    text2Style: { fontSize: 14, fontWeight: '500', color: 'black' }, // Text style for the secondary text
                                                });
                                            }
                                        }}

                                    />

                                </View>
                            </View>

                        </View>
                    )}
                    <View style={{ flexDirection: 'row', top: 35, width: '100%' }}>
                        <View style={{ width: '60%' }}>
                            <Text style={styles.detailsText}>
                            {languageData?.animal_details_screens?.deoni_sell_screen?.age_field_name}
                            </Text>
                            <View style={[styles.stockType, { borderColor: age ? '#539F46' : 'red' }]}>
                                <Dropdown
                                    data={ageData}
                                    placeholderStyle={{ color: 'black',left:5  }}
                                    selectedTextStyle={{ fontSize: 14, color: 'black', left: 4 }}
                                    maxHeight={300}
                                    labelField="label"
                                    itemTextStyle={{ color: 'black' }}
                                    valueField="value"
                                    placeholder={!isAgeFocus ? 
                                        languageData?.animal_details_screens?.deoni_sell_screen?.type_placeholder
                                        : '...'}
                                    value={age}
                                    onFocus={() => setIsAgeFocus(true)}
                                    onBlur={() => setIsAgeFocus(false)}
                                    onChange={item => {
                                        setAge(item.value);
                                        setIsAgeFocus(false);
                                        handleLivestockAttributeChange('age', item.value);
                                    }}
                                />
                            </View>
                        </View>


                    </View>
                    <View style={{ flexDirection: 'row', top: 60, width: '100%' }}>
                        <View style={{ width: '60%' }}>
                            <Text style={styles.detailsText}>
                            {languageData?.animal_details_screens?.deoni_sell_screen?.price_field_name}
                            </Text>
                            <View style={[styles.ageInput, { borderColor: livestockAttributes.price ? '#539F46' : 'red' }]}>
                                <TextInput
                                    placeholder="0"
                                    placeholderTextColor='black'
                                    keyboardType='number-pad'
                                    style={styles.numberinput}
                                    onChangeText={(text) => {
                                        if (/^\d+$/.test(text)) {
                                            handleLivestockAttributeChange('price', text);
                                        } else if (text !== '') { // Check if the input is not empty
                                            // Show an alert if the input is not a number
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Invalid Input',
                                                text2: 'Please enter numbers only.',
                                                position: 'top',
                                                topOffset: 10,
                                                duration: 1500, // Adjust duration as needed
                                                text1Style: { fontSize: 16, fontWeight: '700', color: 'red' }, // Text style for the main text
                                                text2Style: { fontSize: 14, fontWeight: '500', color: 'black' }, // Text style for the secondary text
                                            });
                                        }
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ width: '80%' }}>
                            <Text style={styles.detailsText}>
                            {languageData?.animal_details_screens?.deoni_sell_screen?.quantity_available_field_name}
                            </Text>
                            <View style={[styles.genderInput, { borderColor: livestockAttributes.quantityAvailable ? '#539F46' : 'red' }]}>
                                <TextInput
                                    placeholder={languageData?.animal_details_screens?.deoni_sell_screen?.quantity_placeholder}
                                    placeholderTextColor='black'
                                    keyboardType='number-pad'
                                    style={styles.numberinput}
                                    onChangeText={(text) => {
                                        if (/^\d+$/.test(text)) {
                                            handleLivestockAttributeChange('quantityAvailable', text);
                                        } else if (text !== '') { // Check if the input is not empty
                                            // Show an alert if the input is not a number
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Invalid Input',
                                                text2: 'Please enter numbers only.',
                                                position: 'top',
                                                topOffset: 10,
                                                duration: 1500, // Adjust duration as needed
                                                text1Style: { fontSize: 16, fontWeight: '700', color: 'red' }, // Text style for the main text
                                                text2Style: { fontSize: 14, fontWeight: '500', color: 'black' }, // Text style for the secondary text
                                            });
                                        }
                                    }}



                                />

                            </View>
                        </View>

                    </View>

                    <View style={{ marginTop: 80 }}>
                        <Text style={styles.detailsText}>
                        {languageData?.animal_details_screens?.deoni_sell_screen?.phone_number_field_name}
                        </Text>
                        <TouchableOpacity onPress={() => phoneNumber.current && phoneNumber.current.focus()} style={[styles.phonenumber, { borderColor: farmEquipmentAttributes.phonenumber ? '#539F46' : 'red' }]}>

                            <TextInput
                                ref={phoneNumber}
                                placeholder= {languageData?.animal_details_screens?.deoni_sell_screen?.phone_number_field_name}
                                placeholderTextColor='black'
                                keyboardType='number-pad'
                                style={styles.numberinput}
                                maxLength={10}
                                defaultValue={userPhonenumber}
                                onChangeText={(text) => {
                                    if (/^\d+$/.test(text)) {
                                        handleLivestockAttributeChange('phonenumber', text);
                                    } else if (text !== '') { // Check if the input is not empty
                                        // Show an alert if the input is not a number
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Invalid Input',
                                            text2: 'Please enter numbers only.',
                                            position: 'top',
                                            topOffset: 10,
                                            duration: 1500, // Adjust duration as needed
                                            text1Style: { fontSize: 16, fontWeight: '700', color: 'red' }, // Text style for the main text
                                            text2Style: { fontSize: 14, fontWeight: '500', color: 'black' }, // Text style for the secondary text
                                        });
                                    }
                                }}
                            />
                            <View style={styles.editIconContainer} >
                                <Image
                                    source={require('../../assets/images/edit.png')}
                                    style={styles.editIcon}
                                />
                            </View>
                        </TouchableOpacity>
                        {/* <View style={[styles.phonenumber, { borderColor: livestockAttributes.phonenumber ? '#539F46' : 'red' }]}>
                            <TextInput
                                placeholder="Phone Number"
                                placeholderTextColor='black'
                                maxLength={10}
                                keyboardType='number-pad'
                                style={styles.numberinput}
                                defaultValue={userPhonenumber}
                                onChangeText={(text) => handleLivestockAttributeChange('phonenumber', text)}

                            />

                        </View> */}
                    </View>
                    <View style={{ top: '5%' }}>
                        <Text style={styles.detailsText}>
                        {languageData?.animal_details_screens?.deoni_sell_screen?.location_field_name}
                            </Text>
                        <GooglePlacesAutocomplete
                            keyboardShouldPersistTaps="handled"
                            placeholder={languageData?.animal_details_screens?.deoni_sell_screen?.location_placeholder}
                            textInputProps={{ placeholderTextColor: 'black' }}
                            onPress={(data, details = null) => {
                                console.log("location",  data.geometry);
                                 handleLivestockAttributeChange('location', details?.geometry?.location);
                                 handleLivestockAttributeChange('place', data?.description);
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
                                    shadowColor: 'black',
                                },
                                textInput: {
                                    color: 'black',
                                },
                                description: {
                                    color: 'black',
                                },
                            }}
                            renderRightButton={() => (
                                <View style={styles.iconContainer}>
                                    <Image
                                        source={require('../../assets/images/search_location.png')} // Replace with your image path
                                        style={styles.icon}
                                    />
                                </View>
                            )}
                        />
                    </View>
                    <View style={{ marginTop: 40 }}>
                        <Text style={styles.detailsText}>
                        {languageData?.animal_details_screens?.deoni_sell_screen?.description_field_name}
                        </Text>
                        <TouchableOpacity onPress={() => description.current && description.current.focus()} style={styles.referalInput}>
                            <TextInput
                                ref={description}
                                placeholder={languageData?.animal_details_screens?.deoni_sell_screen?.description_placeholder}
                                placeholderTextColor='black'
                                style={styles.numberinput}
                                maxLength={200}
                                onChangeText={(text) => handleLivestockAttributeChange('description', text)}
                                multiline={true} // Enable multiline
                                textAlignVertical="top" // Align text to the top

                            />
                        </TouchableOpacity>
                    </View>



                </View>

                <View style={{
                    flexDirection: 'row',
                    backgroundColor: '#FFFFF',
                    marginHorizontal: 10,
                    marginBottom: 10

                }}>
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => { goBack() }}>
                        <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
                        {languageData?.animal_details_screens?.deoni_sell_screen?.back_button_text}
                        </Text>

                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => {
                            console.log("farmdata", livestockAttributes);
                            handleSubmit()
                        }}>
                        <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
                        {languageData?.animal_details_screens?.deoni_sell_screen?.next_button_text}
                        </Text>

                    </TouchableOpacity>

                </View>

            </ScrollView>



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
        </View>
    );
    //Farm Equipments
    const renderEquipmentsView = () => (
        <View style={styles.body}>
            <View style={styles.rectangle}>
                <Image style={styles.back}
                    source={require('../../assets/images/3.png')} />
                <View style={{ justifyContent: 'space-between', alignItems: "center", flexDirection: "row", width: "100%", }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.logintext}>
                        {languageData?.cat_sell_screen?.title}
                        </Text>
                    </View>

                </View>
            </View>
            <Toast />
            <ScrollView style={{ flex: 1, zIndex: 1, backgroundColor: '#FFFFFF', top: '2%', marginBottom: 10, marginHorizontal: 10 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                <View style={{ flexDirection: 'column', width: '80%', left: 20, marginTop: '5%' }}>

                    <View style={{ flexDirection: 'row', top: 10, width: '100%' }}>
                        <View style={{ width: '60%' }}>
                            <Text style={styles.detailsText}>
                            {languageData?.cat_sell_screen?.sell_rent_field_name}
                            </Text>
                            <View style={[styles.genderInput, { borderColor: value ? '#539F46' : 'red' }]}>
                                <Dropdown
                                    placeholderStyle={{ color: 'black',left:5 }}
                                    selectedTextStyle={{ fontSize: 14, color: 'black', left: 4 }}
                                    data={data}
                                    maxHeight={300}
                                    labelField="label"
                                    itemTextStyle={{ color: 'black' }}
                                    valueField="value"
                                    placeholder={!isFocus ? 
                                        languageData?.cat_sell_screen?.sell_rent_placeholder
                                        : '...'}
                                    value={value}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item => {
                                        setValue(item.value);
                                        setIsFocus(false);
                                        handleFarmEquipmentsAttributeChange('type', item.value);

                                    }}

                                />
                            </View>

                        </View>
                        {value === 'rent' ? (
                            <View style={{ width: '80%' }}>
                                <Text style={styles.detailsText}>
                                    Hrs or Day
                                </Text>
                                <View style={[styles.genderInput, { borderColor: hrsDay ? '#539F46' : 'red' }]}>
                                    <Dropdown
                                        placeholderStyle={{ color: 'black' }}
                                        selectedTextStyle={{ fontSize: 14, color: 'black', left: 4 }}
                                        data={hrsDayData}
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        itemTextStyle={{ color: 'black' }}
                                        placeholder={!ishrsdayFocus ? '  Select' : '...'}
                                        value={hrsDay}
                                        onFocus={() => setIshrsdayFocus(true)}
                                        onBlur={() => setIshrsdayFocus(false)}
                                        onChange={item => {
                                            setHrsDay(item.value);
                                            setIsTypeFocus(false);
                                            handleFarmEquipmentsAttributeChange('renttype', item.value);

                                        }}
                                    />
                                </View>
                            </View>
                        ) : <View style={{ width: '80%' }}>
                            <Text style={styles.detailsText}>
                            {languageData?.cat_sell_screen?.kms_driven_field_name}
                            </Text>
                            <View style={[styles.ageInput]}>
                                <TextInput
                                    placeholder={`0 ${'Kms'}`}
                                    placeholderTextColor='black'
                                    keyboardType='number-pad'
                                    style={styles.numberinput}
                                    onChangeText={(text) => {
                                        if (/^\d+$/.test(text)) {
                                            handleFarmEquipmentsAttributeChange('kms/hrs', text)
                                        } else if (text !== '') { // Check if the input is not empty
                                            // Show an alert if the input is not a number
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Invalid Input',
                                                text2: 'Please enter numbers only.',
                                                position: 'top',
                                                topOffset: 10,
                                                duration: 1500, // Adjust duration as needed
                                                text1Style: { fontSize: 16, fontWeight: '700', color: 'red' }, // Text style for the main text
                                                text2Style: { fontSize: 14, fontWeight: '500', color: 'black' }, // Text style for the secondary text
                                            });
                                        }
                                    }}

                                />
                            </View>
                        </View>}

                    </View>
                    <View style={{ flexDirection: 'row', top: 35, width: '100%' }}>
                        <View style={{ width: '60%' }}>
                            <Text style={styles.detailsText}>
                            {languageData?.cat_sell_screen?.model_field_name}
                            </Text>
                            <View style={[styles.modalInput, { borderColor: modelValue ? '#539F46' : 'red' }]}>
                                <Dropdown
                                    selectedTextStyle={{ fontSize: 14, color: 'black', left: 4 }}
                                    placeholderStyle={{ color: 'black',left:5 }}
                                    data={farmmodel}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    itemTextStyle={{ color: 'black' }}
                                    placeholder={!isFocus ? 
                                        languageData?.cat_sell_screen?.model_placeholder
                                         : '...'}
                                    value={modelValue}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item => {
                                        setModelValue(item.value);
                                        setIsFocus(false);
                                        handleFarmEquipmentsAttributeChange('model', item.value);

                                    }}
                                />
                            </View>

                        </View>

                        {value === 'rent' && (
                            (hrsDay === 'hour' || hrsDay === 'day') && (
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '80%' }}>
                                        <Text style={styles.detailsText}>
                                            {hrsDay === 'hour' ? 'Hour*' : 'Day*'}
                                        </Text>
                                        <View style={styles.ageInput}>
                                            <TextInput
                                                placeholder={`0 ${hrsDay === 'hour' ? 'Hrs' : 'Day'}`}
                                                placeholderTextColor='black'
                                                keyboardType='number-pad'
                                                style={styles.numberinput}
                                                onChangeText={(text) => {
                                                    if (/^\d+$/.test(text)) {
                                                        handleFarmEquipmentsAttributeChange(
                                                            hrsDay === 'hour' ? 'hour' : 'day',
                                                            text
                                                        )
                                                    } else if (text !== '') { // Check if the input is not empty
                                                        // Show an alert if the input is not a number
                                                        Toast.show({
                                                            type: 'error',
                                                            text1: 'Invalid Input',
                                                            text2: 'Please enter numbers only.',
                                                            position: 'top',
                                                            topOffset: 10,
                                                            duration: 1500, // Adjust duration as needed
                                                            text1Style: { fontSize: 16, fontWeight: '700', color: 'red' }, // Text style for the main text
                                                            text2Style: { fontSize: 14, fontWeight: '500', color: 'black' }, // Text style for the secondary text
                                                        });
                                                    }
                                                }}


                                            />
                                        </View>
                                    </View>
                                </View>
                            )
                        )}

                    </View>

                    <View style={{ flexDirection: 'row', top: 55, width: '100%' }}>
                        <View style={{ width: '60%' }}>
                            <Text style={styles.detailsText}>
                            {languageData?.cat_sell_screen?.year_field_name}
                            </Text>
                            <View style={[styles.ageInput, { borderColor: farmEquipmentAttributes.year ? '#539F46' : 'red' }]}>
                                <TextInput
                                    placeholder="0"
                                    placeholderTextColor='black'
                                    keyboardType='number-pad'
                                    style={styles.numberinput}
                                    onChangeText={(text) => {
                                        if (/^\d+$/.test(text)) {
                                            handleFarmEquipmentsAttributeChange('year', text)
                                        } else if (text !== '') { // Check if the input is not empty
                                            // Show an alert if the input is not a number
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Invalid Input',
                                                text2: 'Please enter numbers only.',
                                                position: 'top',
                                                topOffset: 10,
                                                duration: 1500, // Adjust duration as needed
                                                text1Style: { fontSize: 16, fontWeight: '700', color: 'red' }, // Text style for the main text
                                                text2Style: { fontSize: 14, fontWeight: '500', color: 'black' }, // Text style for the secondary text
                                            });
                                        }
                                    }}

                                />
                            </View>
                        </View>
                        <View style={{ width: '80%' }}>
                            <Text style={styles.detailsText}>
                            {languageData?.cat_sell_screen?.price_field_name}
                            </Text>
                            <View style={[styles.genderInput, { borderColor: farmEquipmentAttributes.price ? '#539F46' : 'red' }]}>
                                <TextInput
                                    placeholder="0"
                                    placeholderTextColor='black'
                                    keyboardType='number-pad'
                                    style={styles.numberinput}
                                    onChangeText={(text) => {
                                        if (/^\d+$/.test(text)) {
                                            handleFarmEquipmentsAttributeChange('price', text)
                                        } else if (text !== '') { // Check if the input is not empty
                                            // Show an alert if the input is not a number
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Invalid Input',
                                                text2: 'Please enter numbers only.',
                                                position: 'top',
                                                topOffset: 10,
                                                duration: 1500, // Adjust duration as needed
                                                text1Style: { fontSize: 16, fontWeight: '700', color: 'red' }, // Text style for the main text
                                                text2Style: { fontSize: 14, fontWeight: '500', color: 'black' }, // Text style for the secondary text
                                            });
                                        }
                                    }}

                                />

                            </View>
                        </View>


                    </View>



                    <View style={{ marginTop: 95 }}>
                        <Text style={styles.detailsText}>
                        {languageData?.cat_sell_screen?.phone_number_field_name}
                        </Text>

                        <TouchableOpacity onPress={() => phoneNumber.current && phoneNumber.current.focus()} style={[styles.phonenumber, { borderColor: farmEquipmentAttributes.phonenumber ? '#539F46' : 'red' }]}>

                            <TextInput
                                ref={phoneNumber}
                                placeholder="Phone Number"
                                placeholderTextColor='black'
                                keyboardType='number-pad'
                                style={styles.numberinput}
                                maxLength={10}
                                defaultValue={userPhonenumber}
                                onChangeText={(text) => {
                                    if (/^\d+$/.test(text)) {
                                        handleFarmEquipmentsAttributeChange('phonenumber', text)
                                    } else if (text !== '') { // Check if the input is not empty
                                        // Show an alert if the input is not a number
                                        Toast.show({
                                            type: 'error',
                                            text1: 'Invalid Input',
                                            text2: 'Please enter numbers only.',
                                            position: 'top',
                                            topOffset: 10,
                                            duration: 1500, // Adjust duration as needed
                                            text1Style: { fontSize: 16, fontWeight: '700', color: 'red' }, // Text style for the main text
                                            text2Style: { fontSize: 14, fontWeight: '500', color: 'black' }, // Text style for the secondary text
                                        });
                                    }
                                }}

                            />
                            <View style={styles.editIconContainer} >
                                <Image
                                    source={require('../../assets/images/edit.png')}
                                    style={styles.editIcon}
                                />
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={{ top: '5%' }}>

                        <Text style={styles.detailsText}>
                        {languageData?.cat_sell_screen?.location_field_name}

                        </Text>
                        <GooglePlacesAutocomplete
                             placeholder={languageData?.animal_details_screens?.deoni_sell_screen?.location_placeholder}
                            keyboardShouldPersistTaps="handled"
                            textInputProps={{ placeholderTextColor: 'black' }}
                            onPress={(data, details = null) => {
                                console.log("location", details.geometry);
                                 handleFarmEquipmentsAttributeChange('location', details?.geometry?.location);
                                 handleFarmEquipmentsAttributeChange('place', data.description)
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
                                    
                                    shadowColor: 'black',
                                },
                                textInput: {
                                    color: 'black'
                                },
                                description: {
                                    color: 'black'
                                }
                            }}
                            renderRightButton={() => (
                                <View style={styles.iconContainer}>
                                    <Image
                                        source={require('../../assets/images/search_location.png')} // Replace with your image path
                                        style={styles.icon}
                                    />
                                </View>
                            )}
                        />

                    </View>
                    <View style={{ marginTop: 40 }}>
                        <Text style={styles.detailsText}>
                        {languageData?.cat_sell_screen?.owner_driver_info_field_name}

                        </Text>
                        <TouchableOpacity onPress={() => description.current && description.current.focus()} style={styles.referalInput}>
                            <TextInput
                                ref={description}
                                placeholder= {languageData?.cat_sell_screen?.owner_driver_info_placeholder}
                                placeholderTextColor='black'
                                maxLength={200}
                                onChangeText={(text) => handleFarmEquipmentsAttributeChange('description', text)}
                                multiline={true} // Enable multiline
                                textAlignVertical="top" // Align text to the top
                                style={styles.numberinput}

                            />
                        </TouchableOpacity>
                    </View>




                </View>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: '#FFFFFF',
                    marginHorizontal: 10,
                    marginBottom: 10

                }}>
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => { goBack() }}>
                        <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
                        {languageData?.cat_sell_screen?.back_button_text}
                        </Text>

                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => {
                            console.log("farmdata", farmEquipmentAttributes);
                            handleSubmit()
                        }}>
                        <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
                        {languageData?.cat_sell_screen?.next_button_text}
                        </Text>

                    </TouchableOpacity>

                </View>

            </ScrollView>



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






        </View>
    );

    return (
        <View
            style={styles.keyboardAvoidingContainer}
        >
            {mainid === '6667fc6ba90178b6862b10d1' ? renderLivestocksView() : renderEquipmentsView()}

        </View>
    )
}
const styles = StyleSheet.create({
    body: {
        backgroundColor: "white",
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
    },
    keyboardAvoidingContainer: {
        flex: 1,
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
        fontWeight: '500',
        position: 'relative'
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
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    ageInput: {
        borderWidth: 1,
        width: '50%',
        height: 40,
        borderColor: "#ffffff",
        borderRadius: 2,
        backgroundColor: 'white',
        top: 10,
        elevation: 10,
        shadowColor: 'black',
        borderColor: '#539F46',
        borderRadius: 5
    },
    stockType: {
        borderWidth: 1,
        width: '55%',
        height: 42,
        borderColor: "#ffffff",
        borderRadius: 2,
        backgroundColor: 'white',
        top: 10,
        elevation: 10,
        shadowColor: 'black',
        borderColor: '#539F46',
        borderRadius: 5
    },
    modalInput: {
        borderWidth: 1,
        width: '60%',
        height: 45,
        borderColor: "#ffffff",
        borderRadius: 2,
        backgroundColor: 'white',
        top: 10,
        elevation: 10,
        shadowColor: 'black',
        borderColor: '#539F46',
        borderRadius: 5
    },
    genderInput: {
        borderWidth: 1,
        width: '50%',
        height: 40,
        borderColor: "#ffffff",
        borderRadius: 2,
        backgroundColor: 'white',
        top: 10,
        elevation: 10,
        shadowColor: 'black',
        borderColor: '#539F46',
        borderRadius: 5
    },
    referalInput: {
        flexDirection: "row",
        borderWidth: 1,
        height: 90,
        borderColor: "#ffffff",
        borderRadius: 2,
        backgroundColor: 'white',
        top: 10,
        elevation: 10,
        shadowColor: 'black',
        marginBottom: 25,
        borderColor: '#539F46',
        borderRadius: 5
    },
    phonenumber: {
        flexDirection: "row",
        borderWidth: 1,
        height: 40,
        borderColor: "#ffffff",
        borderRadius: 2,
        backgroundColor: 'white',
        top: 10,
        elevation: 10,
        shadowColor: 'black',
        borderColor: '#539F46',
        borderRadius: 5
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
        marginHorizontal: 10,
        marginBottom: 20,
        marginTop: 30,

    },
    backButton: {
        backgroundColor: '#FFFFFF',
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


    },
    editIconContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 40, // Adjust the width and height as needed
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editIcon: {
        width: 20,
        height: 20,
    },

})
export default Details;