import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Animated, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, OfflineIndicator } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorPalette } from '../../constants/colors';
import { apiService } from '../../services/api';
import { getAlertIcon, getAlertColor } from '../../utils/bodyPartIcons';

type Insight = {
  id: string;
  alertLevel: number; // 1-5, where 1 is most crucial
  message: string;
  timestamp: number;
  bodyPart?: string;
  description?: string;
  suggestion?: string;
};

type Recommendation = {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  impact: string;
  bodyPart?: string;
};

export default function AISuggestionPage() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [insights, setInsights] = useState<Insight[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Try to get from API
      try {
        const [insightsData, recommendationsData] = await Promise.all([
          apiService.getRecentInsights(),
          apiService.getTopRecommendations(),
        ]);
        setInsights(insightsData);
        setRecommendations(recommendationsData);
        setApiConnected(true);
      } catch (error) {
        console.error('API error, backend not connected:', error);
        // Backend not connected - show 0 for all
        setInsights([]);
        setRecommendations([]);
        setApiConnected(false);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const statusBarStyle = theme === 'dark' ? 'light-content' : 'dark-content';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return '#ff6b6b';
      case 'Medium':
        return '#f4a259';
      case 'Low':
        return colors.accent;
      default:
        return colors.secondary;
    }
  };

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
    <View style={styles.container}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.white} hidden />

      <Header scrollY={scrollY} />
      <OfflineIndicator />

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
          <Text style={styles.pageTitle}>AI Insights</Text>
          <Text style={styles.pageSubtitle}>Your personalized posture intelligence hub</Text>
        </View>

        {/* Recent Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Insights</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
          ) : !apiConnected || insights.length === 0 ? (
            <View style={styles.zeroState}>
              <Text style={styles.zeroValue}>0</Text>
              <Text style={styles.zeroLabel}>Insights</Text>
            </View>
          ) : (
            insights.map((insight) => (
              <TouchableOpacity key={insight.id} style={styles.insightCard}>
                <View
                  style={[
                    styles.insightIcon,
                    { backgroundColor: getAlertColor(insight.alertLevel) + '22' },
                  ]}
                >
                  <Ionicons
                    name={getAlertIcon(insight.alertLevel)}
                    size={20}
                    color={getAlertColor(insight.alertLevel)}
                  />
                </View>

                <View style={styles.insightContent}>
                  <View style={styles.insightHeader}>
                    <Text style={styles.insightTitle}>{insight.message}</Text>
                    <Text style={styles.insightTime}>{formatTime(insight.timestamp)}</Text>
                  </View>

                  {insight.description && (
                    <Text style={styles.insightDescription}>{insight.description}</Text>
                  )}

                  {insight.suggestion && (
                    <View style={styles.suggestionContainer}>
                      <Ionicons name="bulb-outline" size={14} color={colors.accent} />
                      <Text style={styles.suggestionText}>{insight.suggestion}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Personalized Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Recommendations</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
          ) : !apiConnected || recommendations.length === 0 ? (
            <View style={styles.zeroState}>
              <Text style={styles.zeroValue}>0</Text>
              <Text style={styles.zeroLabel}>Recommendations</Text>
            </View>
          ) : (
            recommendations.map((rec) => (
              <TouchableOpacity key={rec.id} style={styles.recommendationCard}>
                <View
                  style={[
                    styles.recommendationIcon,
                    { backgroundColor: getPriorityColor(rec.priority) + '22' },
                  ]}
                >
                  <Ionicons
                    name="bulb-outline"
                    size={24}
                    color={getPriorityColor(rec.priority)}
                  />
                </View>

                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>{rec.title}</Text>
                  <Text style={styles.recommendationImpact}>{rec.impact}</Text>

                  <View style={styles.priorityContainer}>
                    <View
                      style={[
                        styles.priorityBadge,
                        { backgroundColor: getPriorityColor(rec.priority) + '22' },
                      ]}
                    >
                      <Text
                        style={[styles.priorityText, { color: getPriorityColor(rec.priority) }]}
                      >
                        {rec.priority} Priority
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
                  <Ionicons name="arrow-forward" size={20} color={colors.white} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.comingSoonCard}>
          <Ionicons name="rocket-outline" size={48} color={colors.secondary} />
          <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Predictive posture analysis</Text>
            <Text style={styles.featureItem}>• Custom exercise generation</Text>
            <Text style={styles.featureItem}>• Voice-activated coaching</Text>
            <Text style={styles.featureItem}>• Integration with health apps</Text>
          </View>
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
      paddingBottom: 100,
      paddingTop: 92,
      gap: 24,
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
    section: {
      gap: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
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
      padding: 40,
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
    insightCard: {
      flexDirection: 'row',
      backgroundColor: colors.light,
      borderRadius: 14,
      padding: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: `${colors.secondary}22`,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    insightIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    insightContent: {
      flex: 1,
      gap: 8,
    },
    insightHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    insightTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.primary,
      flex: 1,
      marginRight: 12,
    },
    insightTime: {
      fontSize: 11,
      color: colors.secondary,
      opacity: 0.7,
    },
    insightDescription: {
      fontSize: 13,
      color: colors.secondary,
      opacity: 0.85,
    },
    suggestionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: `${colors.accent}1A`,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
    },
    suggestionText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.accent,
      flex: 1,
    },
    recommendationCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.light,
      borderRadius: 14,
      padding: 16,
      gap: 16,
      borderWidth: 1,
      borderColor: `${colors.secondary}22`,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    recommendationIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    recommendationContent: {
      flex: 1,
      gap: 6,
    },
    recommendationTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
    recommendationImpact: {
      fontSize: 13,
      color: colors.secondary,
      opacity: 0.85,
    },
    priorityContainer: {
      flexDirection: 'row',
    },
    priorityBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    priorityText: {
      fontSize: 11,
      fontWeight: '600',
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    comingSoonCard: {
      alignItems: 'center',
      gap: 16,
      padding: 32,
      backgroundColor: `${colors.secondary}15`,
      borderRadius: 18,
      marginBottom: 40,
    },
    comingSoonTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.primary,
    },
    featureList: {
      width: '100%',
      gap: 8,
    },
    featureItem: {
      fontSize: 14,
      color: colors.secondary,
      opacity: 0.85,
    },
  });
