import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/homeScreen';
import { Habit } from '../../types/habit';

const EMOJI_OPTIONS = ['🏋️', '💧', '📚', '🏃', '🧘', '🥗', '😴', '💊', '🎯', '✍️', '🎸', '🧹', '💻', '🚴', '🍎', '🧠'];

const STORAGE_KEY = 'habits';

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('');

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
      emoji: newEmoji.trim() || '⭐',
      completed: false,
    };
    setHabits([...habits, newHabit]);
    setNewName('');
    setNewEmoji('');
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

      {habits.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyTitle}>No habits yet</Text>
          <Text style={styles.emptySubtitle}>Tap the + button to add your first habit and start tracking your daily routine.</Text>
          <Text style={styles.emptySubtitle}>Long press on a habit to delete it</Text>
        </View>
      )}

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
          <Text style={styles.emojiLabel}>Choose an emoji:</Text>
          <View style={styles.emojiGrid}>
            {EMOJI_OPTIONS.map(emoji => (
              <TouchableOpacity
                key={emoji}
                style={[styles.emojiOption, newEmoji === emoji && styles.emojiSelected]}
                onPress={() => setNewEmoji(emoji)}
              >
                <Text style={styles.emojiOptionText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
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