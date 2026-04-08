import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { contactsData } from './data';

export default function ContactsScreen() {
  const Separator = () => <View style={styles.separator} />;

  return (
    <SectionList
      sections={contactsData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.header}>{title}</Text>
      )}
      ItemSeparatorComponent={Separator}
    />
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 20, fontWeight: 'bold', backgroundColor: '#eee', padding: 5, marginTop: 10 },
  item: { padding: 15, fontSize: 18 },
  separator: { height: 1, backgroundColor: '#ddd' },
});