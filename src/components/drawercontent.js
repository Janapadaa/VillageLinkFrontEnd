// DrawerContent.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const DrawerContent = ({ navigation }) => {
  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.drawerContent}>
      <TouchableOpacity onPress={() => handleNavigation("location")}>
        <Text>Location</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation("buyorsell")}>
        <Text>Buy or Sell</Text>
      </TouchableOpacity>
      {/* Add more items as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    padding: 16,
  },
});

export default DrawerContent;
