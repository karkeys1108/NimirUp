import React, { useMemo, useRef } from 'react';
import { Animated, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorPalette } from '../../constants/colors';

type InsightSeverity = 'high' | 'medium' | 'positive';
type RecommendationPriority = 'High' | 'Medium' | 'Low';

type Insight = {
  id: number;
  type: string;
  title: string;
  severity: InsightSeverity;
  time: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  suggestion: string;
};

type Recommendation = {
  id: number;
  title: string;
  priority: RecommendationPriority;
  impact: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const AI_INSIGHTS: Insight[] = [
  {
    id: 1,
    type: 'Alert',
    title: 'Forward Head Posture Detected',
    severity: 'high',
    time: '2 hours ago',
    icon: 'warning-outline',
    description: 'Your head has been positioned forward for extended periods. Consider taking a break.',
    suggestion: 'Try the neck stretch exercise for 5 minutes.',
  },
  {
    id: 2,
    type: 'Improvement',
    title: 'Posture Score Increased',
    severity: 'positive',
    time: '5 hours ago',
    icon: 'trending-up-outline',
    description: 'Your average posture score improved by 15% this week!',
    suggestion: 'Keep up the good work with your exercise routine.',
  },
  {
    id: 3,
    type: 'Reminder',
    title: 'Movement Break Due',
    severity: 'medium',
    time: '6 hours ago',
    icon: 'time-outline',
    description: "You've been sitting for 2 hours without a break.",
    suggestion: 'Stand up and do some shoulder rolls.',
  },
];

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    title: 'Adjust Your Monitor Height',
    priority: 'High',
    impact: 'Reduces neck strain by 40%',
    icon: 'desktop-outline',
    color: '#ff6b6b',
  },
  {
    id: 2,
    title: 'Take Micro-breaks',
    priority: 'Medium',
    impact: 'Improves circulation',
    icon: 'refresh-outline',
    color: '#f4a259',
  },
  {
    id: 3,
    title: 'Strengthen Core Muscles',
    priority: 'Medium',
    impact: 'Better spinal support',
    icon: 'fitness-outline',
    color: '#45b7d1',
  },
];

export default function AISuggestionPage() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const statusBarStyle = theme === 'dark' ? 'light-content' : 'dark-content';

  const getSeverityColor = (severity: InsightSeverity) => {
    switch (severity) {
      case 'high':
        return '#ff6b6b';
      case 'medium':
        return '#f4a259';
      case 'positive':
        return colors.accent;
      default:
        return colors.secondary;
    }
  };

  const getPriorityColor = (priority: RecommendationPriority) => {
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
          <Text style={styles.pageTitle}>AI Insights</Text>
          <Text style={styles.pageSubtitle}>Personalized recommendations powered by AI</Text>
        </View>

        <LinearGradient
          colors={[colors.accent, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.aiStatusCard}
        >
          <View style={styles.aiStatusContent}>
            <Ionicons name="bulb-outline" size={32} color={colors.white} />
            <View style={styles.aiStatusText}>
              <Text style={styles.aiStatusTitle}>AI Analysis Active</Text>
              <Text style={styles.aiStatusDescription}>
                Continuously monitoring your posture patterns
              </Text>
            </View>
            <View style={styles.aiStatusIndicator}>
              <View style={styles.aiStatusDot} />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Insights</Text>

          {AI_INSIGHTS.map((insight) => (
            <TouchableOpacity key={insight.id} style={styles.insightCard}>
              <View
                style={[
                  styles.insightIcon,
                  { backgroundColor: `${getSeverityColor(insight.severity)}22` },
                ]}
              >
                <Ionicons name={insight.icon} size={20} color={getSeverityColor(insight.severity)} />
              </View>

              <View style={styles.insightContent}>
                <View style={styles.insightHeader}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightTime}>{insight.time}</Text>
                </View>

                <Text style={styles.insightDescription}>{insight.description}</Text>

                <View style={styles.suggestionContainer}>
                  <Ionicons name="bulb-outline" size={14} color={colors.accent} />
                  <Text style={styles.suggestionText}>{insight.suggestion}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Recommendations</Text>

          {RECOMMENDATIONS.map((rec) => (
            <TouchableOpacity key={rec.id} style={styles.recommendationCard}>
              <View style={[styles.recommendationIcon, { backgroundColor: `${rec.color}22` }]}>
                <Ionicons name={rec.icon} size={24} color={rec.color} />
              </View>

              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>{rec.title}</Text>
                <Text style={styles.recommendationImpact}>{rec.impact}</Text>

                <View style={styles.priorityContainer}>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: `${getPriorityColor(rec.priority)}22` },
                    ]}
                  >
                    <Text style={[styles.priorityText, { color: getPriorityColor(rec.priority) }]}>
                      {rec.priority} Priority
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="arrow-forward" size={20} color={colors.white} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.learningCard}>
          <Ionicons name="school-outline" size={48} color={colors.secondary} />
          <Text style={styles.learningTitle}>AI is Learning Your Patterns</Text>
          <Text style={styles.learningText}>
            The more you use NimirUp, the better our AI becomes at providing personalized insights and
            recommendations tailored to your unique posture habits.
          </Text>

          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Learning Progress</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '68%' }]} />
            </View>
            <Text style={styles.progressText}>68% Complete</Text>
          </View>
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
    aiStatusCard: {
      borderRadius: 18,
      padding: 20,
      gap: 12,
    },
    aiStatusContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    aiStatusText: {
      flex: 1,
      gap: 4,
    },
    aiStatusTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.white,
    },
    aiStatusDescription: {
      fontSize: 14,
      color: colors.white,
      opacity: 0.9,
    },
    aiStatusIndicator: {
      marginLeft: 8,
    },
    aiStatusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.white,
      opacity: 0.8,
    },
    section: {
      gap: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
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
    learningCard: {
      alignItems: 'center',
      gap: 16,
      padding: 28,
      backgroundColor: `${colors.secondary}15`,
      borderRadius: 18,
    },
    learningTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.primary,
      textAlign: 'center',
    },
    learningText: {
      fontSize: 14,
      color: colors.secondary,
      opacity: 0.85,
      textAlign: 'center',
      lineHeight: 22,
    },
    progressContainer: {
      width: '100%',
      gap: 6,
      alignItems: 'center',
    },
    progressLabel: {
      fontSize: 12,
      color: colors.secondary,
      opacity: 0.8,
    },
    progressBar: {
      width: '100%',
      height: 6,
      backgroundColor: `${colors.secondary}22`,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.accent,
      borderRadius: 3,
    },
    progressText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.accent,
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