import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';

import { GameProvider } from './GameContext';
import GameScreen from './screens/GameScreen';
import SettingsScreen from './screens/SettingsScreen';
import TasksScreen from './screens/TasksScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <GameProvider> 
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#4a90e2" />
        
        <View style={styles.topAppHeader}>
          <Text style={styles.appTitleText}>Clicker Game</Text>
        </View>

        <Drawer.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#e29c4a', elevation: 0, shadowOpacity: 0 },
            headerTintColor: '#fff',
            drawerActiveTintColor: '#e29c4a',
          }}
        >
          <Drawer.Screen name="Game" component={GameScreen} options={{ title: 'Гра' }} />
          <Drawer.Screen name="Tasks" component={TasksScreen} options={{ title: 'Завдання' }} />
          <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Налаштування' }} />
        </Drawer.Navigator>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Платонов Микита ІПЗ 22-2</Text>
        </View>
      </NavigationContainer>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  topAppHeader: { backgroundColor: '#e29c4a', paddingTop: 50, paddingHorizontal: 15, paddingBottom: 5 },
  appTitleText: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'left' },
  footer: { paddingVertical: 20, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#ddd' },
  footerText: { fontSize: 14, color: '#777', textAlign: 'center' }
});