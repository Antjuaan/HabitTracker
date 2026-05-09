import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { loadHistory } from '../../storage/habitStorage';
import { makeStyles } from '../../styles/exploreScreen';
import { DailyRecord } from '../../types/habit';
import { getBestDay, getDailyAverage, getLast7Days, getStreak, getTodayRecord } from '../../utils/statistics';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ExploreScreen() {
  const [history, setHistory] = useState<DailyRecord[]>([]);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  useFocusEffect(
    useCallback(() => {
      loadHistory().then(setHistory);
    }, [])
  );

  const todayRecord = getTodayRecord(history);
  const streak = getStreak(history);
  const last7Days = getLast7Days(history);
  const bestDay = getBestDay(history);
  const dailyAverage = getDailyAverage(history);

  const todayCompleted = todayRecord?.completed ?? 0;
  const todayTotal = todayRecord?.total ?? 0;
  const todayPct = todayTotal > 0 ? todayCompleted / todayTotal : 0;

  const getTodayEmoji = () => {
    if (todayTotal === 0) return '🌱';
    if (todayPct === 1) return '🏆';
    if (todayPct >= 0.5) return '💪';
    return '🎯';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Statistics 📊</Text>

      {/* Today */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.card}>
          <View style={styles.todayRow}>
            <View>
              <Text style={styles.todayCount}>{todayCompleted}/{todayTotal}</Text>
              <Text style={styles.todayLabel}>habits completed</Text>
            </View>
            <Text style={styles.todayEmoji}>{getTodayEmoji()}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${todayPct * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Streak */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Streak</Text>
        <View style={styles.card}>
          <View style={styles.streakRow}>
            <Text style={styles.streakNumber}>{streak}</Text>
            <View>
              <Text style={styles.streakLabel}>
                {streak === 1 ? 'day in a row' : 'days in a row'}
              </Text>
              <Text style={styles.streakSub}>
                {streak === 0 ? 'Complete at least one habit to start!' : 'Keep it up! 🔥'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* This week */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.card}>
          <View style={styles.weekRow}>
            {last7Days.map((record, index) => {
              const pct = record.total > 0 ? record.completed / record.total : 0;
              const barHeight = Math.max(pct * 70, record.total > 0 ? 4 : 0);
              const dayLabel = DAY_LABELS[new Date(record.date).getDay()];
              return (
                <View key={index} style={styles.weekDay}>
                  <View style={styles.weekBarBg}>
                    <View style={[styles.weekBarFill, { height: barHeight }]} />
                  </View>
                  <Text style={styles.weekDayLabel}>{dayLabel}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* All time */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Time</Text>
        <View style={styles.card}>
          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>No data yet — start completing habits!</Text>
            </View>
          ) : (
            <View style={styles.allTimeRow}>
              <View style={styles.allTimeItem}>
                <Text style={styles.allTimeValue}>{history.length}</Text>
                <Text style={styles.allTimeLabel}>days tracked</Text>
              </View>
              <View style={styles.allTimeItem}>
                <Text style={styles.allTimeValue}>{dailyAverage}</Text>
                <Text style={styles.allTimeLabel}>avg per day</Text>
              </View>
              <View style={styles.allTimeItem}>
                <Text style={styles.allTimeValue}>
                  {bestDay ? `${bestDay.completed}/${bestDay.total}` : '-'}
                </Text>
                <Text style={styles.allTimeLabel}>best day</Text>
              </View>
            </View>
          )}
        </View>
      </View>

    </ScrollView>
  );
}