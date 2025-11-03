import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorPalette } from '../../constants/colors';

type Metric = {
  id: string;
  label: string;
  value: string;
  delta: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type QuickAction = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

type PosturePoint = {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'assessment',
    icon: 'walk-outline',
    title: 'Todays top actions',
    description: 'Actionable tips for you',
  },
  {
    id: 'coach',
    icon: 'chatbubble-ellipses-outline',
    title: 'Recommendations',
    description: 'AI based recommendations',
  },
];

export default function HomePage() {
  const { colors, theme } = useTheme();
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(colors), [colors]);

  const snapshotMetrics = useMemo<Metric[]>(
    () => [
      { id: 'alignment', label: 'Alignment', value: '82%', delta: '+8%', icon: 'body' },
      { id: 'sessions', label: 'Sessions', value: '3 today', delta: '+1', icon: 'pulse-outline' },
      { id: 'streak', label: 'Streak', value: '5 days', delta: 'On track', icon: 'flame-outline' },
    ],
    []
  );

  const posturePoints = useMemo<PosturePoint[]>(
    () => [
      {
        id: 1,
        title: 'Open your chest',
        description: 'Roll shoulders back and down to prevent slouching.',
        icon: 'expand-outline',
        color: colors.accent,
      },
      {
        id: 2,
        title: 'Engage your core',
        description: 'Lightly brace your core to stabilise your spine.',
        icon: 'fitness-outline',
        color: '#F7DC6F',
      },
      {
        id: 3,
        title: 'Ground through feet',
        description: 'Keep weight evenly distributed for balanced posture.',
        icon: 'footsteps-outline',
        color: '#9AD9F0',
      },
    ],
    [colors.accent]
  );

  const routineProgress = 0.68;
  const progressPercent = useMemo(() => Math.round(routineProgress * 100), [routineProgress]);
  const progressWidth = `${progressPercent}%` as const;

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      setIsStatusBarVisible((prev) => !prev);
    }
    setLastTap(now);
  };

  const statusBarStyle = theme === 'dark' ? 'light-content' : 'dark-content';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={colors.white}
        hidden={!isStatusBarVisible}
        animated
      />

      <Header scrollY={scrollY} />

      <Pressable style={styles.tapLayer} onPress={handleDoubleTap}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
        >
          <View style={styles.hintChip}>
            <Ionicons name="hand-left-outline" size={14} color={colors.secondary} />
            <Text style={styles.hintText}>Double tap anywhere to toggle the status bar</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today&apos;s Snapshot</Text>
            <View style={styles.metricsRow}>
              {snapshotMetrics.map((metric) => (
                <View key={metric.id} style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <Ionicons name={metric.icon} size={18} color={colors.accent} />
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                  </View>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <Text style={styles.metricDelta}>{metric.delta}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.routineCard}
            >
              <View style={styles.routineHeader}>
                <View style={styles.routineBadge}>
                  <Ionicons name="barbell-outline" size={18} color={colors.primary} />
                </View>
                <Text style={styles.routineTitle}>Active Routine</Text>
              </View>
              <Text style={styles.routineSubtitle}>Mobility &amp; Core Reset</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: progressWidth }]} />
              </View>
              <Text style={styles.progressLabel}>{progressPercent}% complete</Text>
            </LinearGradient>
          </View>


          <View style={styles.section}>
            <View style={styles.comingSoonCard}>
              <Ionicons name="cube-outline" size={36} color={colors.secondary} />
              <Text style={styles.comingSoonTitle}>Upcoming 3D Modal</Text>
              <Text style={styles.comingSoonDescription}>
                We&apos;re building an immersive posture visualiser for clear insights.
              </Text>
            </View>
          </View>


          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>More</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quickActionsRow}>
              {QUICK_ACTIONS.map((action) => (
                <TouchableOpacity key={action.id} style={styles.quickActionCard}>
                  <View style={styles.quickActionIcon}>
                    <Ionicons name={action.icon} size={18} color={colors.primary} />
                  </View>
                  <View style={styles.quickActionTextWrap}>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                    <Text style={styles.quickActionDescription}>{action.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.secondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daily Posture Tips</Text>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>View all</Text>
              </TouchableOpacity>
            </View>

            <LinearGradient
              colors={[colors.white, colors.light]}
              style={styles.tipsCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {posturePoints.map((point) => (
                <View key={point.id} style={styles.tipItem}>
                  <View style={[styles.tipIcon, { backgroundColor: point.color + '1A' }]}>
                    <Ionicons name={point.icon} size={18} color={point.color} />
                  </View>
                  <View style={styles.tipText}>
                    <Text style={styles.tipTitle}>{point.title}</Text>
                    <Text style={styles.tipDescription}>{point.description}</Text>
                  </View>
                </View>
              ))}
            </LinearGradient>
          </View>

          
        </Animated.ScrollView>
      </Pressable>
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.white,
    },
    tapLayer: {
      flex: 1,
      marginBottom: 80,
    },
    scrollContent: {
      paddingTop: 68,
      paddingBottom: 40,
      paddingHorizontal: 20,
      gap: 24,
    },
    hintChip: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.light + '40',
      borderRadius: 999,
    },
    hintText: {
      fontSize: 12,
      color: colors.secondary,
    },
    section: {
      gap: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.primary,
    },
    sectionLink: {
      fontSize: 13,
      color: colors.accent,
      fontWeight: '600',
    },
    metricsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    metricCard: {
      flex: 1,
      padding: 14,
      borderRadius: 14,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.light + '60',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
      gap: 6,
    },
    metricHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    metricLabel: {
      fontSize: 13,
      color: colors.secondary,
      fontWeight: '500',
    },
    metricValue: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.primary,
    },
    metricDelta: {
      fontSize: 12,
      color: colors.accent,
      fontWeight: '600',
    },
    routineCard: {
      borderRadius: 18,
      padding: 20,
      gap: 12,
    },
    routineHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    routineBadge: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.light,
      justifyContent: 'center',
      alignItems: 'center',
    },
    routineTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.light,
    },
    routineSubtitle: {
      fontSize: 13,
      color: colors.light,
      opacity: 0.85,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.light + '30',
      borderRadius: 999,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.accent,
      borderRadius: 999,
    },
    progressLabel: {
      fontSize: 12,
      color: colors.light,
      opacity: 0.9,
    },
    quickActionsRow: {
      gap: 12,
    },
    quickActionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderRadius: 16,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.light + '50',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 5,
      gap: 12,
    },
    quickActionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.accent + '40',
      justifyContent: 'center',
      alignItems: 'center',
    },
    quickActionTextWrap: {
      flex: 1,
      gap: 4,
    },
    quickActionTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.primary,
    },
    quickActionDescription: {
      fontSize: 12,
      color: colors.secondary,
      opacity: 0.85,
    },
    tipsCard: {
      padding: 18,
      borderRadius: 18,
      gap: 16,
      borderWidth: 1,
      borderColor: colors.light + '60',
      backgroundColor: colors.white,
    },
    tipItem: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'flex-start',
    },
    tipIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tipText: {
      flex: 1,
      gap: 2,
    },
    tipTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.primary,
    },
    tipDescription: {
      fontSize: 12,
      color: colors.secondary,
      lineHeight: 18,
    },
    comingSoonCard: {
      alignItems: 'center',
      gap: 12,
      padding: 28,
      borderRadius: 20,
      backgroundColor: colors.light + '30',
      borderWidth: 1,
      borderColor: colors.light + '70',
    },
    comingSoonTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.primary,
    },
    comingSoonDescription: {
      fontSize: 13,
      color: colors.secondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });