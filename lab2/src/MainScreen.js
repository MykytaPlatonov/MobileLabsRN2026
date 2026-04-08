import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { newsData } from './data';

export default function MainScreen({ navigation }) {
  const [data, setData] = useState(newsData.slice(0, 10));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setData(newsData.slice(0, 10));
      setRefreshing(false);
    }, 1500);
  };

  const loadMore = () => {
    if (data.length < newsData.length) {
      const moreData = newsData.slice(data.length, data.length + 5);
      setData([...data, ...moreData]);
    }
  };

  const Header = () => <Text style={styles.header}>Останні новини</Text>;
  const Footer = () => data.length < newsData.length ? <ActivityIndicator size="large" /> : <Text style={styles.footer}>Кінець списку</Text>;
  const Separator = () => <View style={styles.separator} />;

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => navigation.navigate('Details', item)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={Header}
      ListFooterComponent={Footer}
      ItemSeparatorComponent={Separator}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      windowSize={5}
    />
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', padding: 10, alignItems: 'center' },
  image: { width: 50, height: 50, marginRight: 10, borderRadius: 25 },
  title: { fontSize: 18, fontWeight: 'bold' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  footer: { textAlign: 'center', padding: 10, color: 'gray' },
  separator: { height: 1, backgroundColor: '#ccc' },
});