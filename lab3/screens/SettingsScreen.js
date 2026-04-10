import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { GameContext } from '../GameContext';

export default function SettingsScreen() {
  const { resetStats } = useContext(GameContext); 

  const [vibration, setVibration] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleReset = () => {
    Alert.alert(
      "Скидання прогресу",
      "Ви впевнені, що хочете видалити всі очки та досягнення?",
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "Так, скинути", 
          style: "destructive", 
          onPress: () => {
            resetStats(); 
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Геймплей</Text>
        <View style={styles.row}>
          <Text style={styles.rowText}>Вібрація при кліку</Text>
          <Switch value={vibration} onValueChange={setVibration} trackColor={{ true: '#4a90e2' }} />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Показувати підказки</Text>
          <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: '#4a90e2' }} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Зовнішній вигляд</Text>
        <View style={styles.row}>
          <Text style={styles.rowText}>Темний режим</Text>
          <Switch value={darkTheme} onValueChange={setDarkTheme} trackColor={{ true: '#4a90e2' }} />
        </View>
      </View>

      <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
        <Text style={styles.resetBtnText}>Очистити дані гри</Text>
      </TouchableOpacity>

      <View style={styles.footerInfo}>
        <Text style={styles.version}>Версія додатка 2.0.0</Text>
        <Text style={styles.dev}>Розроблено: Платонов Микита ІПЗ 22-2</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#e29c4a', textTransform: 'uppercase', marginBottom: 15 },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
  },
  rowText: { fontSize: 16, color: '#333' },
  resetBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },
  resetBtnText: { color: '#ff6b6b', fontWeight: 'bold' },
  footerInfo: { marginTop: 'auto', alignItems: 'center', paddingBottom: 40 },
  version: { color: '#ccc', fontSize: 12 },
  dev: { color: '#999', fontSize: 12, marginTop: 5 }
});