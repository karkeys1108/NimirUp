import React, { useMemo, useRef } from 'react';
import { Animated, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorPalette } from '../../constants/colors';

type HistoryEntry = {
  id: number;
  date: string;
  sessions: number;
  duration: string;
  improvement: string;
  status: 'excellent' | 'good' | 'average';
};

const HISTORY_DATA: HistoryEntry[] = [
  {
    id: 1,
    date: 'Today',
    sessions: 3,
    duration: '2h 45m',
    improvement: '+12%',
    status: 'excellent',
  },
  {
    id: 2,
    date: 'Yesterday',
    sessions: 2,
    duration: '1h 30m',
    improvement: '+8%',
    status: 'good',
  },
  {
    id: 3,
    date: '2 days ago',
    sessions: 4,
    duration: '3h 15m',
    improvement: '+15%',
    status: 'excellent',
  },
];

export default function HistoryPage() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const statusBarStyle = theme === 'dark' ? 'light-content' : 'dark-content';

  const getStatusColor = (status: HistoryEntry['status']) => {
    switch (status) {
      case 'excellent':
        return colors.accent;
      case 'good':
        return '#45b7d1';
      case 'average':
        return '#f4a259';
      default:
        return colors.secondary;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.white} hidden />

      <Header scrollY={scrollY} />

      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Posture History</Text>
          <Text style={styles.pageSubtitle}>Track your progress over time</Text>
        </View>

        {HISTORY_DATA.map((item) => (
          <TouchableOpacity key={item.id} style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>{item.date}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(item.status)}22` },
                ]}
              >
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={20} color={colors.secondary} />
                <Text style={styles.statLabel}>Duration</Text>
                <Text style={styles.statValue}>{item.duration}</Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons name="refresh-outline" size={20} color={colors.secondary} />
                <Text style={styles.statLabel}>Sessions</Text>
                <Text style={styles.statValue}>{item.sessions}</Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons name="trending-up-outline" size={20} color={colors.accent} />
                <Text style={styles.statLabel}>Improvement</Text>
                <Text style={[styles.statValue, { color: colors.accent }]}>{item.improvement}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.comingSoonCard}>
          <Ionicons name="analytics-outline" size={48} color={colors.secondary} />
          <Text style={styles.comingSoonTitle}>Detailed Analytics</Text>
          <Text style={styles.comingSoonText}>
            Comprehensive reports and insights coming soon!
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 92,
      paddingBottom: 100,
      gap: 16,
    },
    pageHeader: {
      gap: 6,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.primary,
    },
    pageSubtitle: {
      fontSize: 14,
      color: colors.secondary,
      opacity: 0.85,
    },
    historyCard: {
      backgroundColor: colors.light,
      borderRadius: 16,
      padding: 20,
      gap: 16,
      borderWidth: 1,
      borderColor: `${colors.secondary}22`,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statItem: {
      alignItems: 'center',
      gap: 6,
      flex: 1,
    },
    statLabel: {
      fontSize: 12,
      color: colors.secondary,
      opacity: 0.8,
    },
    statValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
    comingSoonCard: {
      alignItems: 'center',
      gap: 12,
      padding: 32,
      backgroundColor: `${colors.secondary}15`,
      borderRadius: 18,
      marginTop: 8,
      marginBottom: 40,
    },
    comingSoonTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.primary,
    },
    comingSoonText: {
      fontSize: 14,
      color: colors.secondary,
      opacity: 0.85,
      textAlign: 'center',
      lineHeight: 22,
    },
  });