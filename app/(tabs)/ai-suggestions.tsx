import React, { useMemo, useRef } from 'react';
import { Animated, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorPalette } from '../../constants/colors';

type InsightSeverity = 'high' | 'medium' | 'positive';
type RecommendationPriority = 'High' | 'Medium' | 'Low';

type SnapshotMetric = {
  id: string;
  label: string;
  value: string;
  delta: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type TopAction = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

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
    description:
      'Your head has been positioned forward for extended periods. Consider taking a break.',
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
    suggestion: 'Stand up and do some shoulder rolls to reset your posture.',
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

const TODAY_ACTIONS: TopAction[] = [
  {
    id: 'monitor',
    icon: 'desktop-outline',
    title: 'Raise your monitor by 5 cm',
    description: 'Aligns gaze at eye level to ease cervical pressure.',
  },
  {
    id: 'breaks',
    icon: 'alarm-outline',
    title: 'Schedule micro-breaks',
    description: 'Set a 45 min cadence to keep circulation flowing.',
  },
  {
    id: 'mobility',
    icon: 'body-outline',
    title: '2-minute thoracic opener',
    description: 'Restore upper-back mobility before the afternoon slump.',
  },
];

const SNAPSHOT_METRICS: SnapshotMetric[] = [
  {
    id: 'alignment',
    label: 'Alignment',
    value: '82%',
    delta: '+6% vs last week',
    icon: 'analytics-outline',
  },
  {
    id: 'strain',
    label: 'Neck strain',
    value: 'Low',
    delta: '-18% tension',
    icon: 'body-outline',
  },
  {
    id: 'breaks',
    label: 'Session',
    value: '5 / 6',
    delta: '1 remaining',
    icon: 'time-outline',
  },
];

export default function AISuggestionPage() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const statusBarStyle = theme === 'dark' ? 'light-content' : 'dark-content';
  const snapshotMetrics = useMemo(() => SNAPSHOT_METRICS, []);
  const topActions = useMemo(() => TODAY_ACTIONS, []);

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
          <Text style={styles.pageSubtitle}>Your personalized posture intelligence hub</Text>
        </View>

        {/* <LinearGradient
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
                Continuously learning from your daily posture signals
              </Text>
            </View>
            <View style={styles.aiStatusIndicator}>
              <View style={styles.aiStatusDot} />
            </View>
          </View>
        </LinearGradient> */}

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Today's Top Actions</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.sectionAction}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.topActionsList}>
            {topActions.map((action) => (
              <TouchableOpacity key={action.id} style={styles.topActionCard}>
                <View style={styles.topActionIcon}>
                  <Ionicons name={action.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.topActionText}>
                  <Text style={styles.topActionTitle}>{action.title}</Text>
                  <Text style={styles.topActionDescription}>{action.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insight Snapshot</Text>

          <View style={styles.snapshotRow}>
            {snapshotMetrics.map((metric) => (
              <View key={metric.id} style={styles.snapshotCard}>
                <View style={styles.snapshotHeader}>
                  <Ionicons name={metric.icon} size={18} color={colors.accent} />
                  <Text style={styles.snapshotLabel}>{metric.label}</Text>
                </View>
                <Text style={styles.snapshotValue}>{metric.value}</Text>
                <Text style={styles.snapshotDelta}>{metric.delta}</Text>
              </View>
            ))}
          </View>
        </View>

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

              <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
                <Ionicons name="arrow-forward" size={20} color={colors.white} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>3D Pain Map</Text>

          <View style={styles.painCard}>
            <View style={styles.painHeader}>
              <View style={styles.painBadge}>
                <Text style={styles.painBadgeText}>Coming Soon</Text>
              </View>
              <Ionicons name="cube-outline" size={32} color={colors.accent} />
            </View>

            <Text style={styles.painTitle}>Interactive 3D Body Map</Text>
            <Text style={styles.painDescription}>
              Visualize discomfort zones in real-time. Our 3D model will highlight stress points and
              suggest targeted relief routines.
            </Text>

            <View style={styles.painPreview}>
              <View style={[styles.painGridLine, styles.painGridLineVertical]} />
              <View style={[styles.painGridLine, styles.painGridLineHorizontal]} />
              <Ionicons name="body-outline" size={80} color={`${colors.accent}88`} />
              <View style={[styles.painMarker, { top: '25%', left: '58%' }]} />
              <View style={[styles.painMarker, { top: '55%', left: '42%' }]} />
              <Text style={styles.painPreviewText}>3D pain visualization loading soon...</Text>
            </View>

            <TouchableOpacity style={styles.painActionButton} onPress={() => {}}>
              <Ionicons name="notifications-outline" size={18} color={colors.white} />
              <Text style={styles.painActionText}>Notify me when ready</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* <View style={styles.learningCard}>
          <Ionicons name="school-outline" size={48} color={colors.secondary} />
          <Text style={styles.learningTitle}>AI is Learning Your Patterns</Text>
          <Text style={styles.learningText}>
            The more you use NimirUp, the better our AI becomes at providing personalized insights and
            recommendations tailored to your unique posture habits.
          </Text>
        </View> */}

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
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionAction: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.accent,
    },
    topActionsList: {
      gap: 12,
    },
    topActionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderRadius: 16,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.light + '50',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 5,
      gap: 12,
    },
    topActionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.accent + '30',
      justifyContent: 'center',
      alignItems: 'center',
    },
    topActionText: {
      flex: 1,
      gap: 4,
    },
    topActionTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.primary,
    },
    topActionDescription: {
      fontSize: 13,
      color: colors.secondary,
      opacity: 0.85,
    },
    snapshotRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    snapshotCard: {
      flex: 1,
      padding: 14,
      borderRadius: 14,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.light + '60',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 6,
      gap: 6,
    },
    snapshotHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    snapshotLabel: {
      fontSize: 13,
      color: colors.secondary,
      fontWeight: '500',
    },
    snapshotValue: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.primary,
    },
    snapshotDelta: {
      fontSize: 12,
      color: colors.accent,
      fontWeight: '600',
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
    painCard: {
      backgroundColor: colors.light,
      borderRadius: 18,
      padding: 20,
      gap: 16,
      borderWidth: 1,
      borderColor: `${colors.secondary}22`,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 6,
    },
    painHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    painBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 14,
      backgroundColor: `${colors.accent}15`,
    },
    painBadgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.accent,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    painTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.primary,
    },
    painDescription: {
      fontSize: 13,
      color: colors.secondary,
      opacity: 0.85,
      lineHeight: 20,
    },
    painPreview: {
      height: 180,
      borderRadius: 16,
      backgroundColor: `${colors.secondary}10`,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
    },
    painGridLine: {
      position: 'absolute',
      backgroundColor: `${colors.accent}22`,
    },
    painGridLineVertical: {
      width: 1,
      height: '100%',
      left: '50%',
      marginLeft: -0.5,
    },
    painGridLineHorizontal: {
      height: 1,
      width: '100%',
      top: '50%',
      marginTop: -0.5,
    },
    painMarker: {
      position: 'absolute',
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: `${colors.accent}CC`,
      borderWidth: 2,
      borderColor: colors.white,
    },
    painPreviewText: {
      position: 'absolute',
      bottom: 12,
      textAlign: 'center',
      fontSize: 12,
      color: colors.secondary,
      opacity: 0.8,
      paddingHorizontal: 12,
    },
    painActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      borderRadius: 14,
      backgroundColor: colors.accent,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 6,
    },
    painActionText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.white,
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