import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function GalleryScreen() {
  const images = [
    'https://picsum.photos/id/10/200/300',
    'https://picsum.photos/id/20/200/300',
    'https://picsum.photos/id/30/200/300',
    'https://picsum.photos/id/40/200/300',
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Фотогалерея</Text>
      <View style={styles.gallery}>
        {images.map((img, index) => (
          <Image key={index} source={{ uri: img }} style={styles.image} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  image: {
    width: '48%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
});