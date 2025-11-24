import React, { useState,useEffect } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet, TextInput, Alert, BackHandler } from "react-native";
import PhonePePaymentSDK from 'react-native-phonepe-pg';
import { NativeModules } from 'react-native';
import { Linking } from 'react-native';
import RNFS from 'react-native-fs';

const BuyPayments = ({ navigation, navigation: { goBack } }) => {
  const [balance, setBalance] = useState(0.0); // State for the wallet balance
  const [amount, setAmount] = useState(''); // State for the input amount
  const { PackageManager } = NativeModules;
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
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack(); 
        return true; 
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  const initiatePayment = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
          Alert.alert('Invalid Amount', 'Please enter a valid amount.');
          return;
        }
    Linking.openURL('phonepe://'); // Open PhonePe app
  };
  
  // const initiatePayment = () => {
  //   const numericAmount = parseFloat(amount);
  //   if (isNaN(numericAmount) || numericAmount <= 0) {
  //     Alert.alert('Invalid Amount', 'Please enter a valid amount.');
  //     return;
  //   }
  
  //   PhonePePaymentSDK.init(
  //     'SANDBOX', // Use 'SANDBOX' for testing
  //     'YOUR_MERCHANT_ID',
  //     'YOUR_APP_ID', // Not required for SANDBOX
  //     true // Enable logging for debugging
  //   ).then(result => {
  //     console.log('Initialization result:', result);
  //     if (result) {
  //       checkPhonePeInstallation(numericAmount);
  //     } else {
  //       Alert.alert('Initialization Error', 'Failed to initialize PhonePe SDK.');
  //     }
  //   }).catch(error => {
  //     console.error('Initialization error:', error);
  //   });
  // };
  
  // const checkPhonePeInstallation = (numericAmount) => {
  //   PhonePePaymentSDK.isGPayAppInstalled().then(isInstalled => {
  //     console.log('isPhonePeInstalled result:', isInstalled);
  //     if (isInstalled) {
  //       console.log("PhonePe App Installed");
  //       // Create the payment request
  //       const paymentRequest = {
  //         amount: numericAmount * 100, // Amount in paise (1 INR = 100 paise)
  //         transactionId: 'txn_' + new Date().getTime(),
  //         merchantId: 'YOUR_MERCHANT_ID',
  //         message: 'Payment for adding money to wallet',
  //         email: 'user@example.com', // Optional
  //         mobile: '9876543210', // Optional
  //         paymentMode: 'UPI',
  //         callbackUrl: 'YOUR_CALLBACK_URL' // URL to handle the payment response
  //       };
  
  //       PhonePePaymentSDK.startTransaction(
  //         JSON.stringify(paymentRequest),
  //         'YOUR_CHECKSUM',
  //         null, // Optional: packageName
  //         null // Optional: appSchema
  //       ).then(response => {
  //         console.log('Payment initiation response:', response);
  //         if (response.status === 'SUCCESS') {
  //           // Handle the successful payment initiation, redirect to PhonePe
  //           redirectToPhonePe();
  //         } else {
  //           Alert.alert('Payment Failed', response.error || 'Something went wrong.');
  //         }
  //       }).catch(error => {
  //         console.error('Payment initiation error:', error);
  //         Alert.alert('Payment Initiation Error', 'An error occurred while initiating the payment.');
  //       });
  //     } else {
  //       console.log("PhonePe App Unavailable");
  //       Alert.alert("PhonePe App is not installed.");
  //       // List all installed packages for debugging
  //       PackageManager.getInstalledPackages().then(packages => {
  //         console.log('Installed packages:', packages);
  //       }).catch(error => {
  //         console.error('Error getting installed packages:', error);
  //       });
  //     }
  //   }).catch(error => {
  //     console.error('Error checking PhonePe installation:', error);
  //   });
  // };

  // const redirectToPhonePe = () => {
  //   Linking.openURL('https://pay.google.com/');

  //   // Implement redirection logic to PhonePe app or website
  // };

  const handleAddMoney = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    setBalance(prevBalance => prevBalance + numericAmount);
    setAmount('');
  };

  return (
    <View style={styles.body}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, top: 25 }}
          onPress={() => goBack()}
        >
          <Image style={{ width: 40, height: 40 }} source={require('../../assets/images/backround.png')} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', top: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#539F46' }}>
        {languageData?.payment_screen?.title}

        </Text>
      </View>

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ height: '80%', width: '80%', backgroundColor: '#F3FBF4', borderWidth: 1, borderRadius: 25, borderColor: '#539F46', elevation: 10, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', marginBottom: '15%' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#539F46', left: 10 }}>
            {languageData?.payment_screen?.my_wallet_balance}

            </Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: 'black', left: 45, top: 2 }}>
              ₹ {balance.toFixed(2)}
            </Text>
          </View>
          <View>
            <TextInput
              style={{ backgroundColor: '#edeff7', marginHorizontal: '25%', top: '10%', borderRadius: 10, paddingHorizontal: 10 ,color:'black'}}
              placeholder={languageData?.payment_screen?.placeholder}
              placeholderTextColor={'black'}
              keyboardType="number-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', top: 20 }}>
            <TouchableOpacity style={styles.sendButton} onPress={initiatePayment}>
              <Text style={styles.sendButtonText}>
              {languageData?.payment_screen?.add_money_button_text}
                </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    flex: 1,
    paddingVertical:'5%'
  },
  sendButton: {
    width: '30%',
    backgroundColor: "#539F46",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BuyPayments;
