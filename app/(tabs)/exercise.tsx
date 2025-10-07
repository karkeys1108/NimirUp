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
import { Header } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorPalette } from '../../constants/colors';

type Exercise = {
  id: number;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
};

export default function ExercisePage() {
  const { colors, theme } = useTheme();
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(colors), [colors]);

  const exercises = useMemo<Exercise[]>(
    () => [
      {
        id: 1,
        title: 'Neck Stretch',
        duration: '5 min',
        difficulty: 'Beginner',
        icon: 'body-outline',
        color: colors.accent,
        description: 'Gentle neck stretches to relieve tension',
      },
      {
        id: 2,
        title: 'Shoulder Rolls',
        duration: '3 min',
        difficulty: 'Beginner',
        icon: 'refresh-outline',
        color: '#4ECDC4',
        description: 'Circular shoulder movements to improve mobility',
      },
      {
        id: 3,
        title: 'Core Strengthening',
        duration: '10 min',
        difficulty: 'Intermediate',
        icon: 'fitness-outline',
        color: '#45B7D1',
        description: 'Build core strength for better posture support',
      },
      {
        id: 4,
        title: 'Spine Alignment',
        duration: '8 min',
        difficulty: 'Beginner',
        icon: 'trending-up-outline',
        color: '#F7DC6F',
        description: 'Exercises to improve spinal alignment',
      },
    ],
    [colors.accent]
  );

  const getDifficultyColor = (difficulty: Exercise['difficulty']) => {
    switch (difficulty) {
      case 'Beginner':
        return colors.accent;
      case 'Intermediate':
        return '#4ECDC4';
      case 'Advanced':
        return '#E74C3C';
      default:
        return colors.secondary;
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      setIsStatusBarVisible((prev) => !prev);
    }
    setLastTap(now);
  };

  const statusBarStyle = theme === 'dark' ? 'light-content' : 'dark-content';

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={colors.white}
        hidden={!isStatusBarVisible}
        animated
      />

      <Header scrollY={scrollY} />

      <Pressable style={styles.content} onPress={handleDoubleTap}>
        <Animated.ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
        >
          <LinearGradient
            colors={[colors.accent, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.challengeCard}
          >
            <View style={styles.challengeContent}>
              <Ionicons name="trophy-outline" size={32} color={colors.white} />
              <View style={styles.challengeText}>
                <Text style={styles.challengeTitle}>Daily Challenge</Text>
                <Text style={styles.challengeDescription}>
                  Complete 3 exercises today to maintain your streak!
                </Text>
              </View>
              <TouchableOpacity style={styles.challengeButton}>
                <Text style={styles.challengeButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.exercisesContainer}>
            <Text style={styles.sectionTitle}>Recommended Exercises</Text>

            {exercises.map((exercise) => (
              <TouchableOpacity key={exercise.id} style={styles.exerciseCard}>
                <View style={[styles.exerciseIcon, { backgroundColor: exercise.color + '20' }]}>
                  <Ionicons name={exercise.icon} size={24} color={exercise.color} />
                </View>

                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                  <Text style={styles.exerciseDescription}>{exercise.description}</Text>

                  <View style={styles.exerciseMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color={colors.secondary} />
                      <Text style={styles.metaText}>{exercise.duration}</Text>
                    </View>

                    <View
                      style={[
                        styles.difficultyBadge,
                        { backgroundColor: getDifficultyColor(exercise.difficulty) + '20' },
                      ]}
                    >
                      <Text
                        style={[styles.difficultyText, { color: getDifficultyColor(exercise.difficulty) }]}
                      >
                        {exercise.difficulty}
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.playButton}>
                  <Ionicons name="play" size={20} color={colors.white} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.comingSoonCard}>
            <Ionicons name="videocam-outline" size={48} color={colors.secondary} />
            <Text style={styles.comingSoonTitle}>Video Tutorials</Text>
            <Text style={styles.comingSoonText}>
              Step-by-step video guides and real-time form correction coming soon!
            </Text>
          </View>
        </Animated.ScrollView>
      </Pressable>
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
      marginTop: 62,
      marginBottom: 84,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      gap: 24,
    },
    challengeCard: {
      borderRadius: 18,
      padding: 20,
      gap: 16,
    },
    challengeContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    challengeText: {
      flex: 1,
      gap: 6,
    },
    challengeTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.white,
    },
    challengeDescription: {
      fontSize: 14,
      color: colors.white,
      opacity: 0.9,
    },
    challengeButton: {
      backgroundColor: colors.white,
      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: 14,
    },
    challengeButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    exercisesContainer: {
      gap: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.primary,
    },
    exerciseCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 16,
      borderRadius: 18,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.light + '50',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    exerciseIcon: {
      width: 54,
      height: 54,
      borderRadius: 27,
      justifyContent: 'center',
      alignItems: 'center',
    },
    exerciseInfo: {
      flex: 1,
      gap: 6,
    },
    exerciseTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
    exerciseDescription: {
      fontSize: 13,
      color: colors.secondary,
      opacity: 0.85,
    },
    exerciseMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    metaText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.secondary,
    },
    difficultyBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    difficultyText: {
      fontSize: 12,
      fontWeight: '600',
    },
    playButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    comingSoonCard: {
      alignItems: 'center',
      gap: 12,
      padding: 28,
      borderRadius: 20,
      backgroundColor: colors.light + '30',
      borderWidth: 1,
      borderColor: colors.light + '60',
    },
    comingSoonTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.primary,
    },
    comingSoonText: {
      fontSize: 14,
      color: colors.secondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });