import { View, Text, StyleSheet, Button, Alert, Image } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://reactnative.dev/img/tiny/logo.png' }}
        style={styles.logo}
      />
      <Text style={styles.title}>Ласкаво просимо!</Text>
      <Text style={styles.subtitle}>Мій перший мобільний додаток</Text>
      <Button 
        title="Натисни мене" 
        onPress={() => Alert.alert('Привіт', 'Додаток працює')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
});