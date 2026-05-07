import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const INITIAL_HABITS = [
  { id: '1', name: 'Gym', emoji: '🏋️', completed: false },
  { id: '2', name: 'Drink 2L of water', emoji: '💧', completed: false },
  { id: '3', name: 'Read 30 min', emoji: '📚', completed: false },
];

const STORAGE_KEY = 'habits';

export default function HomeScreen() {
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [formVisible, setFormVisible] = useState(false);
  const [newName, setNewName] = useState('');

  // Load habits from storage on app start
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setHabits(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load habits', e);
      }
    };
    loadHabits();
  }, []);

  // Save habits to storage whenever they change
  useEffect(() => {
    const saveHabits = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
      } catch (e) {
        console.error('Failed to save habits', e);
      }
    };
    saveHabits();
  }, [habits]);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h =>
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
  };

  const addHabit = () => {
    if (!newName.trim()) return;
    const newHabit = {
      id: Date.now().toString(),
      name: newName.trim(),
      emoji: '⭐',
      completed: false,
    };
    setHabits([...habits, newHabit]);
    setNewName('');
    setFormVisible(false);
  };

  const deleteHabit = (id: string) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setHabits(habits.filter(h => h.id !== id)) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Habits 💪</Text>

      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, item.completed && styles.cardCompleted]}
            onPress={() => toggleHabit(item.id)}
            onLongPress={() => deleteHabit(item.id)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={[styles.name, item.completed && styles.nameCompleted]}>
              {item.name}
            </Text>
            <Text style={styles.check}>{item.completed ? '✅' : '⬜'}</Text>
          </TouchableOpacity>
        )}
      />

      {formVisible && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Habit name..."
            value={newName}
            onChangeText={setNewName}
            autoFocus
          />
          <TouchableOpacity style={styles.btnConfirm} onPress={addHabit}>
            <Text style={styles.btnConfirmText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.btnAdd}
        onPress={() => setFormVisible(!formVisible)}
      >
        <Text style={styles.btnAddText}>{formVisible ? '✕' : '+'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardCompleted: {
    backgroundColor: '#e8f5e9',
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  nameCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  check: {
    fontSize: 20,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  btnConfirm: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  btnConfirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnAdd: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  btnAddText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 36,
  },
});