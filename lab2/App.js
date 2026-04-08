import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import ContactsScreen from './src/ContactsScreen';
import DetailsScreen from './src/DetailsScreen';
import MainScreen from './src/MainScreen';

const Stack = createNativeStackNavigator(); 
const Drawer = createDrawerNavigator(); 

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={MainScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
      />
    </Stack.Navigator>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image source={{ uri: 'https://via.placeholder.com/80' }} style={styles.avatar} /> {/* Аватар [cite: 105] */}
        <Text style={styles.name}>Платонов Микита</Text> 
        <Text style={styles.group}>Група ІПЗ-22-2</Text> 
      </View>
      <DrawerItemList {...props} /> 
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <NavigationContainer>
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="Новини" component={HomeStack} /> 
          <Drawer.Screen name="Контакти" component={ContactsScreen} /> 
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: { padding: 20, backgroundColor: '#f4f4f4', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: 'bold' },
  group: { fontSize: 14, color: 'gray' },
});