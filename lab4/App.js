import * as FileSystem from 'expo-file-system/legacy'; // Використовуємо legacy API для SDK 54
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Новий правильний імпорт

// Допоміжна функція для форматування байтів
const formatBytes = (bytes) => {
  if (!bytes) return '0 MB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

export default function App() {
  const rootDir = FileSystem.documentDirectory; 
  const [currentPath, setCurrentPath] = useState(rootDir); 
  const [files, setFiles] = useState([]); 
  const [stats, setStats] = useState({ total: 0, free: 0, used: 0 }); 

  const [createModal, setCreateModal] = useState({ visible: false, type: 'file' });
  const [inputName, setInputName] = useState('');
  const [inputContent, setInputContent] = useState(''); 

  const [editorModal, setEditorModal] = useState({ visible: false, path: '', content: '', originalName: '' }); 
  const [infoModal, setInfoModal] = useState({ visible: false, data: null }); 

  useEffect(() => {
    if (currentPath) {
      loadStats();
      loadDirectory(currentPath);
    }
  }, [currentPath]);

  const loadStats = async () => {
    try {
      const free = await FileSystem.getFreeDiskStorageAsync(); 
      const total = await FileSystem.getTotalDiskCapacityAsync(); 
      const used = total - free; 
      setStats({ total, free, used });
    } catch (e) {
      console.log('Помилка завантаження статистики', e);
    }
  };

  const loadDirectory = async (path) => {
    if (!path) return;
    try {
      const items = await FileSystem.readDirectoryAsync(path);
      const detailedItems = await Promise.all(
        items.map(async (item) => {
          const itemPath = path + item;
          const info = await FileSystem.getInfoAsync(itemPath);
          return { name: item, ...info };
        })
      );
      setFiles(detailedItems.sort((a, b) => (a.isDirectory === b.isDirectory ? 0 : a.isDirectory ? -1 : 1)));
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося прочитати директорію");
    }
  };

  const handlePress = async (item) => {
    if (item.isDirectory) {
      setCurrentPath(currentPath + item.name + '/'); 
    } else if (item.name.endsWith('.txt')) {
      const content = await FileSystem.readAsStringAsync(currentPath + item.name);
      setEditorModal({ visible: true, path: currentPath + item.name, content, originalName: item.name });
    } else {
      Alert.alert("Інфо", "Цей тип файлу не підтримується для читання.");
    }
  };

  const goBack = () => {
    if (!currentPath || currentPath === rootDir) return;
    
    let newPath = currentPath;
    if (newPath.endsWith('/')) newPath = newPath.slice(0, -1);
    const lastSlashIndex = newPath.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      setCurrentPath(newPath.substring(0, lastSlashIndex + 1));
    } else {
      setCurrentPath(rootDir);
    }
  };

  const getDisplayPath = () => {
    if (!currentPath || !rootDir) return '/';
    return currentPath.replace(rootDir, '/') || '/';
  };

  const createItem = async () => {
    if (!inputName.trim()) {
       Alert.alert("Помилка", "Введіть назву");
       return;
    }
    const path = currentPath + inputName;
    try {
      if (createModal.type === 'folder') {
        await FileSystem.makeDirectoryAsync(path); 
      } else {
        const fileName = inputName.endsWith('.txt') ? inputName : inputName + '.txt';
        await FileSystem.writeAsStringAsync(currentPath + fileName, inputContent || ''); 
      }
      setCreateModal({ visible: false, type: 'file' });
      setInputName('');
      setInputContent('');
      loadDirectory(currentPath);
    } catch (e) {
      Alert.alert("Помилка", "Не вдалося створити елемент");
    }
  };

  const saveFile = async () => {
    try {
      await FileSystem.writeAsStringAsync(editorModal.path, editorModal.content); 
      setEditorModal({ visible: false, path: '', content: '', originalName: '' });
      Alert.alert("Успіх", "Файл збережено!");
    } catch (e) {
      Alert.alert("Помилка", "Не вдалося зберегти зміни");
    }
  };

  const confirmDelete = (name) => {
    Alert.alert("Підтвердження", `Ви точно хочете видалити "${name}"?`, [
      { text: "Скасувати", style: "cancel" },
      { text: "Видалити", style: "destructive", onPress: () => deleteItem(name) }
    ]);
  };

  const deleteItem = async (name) => {
    try {
      await FileSystem.deleteAsync(currentPath + name, { idempotent: true }); 
      loadDirectory(currentPath);
    } catch (e) {
      Alert.alert("Помилка", "Не вдалося видалити елемент");
    }
  };

  const showInfo = async (name) => {
    try {
      const info = await FileSystem.getInfoAsync(currentPath + name);
      const ext = name.includes('.') ? name.split('.').pop() : 'немає';
      const date = new Date(info.modificationTime * 1000).toLocaleString(); 
      
      setInfoModal({
        visible: true,
        data: {
          name, 
          type: info.isDirectory ? 'Папка' : `Файл (.${ext})`, 
          size: formatBytes(info.size), 
          modDate: date 
        }
      });
    } catch (e) {
      Alert.alert("Помилка", "Не вдалося отримати атрибути");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Панель статистики */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Пам'ять пристрою:</Text>
        <Text>Загальна: {formatBytes(stats.total)}</Text> 
        <Text>Зайнята: {formatBytes(stats.used)}</Text> 
        <Text>Вільна: {formatBytes(stats.free)}</Text>
      </View>

      {/* Навігація */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.btn} onPress={goBack} disabled={currentPath === rootDir}>
          <Text style={{ color: currentPath === rootDir ? 'gray' : 'blue' }}>Вгору ⬆️</Text>
        </TouchableOpacity>
        <Text style={styles.breadcrumb} numberOfLines={1}>Шлях: {getDisplayPath()}</Text>
      </View>

      {/* Кнопки створення */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.btnCreate} onPress={() => setCreateModal({ visible: true, type: 'folder' })}>
          <Text style={styles.btnText}>+ Папка</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnCreate} onPress={() => setCreateModal({ visible: true, type: 'file' })}>
          <Text style={styles.btnText}>+ Файл .txt</Text>
        </TouchableOpacity>
      </View>

      {/* Список */}
      <FlatList
        data={files}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.fileItem}>
            <TouchableOpacity style={styles.itemTouch} onPress={() => handlePress(item)}>
              <Text style={styles.itemIcon}>{item.isDirectory ? '📁' : '📄'}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
            </TouchableOpacity>
            
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => showInfo(item.name)}>
                <Text style={styles.iconBtn}>ℹ️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDelete(item.name)}>
                <Text style={styles.iconBtn}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Модалка створення */}
      <Modal visible={createModal.visible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Створити {createModal.type === 'folder' ? 'папку' : 'файл'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Введіть назву..."
              value={inputName}
              onChangeText={setInputName}
            />
            {createModal.type === 'file' && (
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Початковий вміст файлу..."
                value={inputContent}
                onChangeText={setInputContent}
                multiline
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.btn} onPress={() => setCreateModal({ visible: false, type: 'file' })}>
                <Text>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, {backgroundColor: '#e0f7fa'}]} onPress={createItem}>
                <Text>Створити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модалка редагування */}
      <Modal visible={editorModal.visible} animationType="slide">
        <SafeAreaView style={styles.editorContainer}>
          <Text style={styles.editorTitle}>Редагування: {editorModal.originalName}</Text>
          <TextInput
            style={styles.editorInput}
            value={editorModal.content}
            onChangeText={(text) => setEditorModal({...editorModal, content: text})}
            multiline
            textAlignVertical="top"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.btn} onPress={() => setEditorModal({ visible: false, path: '', content: '', originalName: '' })}>
              <Text>Закрити</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, {backgroundColor: '#dcedc8'}]} onPress={saveFile}>
              <Text>Зберегти</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Модалка інформації */}
      <Modal visible={infoModal.visible} animationType="fade" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Властивості</Text>
            {infoModal.data && (
              <View style={styles.infoBlock}>
                <Text>Назва: {infoModal.data.name}</Text>
                <Text>Тип: {infoModal.data.type}</Text>
                <Text>Розмір: {infoModal.data.size}</Text>
                <Text>Змінено: {infoModal.data.modDate}</Text>
              </View>
            )}
            <TouchableOpacity style={[styles.btn, {marginTop: 10, alignSelf: 'center'}]} onPress={() => setInfoModal({visible: false, data: null})}>
              <Text>ОК</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  statsContainer: { padding: 15, backgroundColor: '#e3f2fd', borderBottomWidth: 1, borderColor: '#bbdefb' },
  statsTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  navBar: { flexDirection: 'row', padding: 15, alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ddd' },
  breadcrumb: { marginLeft: 10, flex: 1, fontSize: 16, color: '#333' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 10 },
  btnCreate: { backgroundColor: '#4caf50', padding: 10, borderRadius: 5, width: '45%', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  fileItem: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
  itemTouch: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  itemIcon: { fontSize: 24, marginRight: 10 },
  itemName: { fontSize: 16 },
  itemActions: { flexDirection: 'row' },
  iconBtn: { fontSize: 20, marginLeft: 15 },
  modalBg: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalCard: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { padding: 10, borderRadius: 5 },
  editorContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },
  editorTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  editorInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, fontSize: 16, marginBottom: 15 },
  infoBlock: { marginBottom: 10 }
});