import { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { EMOJI_OPTIONS } from '../../constants/habits';
import { useTheme } from '../../context/ThemeContext';
import { loadHabits, saveHabits } from '../../storage/habitStorage';
import { makeStyles } from '../../styles/homeScreen';
import { Habit } from '../../types/habit';

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('');
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('');

  const { colors, toggleTheme, theme } = useTheme();
  const styles = makeStyles(colors);

  useEffect(() => {
    loadHabits().then(setHabits);
  }, []);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h =>
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
  };

  const addHabit = () => {
    if (!newName.trim()) return;
    const newHabit: Habit = {
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
    setHabits(habits.filter(h => h.id !== id));
  };

  const onLongPress = (habit: Habit) => {
    Alert.alert(
      habit.name,
      'What do you want to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '✏️ Edit', onPress: () => openEdit(habit) },
        { text: '🗑️ Delete', style: 'destructive', onPress: () => deleteHabit(habit.id) },
      ]
    );
  };

  const openEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setEditName(habit.name);
    setEditEmoji(habit.emoji);
    setFormVisible(false);
  };

  const confirmEdit = () => {
    if (!editName.trim() || !editingHabit) return;
    setHabits(habits.map(h =>
      h.id === editingHabit.id
        ? { ...h, name: editName.trim(), emoji: editEmoji || h.emoji }
        : h
    ));
    setEditingHabit(null);
    setEditName('');
    setEditEmoji('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Habits 💪</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Text style={{ fontSize: 24 }}>{theme === 'light' ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>

      {habits.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyTitle}>No habits yet</Text>
          <Text style={styles.emptySubtitle}>Tap the + button to add your first habit and start tracking your daily routine.</Text>
          <Text style={styles.emptySubtitle}>Long press on a habit to edit or delete it.</Text>
        </View>
      )}

      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, item.completed && styles.cardCompleted]}
            onPress={() => toggleHabit(item.id)}
            onLongPress={() => onLongPress(item)}
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
            placeholder="Habit name"
            placeholderTextColor={colors.placeholder}
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

      {editingHabit && (
        <View style={styles.form}>
          <Text style={styles.emojiLabel}>Edit habit</Text>
          <TextInput
            style={styles.input}
            placeholder="Habit name..."
            placeholderTextColor={colors.placeholder}
            value={editName}
            onChangeText={setEditName}
            autoFocus
          />
          <Text style={styles.emojiLabel}>Choose an emoji:</Text>
          <View style={styles.emojiGrid}>
            {EMOJI_OPTIONS.map(emoji => (
              <TouchableOpacity
                key={emoji}
                style={[styles.emojiOption, editEmoji === emoji && styles.emojiSelected]}
                onPress={() => setEditEmoji(emoji)}
              >
                <Text style={styles.emojiOptionText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.btnConfirm} onPress={confirmEdit}>
            <Text style={styles.btnConfirmText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCancel}
            onPress={() => setEditingHabit(null)}
          >
            <Text style={styles.btnCancelText}>Cancel</Text>
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