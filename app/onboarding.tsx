import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { EMOJI_OPTIONS } from '../constants/habits';
import { useTheme } from '../context/ThemeContext';
import { completeOnboarding, loadHabits, saveHabits } from '../storage/habitStorage';
import { makeStyles } from '../styles/onboarding';
import { Habit } from '../types/habit';

const TOTAL_STEPS = 4;

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [habitName, setHabitName] = useState('');
  const [habitEmoji, setHabitEmoji] = useState('');
  const translateX = useSharedValue(0);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const goNext = async () => {
    if (step === 2 && habitName.trim()) {
      const existing = await loadHabits();
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: habitName.trim(),
        emoji: habitEmoji || '⭐',
        completed: false,
      };
      await saveHabits([...existing, newHabit]);
    }

    if (step === TOTAL_STEPS - 1) {
      await completeOnboarding();
      router.replace('/(tabs)');
      return;
    }

    translateX.value = withTiming(-400, { duration: 200 }, () => {
      translateX.value = 400;
      runOnJS(setStep)(step + 1);
      translateX.value = withSpring(0, { damping: 15, stiffness: 120, mass: 0.5 });
    });
  };

  const skip = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Progress dots */}
      <View style={styles.progressBar}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              { width: i === step ? 24 : 8 },
              i === step && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      <Animated.View style={[styles.slide, animatedStyle]}>
        {/* Step 0 — Welcome */}
        {step === 0 && (
          <View style={styles.content}>
            <Text style={styles.emoji}>💪</Text>
            <Text style={styles.title}>Welcome to{'\n'}DailyDo</Text>
            <Text style={styles.subtitle}>
              Build better habits, one day at a time. Track your daily routines and watch yourself grow.
            </Text>
          </View>
        )}

        {/* Step 1 — How it works */}
        {step === 1 && (
          <View style={styles.content}>
            <Text style={[styles.title, { marginBottom: 8 }]}>How it works</Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>✅</Text>
                <View style={{ flex: 1, flexShrink: 1 }}>
                  <Text style={styles.featureTitle}>Check daily</Text>
                  <Text style={styles.featureText}>Tap a habit to mark it as completed.</Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>🔄</Text>
                <View style={{ flex: 1, flexShrink: 1 }}>
                  <Text style={styles.featureTitle}>Auto reset</Text>
                  <Text style={styles.featureText}>Habits reset every day at midnight.</Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>📊</Text>
                <View style={{ flex: 1, flexShrink: 1 }}>
                  <Text style={styles.featureTitle}>Track progress</Text>
                  <Text style={styles.featureText}>View your streak and weekly stats.</Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureEmoji}>✏️</Text>
                <View style={{ flex: 1, flexShrink: 1 }}>
                  <Text style={styles.featureTitle}>Edit or delete</Text>
                  <Text style={styles.featureText}>Long press a habit to edit or delete it.</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Step 2 — Add first habit */}
        {step === 2 && (
          <View style={styles.content}>
            <Text style={styles.emoji}>🌱</Text>
            <Text style={styles.title}>Add your first habit</Text>
            <Text style={[styles.subtitle, { marginBottom: 24 }]}>
              Start with something small and achievable. You can always add more later.
            </Text>
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Drink 2L of water"
                placeholderTextColor={colors.placeholder}
                value={habitName}
                onChangeText={setHabitName}
                autoFocus
              />
              <Text style={styles.emojiLabel}>Choose an emoji:</Text>
              <View style={styles.emojiGrid}>
                {EMOJI_OPTIONS.map(emoji => (
                  <TouchableOpacity
                    key={emoji}
                    style={[styles.emojiOption, habitEmoji === emoji && styles.emojiSelected]}
                    onPress={() => setHabitEmoji(emoji)}
                  >
                    <Text style={styles.emojiOptionText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Step 3 — All set */}
        {step === 3 && (
          <View style={styles.content}>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.title}>You're all set!</Text>
            <Text style={styles.subtitle}>
              Your journey starts today. Stay consistent, track your progress, and build the habits that will change your life.
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btnNext, step === 2 && !habitName.trim() && { opacity: 0.5 }]}
            onPress={goNext}
            disabled={step === 2 && !habitName.trim()}
          >
            <Text style={styles.btnNextText}>
              {step === TOTAL_STEPS - 1 ? "Let's go! 🚀" : 'Next →'}
            </Text>
          </TouchableOpacity>
          {step < TOTAL_STEPS - 1 && (
            <TouchableOpacity style={styles.btnSkip} onPress={skip}>
              <Text style={styles.btnSkipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
}