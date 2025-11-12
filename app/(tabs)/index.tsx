import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Header, OfflineIndicator } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorPalette } from '../../constants/colors';
import { apiService } from '../../services/api';
import { getAlertIcon, getAlertColor } from '../../utils/bodyPartIcons';
import { useBluetoothData } from '../../contexts/BluetoothDataContext';

type Insight = {
  id: string;
  alertLevel: number; // 1-5, where 1 is most crucial
  message: string;
  timestamp: number;
  bodyPart?: string;
};

type Exercise = {
  id: string;
  title: string;
  bodyPart: string;
  duration?: string;
};

export default function HomePage() {
  const { colors, theme } = useTheme();
  const router = useRouter();
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  const [insights, setInsights] = useState<Insight[]>([]);
  const [topExercises, setTopExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);
  const { entries } = useBluetoothData();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Try to get from API
      try {
        const [insightsData, exercisesData] = await Promise.all([
          apiService.getRecentInsights(),
          apiService.getTopExercises(),
        ]);
        setInsights(insightsData.slice(0, 4)); // Show top 4 insights
        setTopExercises(exercisesData);
        setApiConnected(true);
      } catch (error) {
        console.error('API error, backend not connected:', error);
        // Backend not connected - show 0 for all
        setInsights([]);
        setTopExercises([]);
        setApiConnected(false);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      setIsStatusBarVisible((prev) => !prev);
    }
    setLastTap(now);
  };

  const handleQuickActionPress = (actionId: string) => {
    if (actionId === 'recommendations') {
      router.push('/(tabs)/ai-suggestions');
    } else if (actionId === 'exercises') {
      router.push('/(tabs)/exercise');
    }
  };

  const statusBarStyle = theme === 'dark' ? 'light-content' : 'dark-content';

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={colors.white}
        hidden={!isStatusBarVisible}
        animated
      />

      <Header scrollY={scrollY} />
      <OfflineIndicator />

      <Pressable style={styles.tapLayer} onPress={handleDoubleTap}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
        >
          {/* 3D Modal Coming Soon */}
          <View style={styles.section}>
            <View style={styles.comingSoonCard}>
              <Ionicons name="cube-outline" size={36} color={colors.secondary} />
              <Text style={styles.comingSoonTitle}>Upcoming 3D Modal</Text>
              <Text style={styles.comingSoonDescription}>
                We&apos;re building an immersive posture visualiser for clear insights.
              </Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => handleQuickActionPress('exercises')}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name="barbell-outline" size={18} color={colors.primary} />
                </View>
                <View style={styles.quickActionTextWrap}>
                  <Text style={styles.quickActionTitle}>Today&apos;s Top Actions</Text>
                  <Text style={styles.quickActionDescription}>Recommended exercises</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.secondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => handleQuickActionPress('recommendations')}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name="bulb-outline" size={18} color={colors.primary} />
                </View>
                <View style={styles.quickActionTextWrap}>
                  <Text style={styles.quickActionTitle}>Recommendations</Text>
                  <Text style={styles.quickActionDescription}>AI based recommendations</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Insights with Alert Icons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Insights</Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.accent} />
              </View>
            ) : !apiConnected ? (
              <View style={styles.zeroState}>
                <Text style={styles.zeroValue}>0</Text>
                <Text style={styles.zeroLabel}>Insights</Text>
              </View>
            ) : insights.length > 0 ? (
              <View style={styles.insightsTable}>
                {insights.map((insight) => (
                  <View key={insight.id} style={styles.insightRow}>
                    <View
                      style={[
                        styles.alertIconContainer,
                        { backgroundColor: getAlertColor(insight.alertLevel) + '20' },
                      ]}
                    >
                      <Ionicons
                        name={getAlertIcon(insight.alertLevel)}
                        size={20}
                        color={getAlertColor(insight.alertLevel)}
                      />
                    </View>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightMessage}>{insight.message}</Text>
                      <Text style={styles.insightTime}>{formatTime(insight.timestamp)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.zeroState}>
                <Text style={styles.zeroValue}>0</Text>
                <Text style={styles.zeroLabel}>Insights</Text>
              </View>
            )}
          </View>

          {/* Top Exercises */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Exercises</Text>
            {!apiConnected || topExercises.length === 0 ? (
              <View style={styles.zeroState}>
                <Text style={styles.zeroValue}>0</Text>
                <Text style={styles.zeroLabel}>Exercises</Text>
              </View>
            ) : (
              <View style={styles.exercisesList}>
                {topExercises.slice(0, 4).map((exercise) => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={styles.exerciseCard}
                    onPress={() => router.push('/(tabs)/exercise')}
                  >
                    <View style={styles.exerciseIcon}>
                      <Ionicons name="barbell-outline" size={18} color={colors.accent} />
                    </View>
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                      {exercise.duration && (
                        <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.secondary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* BLE Data Status */}
          <View style={styles.section}>
            <View style={styles.bleStatusCard}>
              <Ionicons name="bluetooth" size={20} color={colors.accent} />
              <Text style={styles.bleStatusText}>
                {entries.length > 0 ? `${entries.length} BLE data points collected` : '0 BLE data points'}
              </Text>
            </View>
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
    section: {
      gap: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.primary,
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
    insightsTable: {
      gap: 12,
    },
    insightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.light + '40',
      borderWidth: 1,
      borderColor: colors.light + '60',
      gap: 12,
    },
    alertIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    insightContent: {
      flex: 1,
      gap: 4,
    },
    insightMessage: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.primary,
    },
    insightTime: {
      fontSize: 12,
      color: colors.secondary,
      opacity: 0.7,
    },
    loadingContainer: {
      padding: 20,
      alignItems: 'center',
    },
    emptyState: {
      padding: 32,
      alignItems: 'center',
      gap: 8,
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.secondary,
      opacity: 0.7,
    },
    zeroState: {
      padding: 32,
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.light + '40',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.light + '60',
    },
    zeroValue: {
      fontSize: 48,
      fontWeight: '700',
      color: colors.secondary,
      opacity: 0.5,
    },
    zeroLabel: {
      fontSize: 14,
      color: colors.secondary,
      opacity: 0.7,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    exercisesList: {
      gap: 12,
    },
    exerciseCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.light + '50',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      gap: 12,
    },
    exerciseIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.accent + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    exerciseInfo: {
      flex: 1,
      gap: 4,
    },
    exerciseTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    exerciseDuration: {
      fontSize: 12,
      color: colors.secondary,
      opacity: 0.7,
    },
    bleStatusCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.accent + '15',
      borderWidth: 1,
      borderColor: colors.accent + '30',
      gap: 8,
    },
    bleStatusText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '500',
    },
  });
