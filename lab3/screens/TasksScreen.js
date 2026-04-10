import React, { useContext } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { GameContext } from '../GameContext';

export default function TasksScreen() {
  const { stats } = useContext(GameContext); 

  const tasks = [
    { id: '1', title: 'Клікер', desc: 'Зробити 10 звичайних кліків', goal: 10, current: stats.clicks, icon: '💢' },
    { id: '2', title: 'Double', desc: 'Зробити подвійний клік 5 разів', goal: 5, current: stats.doubleClicks, icon: '✌️' },
    { id: '3', title: 'Холдер', desc: 'Утримувати об\'єкт 3 секунди', goal: 1, current: stats.longPresses, icon: '🕑' },
    { id: '4', title: 'Експлорер', desc: 'Перетягнути об\'єкт по екрану', goal: 1, current: stats.pans, icon: '🏃' },
    { id: '5', title: 'Розтяжка', desc: 'Змінити розмір через Pinch', goal: 1, current: stats.pinches, icon: '🤏' },
    { id: '6', title: 'Свайпер', desc: 'Зробити швидкий свайп (Fling)', goal: 2, current: stats.flings, icon: '↔️' },
    { id: '7', title: 'Мега Клікер', desc: 'Набрати загалом 100 очок', goal: 100, current: stats.score, icon: '💸' },
    { id: '8', title: 'Власне: Торнадо', desc: 'Зробити оберт об\'єкта (Rotation)', goal: 1, current: stats.rotations, icon: '🌪️' },
  ];

  const renderItem = ({ item }) => {
    const isDone = item.current >= item.goal;
    const progress = Math.min(item.current / item.goal, 1);

    return (
      <View style={[styles.card, isDone && styles.cardDone]}>
        <View style={styles.cardHeader}>
          <Text style={styles.icon}>{item.icon}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDesc}>{item.desc}</Text>
          </View>
          <Text style={styles.statusText}>{isDone ? '✅' : `${item.current}/${item.goal}`}</Text>
        </View>
        
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }, isDone && styles.progressFillDone]} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Твій прогрес 🏆</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { fontSize: 24, fontWeight: '900', color: '#333', padding: 20, paddingTop: 10 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  cardDone: { borderColor: '#4CAF50', borderLeftWidth: 5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  icon: { fontSize: 24, marginRight: 15 },
  textContainer: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  taskDesc: { fontSize: 12, color: '#7f8c8d' },
  statusText: { fontWeight: 'bold', color: '#e29c4a' },
  progressBg: { height: 6, backgroundColor: '#eee', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4a90e2' },
  progressFillDone: { backgroundColor: '#4CAF50' }
});