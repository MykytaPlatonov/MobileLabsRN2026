import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, Button, Alert } from 'react-native';

export default function ProfileScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    if (!name || !email || !password) {
      Alert.alert('Помилка', 'Будь ласка, заповніть всі поля');
      return;
    }
    if (password.length < 4) {
      Alert.alert('Помилка', 'Пароль має містити щонайменше 4 символи');
      return;
    }
    Alert.alert('Успіх', `Профіль збережено!\nІм'я: ${name}\nEmail: ${email}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профіль користувача</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Ім'я"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <Button
          title={showPassword ? "Сховати" : "Показати"}
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>
      
      <View style={styles.switchContainer}>
        <Text>Отримувати сповіщення:</Text>
        <Switch
          value={isEnabled}
          onValueChange={setIsEnabled}
        />
      </View>
      
      <Button title="Зарєструватися" onPress={handleSave} color="#007AFF" />
      
      {name !== '' && email !== '' && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Інформація профілю:</Text>
          <Text style={styles.infoText}>👤 {name}</Text>
          <Text style={styles.infoText}>📧 {email}</Text>
          <Text style={styles.infoText}>🔔 {isEnabled ? 'Сповіщення увімкнено' : 'Сповіщення вимкнено'}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  passwordContainer: {
    marginBottom: 15,
  },
  passwordInput: {
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e8f4f8',
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
}); 