import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
// import WebView from 'react-native-webview';
import CheckBox from 'react-native-check-box'
import { ACCEPT_LANGUAGE, API_KEY, BASE_URL, getAccessToken } from '../Api/apiConfig';
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


const Details = ({ navigation, navigation: { goBack }, route }) => {
    const Type = route?.params?.type
    console.log("details route",route?.params.type); 
    const parent = route.params.parentTitle
    const parentId = route.params.parentId
    const detailsArray =route.params.categoriesDetails;
    const mainid=route?.params?.homeid
    console.log("detailssss",mainid);
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
    const [kmsOrsHrs, setKmsOrHrs] = useState(null);


    const [isFocus, setIsFocus] = useState(false);
    const [isTypeFocus, setIsTypeFocus] = useState(false);
    const [isMilkYieldFocus, setIsMilkYieldFocus] = useState(false);
    const [isAgeFocus, setIsAgeFocus] = useState(false);
    const [ishrsdayFocus, setIshrsdayFocus] = useState(false);
    const [ishrskmsFocus, setIshrskmsFocus] = useState(false);



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
        place:'',
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
        place:'',
        renttype:null,
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

    // const kmsOrHrsData = [
    //     { label: 'Kms', value: 'kms' },
    //     { label: 'Hrs', value: 'hour' },
    // ];

    const type = [
        { label: 'Milking cow ', value: 'Milking cow ' },
        { label: 'Pregnant cow', value: 'Pregnant cow' },
        { label: ' Cow Calf', value: ' Cow Calf' },
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
        { label: '2-5 years', value: '2-5 years' },
        { label: '5 to 10 yrs', value: '5 to 10 yrs' },
        { label: '10-15 yrs', value: '10-15 yrs' },
        { label: '15 and above', value: '15 and above' },

    ];


    const farmmodel = model.map(model => ({
        label: model.name,
        value: model.name
    }));


    useEffect(() => {
        modellist()
    }, [])

    const modellist = async () => {
        try {
            const accessToken = await getAccessToken();
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
                        'Accept-Language': ACCEPT_LANGUAGE,
                    },
                }
            );

            setModel(response.data.data);
          console.log("model",model);

        } catch (error) {
            console.error('Error fetching subscription data:', error.message);
        }
    };


    const handleLivestockAttributeChange = (attribute, attributeValue) => {
        setLivestockAttributes((prevAttributes) => ({
            ...prevAttributes,
            [attribute]: attributeValue,
        }));
    };

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
            !stockType ||
            !milkYield ||
            !age ||
            // !livestockAttributes.location || 
            !livestockAttributes.price ||
            !livestockAttributes.quantityAvailable ||
            !livestockAttributes.phonenumber
        ) {
            let errorMessage = 'Please fill in the following mandatory fields:\n';
            if (!stockType) errorMessage += '- Type\n';
            if (!milkYield) errorMessage += '- Milk yield\n';
            if (!age) errorMessage += '- Age\n';
            // if (!livestockAttributes.location) errorMessage += '- Location\n';
            if (!livestockAttributes.price) errorMessage += '- Price\n';
            if (!livestockAttributes.quantityAvailable) errorMessage += '- Quantity Available\n';
            if (!livestockAttributes.phonenumber) errorMessage += '- Phone Number\n';


            Alert.alert('Validation Error', errorMessage);
            return false;
        }
        navigation.navigate('uploadimages', { livestockAttributes: livestockAttributesArray, type: 'Live Stock', parent: parent,details:detailsArray,mainid:mainid ,id:parentId});


    };

    const validateFormEquipments = () => {
        if (
            !value ||
            !farmEquipmentAttributes.model ||
            !farmEquipmentAttributes.price ||
            !farmEquipmentAttributes.year ||
            // !farmEquipmentAttributes.hrsdriven ||
            !farmEquipmentAttributes.phonenumber
        ) {
            let errorMessage = 'Please fill in the following mandatory fields:\n';
            if (!value) errorMessage += '- Type\n';
            if (!farmEquipmentAttributes.model) errorMessage += '- Model\n';
            if (!farmEquipmentAttributes.price) errorMessage += '- Price\n';
            if (!farmEquipmentAttributes.year) errorMessage += '- Year\n';
            // if (!farmEquipmentAttributes.hrsdriven) errorMessage += '- Kms/ Hrs. driven\n';
            if (!farmEquipmentAttributes.phonenumber) errorMessage += '- Phone Number\n';


            Alert.alert('Validation Error', errorMessage);
            return false;
        }
        // if (farmEquipmentAttributes.type === 'rent') {
        //     if (!farmEquipmentAttributes.hrsOrDay) {
        //         Alert.alert('Validation Error', 'Please fill in the Rent Duration field');
        //         return false;
        //     }
        // }
        navigation.navigate('uploadimages', { farmEquipmentAttributesAttributes: farmEquipmentAttributesArray, type: 'farmequipments', parent: parent,details:detailsArray,mainid:mainid ,id:parentId});
    };
    const handleSubmit = () => {
        if (mainid === '65fc731c2e0b4ae365115908') {
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
    //Live stocks
    const renderLivestocksView = () => (
        <View style={styles.body}>
            <View style={styles.rectangle}>
                <Image style={styles.back}
                    source={require('../../assets/images/3.png')} />
                <View style={{ justifyContent: 'space-between', alignItems: "center", flexDirection: "row", width: "100%", }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.logintext}>
                            Animal Details
                        </Text>
                    </View>

                </View>
            </View>

            <ScrollView style={{ flex: 1, backgroundColor: '#F3FBF4', top: 20, marginBottom: 10, marginHorizontal: 10 }} showsVerticalScrollIndicator={false}>



                <View style={{ flexDirection: 'column', width: '80%', left: 20, marginTop: '5%' }}>
                    {isCowBuffaloBull ? (
                        <View style={{ flexDirection: 'row', top: 10, width: '100%' }}>
                            <View style={{ width: '60%' }}>
                                <Text style={styles.detailsText}>
                                    Type*
                                </Text>
                                <View style={[styles.stockType, { borderColor: stockType ? '#539F46' : 'red' }]}>
                                    <Dropdown
                                        data={type}
                                        selectedTextStyle={{ fontSize: 14, color: 'black', left: 4 }}
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isTypeFocus ? '  Select' : '...'}
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
                            <View style={{ width: '60%' }}>
                                <Text style={styles.detailsText}>
                                    Milk yield (Ltrs./per day)*
                                </Text>
                                <View style={[styles.stockType, { borderColor: milkYield ? '#539F46' : 'red' }]}>
                                    <Dropdown
                                        data={milkYieldData}
                                        selectedTextStyle={{ fontSize: 14, color: 'black', left: 4 }}
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isMilkYieldFocus ? '  Select' : '...'}
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
                            </View>
                        </View>

                    ) : (

                        <View style={{ flexDirection: 'row', top: 10, width: '100%' }}>
                            <View style={{ width: '60%' }}>
                                <Text style={styles.detailsText}>
                                    Gender*
                                </Text>
                                <View style={[styles.genderInput, { borderColor: stockGender ? '#539F46' : 'red' }]}>
                                    <Dropdown
                                        data={gender}
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocus ? '  Select' : '...'}
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
                                    Weight*
                                </Text>
                                <View style={[styles.ageInput, { borderColor: livestockAttributes.weight ? '#539F46' : 'red' }]}>
                                    <TextInput
                                        placeholder="0"
                                        placeholderTextColor='black'
                                        keyboardType='number-pad'
                                        style={styles.numberinput}
                                        onChangeText={(text) => handleLivestockAttributeChange('Weight', text)}

                                    />
                                </View>
                            </View>

                        </View>
                    )}
                    <View style={{ flexDirection: 'row', top: 35, width: '100%' }}>
                        <View style={{ width: '60%' }}>
                            <Text style={styles.detailsText}>
                                Age*
                            </Text>
                            <View style={[styles.stockType, { borderColor: age ? '#539F46' : 'red' }]}>
                                <Dropdown
                                    data={ageData}
                                    selectedTextStyle={{ fontSize: 14, color: 'black', left: 4 }}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isAgeFocus ? '  Select' : '...'}
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
                                Price*
                            </Text>
                            <View style={[styles.ageInput, { borderColor: livestockAttributes.price ? '#539F46' : 'red' }]}>
                                <TextInput
                                    placeholder="0"
                                    placeholderTextColor='black'
                                    keyboardType='number-pad'
                                    style={styles.numberinput}
                                    onChangeText={(text) => handleLivestockAttributeChange('price', text)}

                                />
                            </View>
                        </View>
                        <View style={{ width: '80%' }}>
                            <Text style={styles.detailsText}>
                                Quantity available*
                            </Text>
                            <View style={[styles.genderInput, { borderColor: livestockAttributes.quantityAvailable ? '#539F46' : 'red' }]}>
                                <TextInput
                                    placeholder="Quantity "
                                    placeholderTextColor='black'
                                    keyboardType='number-pad'
                                    style={styles.numberinput}
                                    onChangeText={(text) => handleLivestockAttributeChange('quantityAvailable', text)}

                                />
                               
                            </View>
                        </View>

                    </View>
                    
                    <View style={{ marginTop: 80 }}>
                        <Text style={styles.detailsText}>
                            Phone Number*
                        </Text>
                        <View style={[styles.phonenumber, { borderColor: livestockAttributes.phonenumber ? '#539F46' : 'red' }]}>
                            <TextInput
                                placeholder="Phone Number"
                                placeholderTextColor='black'
                                maxLength={10}
                                keyboardType='number-pad'
                                style={styles.numberinput}
                                onChangeText={(text) => handleLivestockAttributeChange('phonenumber', text)}

                            />
                        </View>
                    </View>
                    <View style={{top:'5%' }}>
                     
                     <Text style={styles.detailsText}>
                         Location
                     </Text>
                     <GooglePlacesAutocomplete
                     
                         placeholder="Search  location"
                         onPress={(data, details = null) => {
                             console.log("location",data);
                              handleLivestockAttributeChange('location', details?.geometry?.location);
                              handleLivestockAttributeChange('place',data?.description)
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
                    <View style={{ marginTop: 40 }}>
                        <Text style={styles.detailsText}>
                            Description
                        </Text>
                        <View style={styles.referalInput}>
                            <TextInput
                                placeholder="Description Here.."
                                placeholderTextColor='black'
                                style={styles.numberinput}
                                onChangeText={(text) => handleLivestockAttributeChange('description', text)}

                            />
                        </View>
                    </View>



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




            <View style={{

                justifyContent: 'flex-end',
                flexDirection: 'row',
                backgroundColor: '#F3FBF4',
                marginHorizontal: 10,
                marginBottom: 10

            }}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => { goBack() }}>
                    <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
                        Back
                    </Text>

                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => {
                        handleSubmit()
                        console.log(livestockAttributesArray);
                    }}>
                    <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
                        Next
                    </Text>

                </TouchableOpacity>

            </View>

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
                            Product Details
                        </Text>
                    </View>

                </View>
            </View>

            <ScrollView style={{ flex: 1, zIndex:1,backgroundColor: '#F3FBF4', top: 20, marginBottom: 10, marginHorizontal: 10 }} showsVerticalScrollIndicator={false}>



                <View style={{ flexDirection: 'column', width: '80%', left: 20, marginTop: '5%' }}>

                    <View style={{ flexDirection: 'row', top: 10, width: '100%' }}>
                        <View style={{ width: '60%' }}>
                            <Text style={styles.detailsText}>
                                Sell / Rent*
                            </Text>
                            <View style={[styles.genderInput, { borderColor: value ? '#539F46' : 'red' }]}>
                                <Dropdown
                                    selectedTextStyle={{ fontSize: 14, color: 'black', left: 4 }}
                                    data={data}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocus ? '  Select' : '...'}
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
                                        selectedTextStyle={{ fontSize: 14, color: 'black', left: 4 }}
                                        data={hrsDayData}
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
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
                                Kms driven
                            </Text>
                            <View style={[styles.ageInput]}>
                                <TextInput
                                    placeholder={`0 ${'Kms'}`}
                                    placeholderTextColor='black'
                                    keyboardType='number-pad'
                                    style={styles.numberinput}
                                    onChangeText={(text) => handleFarmEquipmentsAttributeChange('kms/hrs', text)}

                                />
                            </View>
                        </View>}

                    </View>
                    <View style={{ flexDirection: 'row', top: 35, width: '100%' }}>
                        <View style={{ width: '60%' }}>
                            <Text style={styles.detailsText}>
                                Model*
                            </Text>
                            <View style={[styles.genderInput, { borderColor: modelValue ? '#539F46' : 'red' }]}>
                                <Dropdown
                                    selectedTextStyle={{ fontSize: 14, color: 'black', left: 4 }}
                                    data={farmmodel}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocus ? '  Select' : '...'}
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
                                            {hrsDay === 'hour' ? 'Hour*'  : 'Day*'}
                                        </Text>
                                        <View style={styles.ageInput}>
                                            <TextInput
                                                placeholder={`0 ${hrsDay === 'hour' ? 'Hrs' : 'Day'}`}
                                                placeholderTextColor='black'
                                                keyboardType='number-pad'
                                                style={styles.numberinput}
                                                onChangeText={(text) => handleFarmEquipmentsAttributeChange(
                                                    hrsDay === 'hour' ? 'hour' : 'day',
                                                    text
                                                )}
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
                                Year*
                            </Text>
                            <View style={[styles.ageInput, { borderColor: farmEquipmentAttributes.year ? '#539F46' : 'red' }]}>
                                <TextInput
                                    placeholder="0"
                                    placeholderTextColor='black'
                                    keyboardType='number-pad'
                                    style={styles.numberinput}
                                    onChangeText={(text) => handleFarmEquipmentsAttributeChange('year', text)}

                                />
                            </View>
                        </View>
                        <View style={{ width: '80%' }}>
                            <Text style={styles.detailsText}>
                                Price*
                            </Text>
                            <View style={[styles.genderInput, { borderColor: farmEquipmentAttributes.price ? '#539F46' : 'red' }]}>
                                <TextInput
                                    placeholder="0"
                                    placeholderTextColor='black'
                                    keyboardType='number-pad'
                                    style={styles.numberinput}
                                    onChangeText={(text) => handleFarmEquipmentsAttributeChange('price', text)}

                                />

                            </View>
                        </View>


                    </View>
                  


                    <View style={{ marginTop: 95 }}>
                        <Text style={styles.detailsText}>
                            Phone Number*
                        </Text>
                        <View style={[styles.phonenumber, { borderColor: farmEquipmentAttributes.phonenumber ? '#539F46' : 'red' }]}>
                            <TextInput
                                placeholder="Phone Number"
                                placeholderTextColor='black'
                                keyboardType='number-pad'
                                style={styles.numberinput}
                                maxLength={10}
                                onChangeText={(text) => handleFarmEquipmentsAttributeChange('phonenumber', text)}
                            />
                        </View>
                    </View>
                    <View style={{top:'5%' }}>
                     
                     <Text style={styles.detailsText}>
                         Location
                     </Text>
                     <GooglePlacesAutocomplete
                     
                         placeholder="Search  location"
                         onPress={(data, details = null) => {
                             console.log("location",data.description);
                              handleFarmEquipmentsAttributeChange('location', details?.geometry?.location);
                              handleFarmEquipmentsAttributeChange('place',data.description)
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
                    <View style={{ marginTop: 40 }}>
                        <Text style={styles.detailsText}>
                            Owner / Driver info
                        </Text>
                        <View style={styles.referalInput}>
                            <TextInput
                                placeholder="Owner / Driver info Here.."
                                placeholderTextColor='black'
                                onChangeText={(text) => handleFarmEquipmentsAttributeChange('description', text)}

                                style={styles.numberinput}

                            />
                        </View>
                    </View>




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




            <View style={{

                justifyContent: 'flex-end',
                flexDirection: 'row',
                backgroundColor: '#F3FBF4',
                marginHorizontal: 10,
                marginBottom: 10

            }}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => { goBack() }}>
                    <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
                        Back
                    </Text>

                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => {
                        console.log("farmdata", farmEquipmentAttributes);
                        handleSubmit()
                    }}>
                    <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
                        Next
                    </Text>

                </TouchableOpacity>

            </View>

        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingContainer}
        >
            {mainid === '65fc731c2e0b4ae365115908' ? renderLivestocksView() : renderEquipmentsView()}

        </KeyboardAvoidingView>
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
        position:'relative'
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
        marginHorizontal: 20,
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

    }

})
export default Details;