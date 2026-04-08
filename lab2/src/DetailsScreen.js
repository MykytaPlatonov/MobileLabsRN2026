import React, { useLayoutEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function DetailsScreen({ route, navigation }) {
  const { title, description, image } = route.params; 

  useLayoutEffect(() => {
    navigation.setOptions({ title: title });
  }, [navigation, title]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  image: { width: 200, height: 200, marginBottom: 20, borderRadius: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center' },
});