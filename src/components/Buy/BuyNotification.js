import React,{useEffect} from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity,Image, BackHandler } from 'react-native';

const BuyNotification = ({ navigation, navigation: { goBack } }) => {
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
    const notifications = [
    { id: '1', message: 'Your notification will appear here.' },
    // { id: '2', message: 'Payment received for your listing.' },
    // { id: '3', message: 'Reminder: Don\'t forget to rate your recent purchase.' },
    
  ];

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
    <View style={styles.notificationCard}>
      <View style={styles.iconContainer}>
        {/* Customize the icon based on your preference */}
        <Text style={styles.icon}>🔔</Text>
      </View>
      <Text style={styles.notificationText}>{item.message}</Text>
    </View>
  </View>
  );

  return (
    <View style={styles.container}>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:60}}>
            <TouchableOpacity style={{ flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center', paddingHorizontal: 16,top:25}}
      onPress={() => goBack()} >
      <Image style={{width:40,height:40}} source={require('../../assets/images/backround.png')} />
      </TouchableOpacity>
      
            
            </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:'white'
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 25,
    
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#80B741',
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 16,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#62A845',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 20,
    color: '#fff',
  },
  notificationText: {
    flex: 1,
    fontSize: 16,
  },
});

export default BuyNotification;
