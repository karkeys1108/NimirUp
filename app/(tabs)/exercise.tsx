import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, OfflineIndicator } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorPalette } from '../../constants/colors';
import { apiService } from '../../services/api';
import { getBodyPartIcon } from '../../utils/bodyPartIcons';

type Exercise = {
  id: string;
  title: string;
  bodyPart: string;
  duration?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  description?: string;
};

export default function ExercisePage() {
  const { colors, theme } = useTheme();
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setLoading(true);
      
      // Try to get from API
      try {
        const exercisesData = await apiService.getExercises();
        setExercises(exercisesData);
        setApiConnected(true);
      } catch (error) {
        console.error('API error, backend not connected:', error);
        // Backend not connected - show 0 for all
        setExercises([]);
        setApiConnected(false);
      }
    } catch (error) {
      console.error('Error loading exercises:', error);
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
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

  const getBodyPartColor = (bodyPart: string) => {
    // Generate a color based on body part
    const colors_map: Record<string, string> = {
      neck: colors.accent,
      shoulder: '#4ECDC4',
      shoulders: '#4ECDC4',
      back: '#45B7D1',
      spine: '#F7DC6F',
      core: '#9AD9F0',
      abs: '#9AD9F0',
      chest: '#FF6B6B',
      leg: '#95E1D3',
      legs: '#95E1D3',
    };
    return colors_map[bodyPart.toLowerCase()] || colors.accent;
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
      <OfflineIndicator />

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
          <View style={styles.exercisesContainer}>
            <Text style={styles.sectionTitle}>Recommended Exercises</Text>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.accent} />
              </View>
            ) : !apiConnected || exercises.length === 0 ? (
              <View style={styles.zeroState}>
                <Text style={styles.zeroValue}>0</Text>
                <Text style={styles.zeroLabel}>Exercises</Text>
              </View>
            ) : (
              exercises.map((exercise) => {
                const icon = getBodyPartIcon(exercise.bodyPart);
                const iconColor = getBodyPartColor(exercise.bodyPart);
                
                return (
                  <TouchableOpacity key={exercise.id} style={styles.exerciseCard}>
                    <View style={[styles.exerciseIcon, { backgroundColor: iconColor + '20' }]}>
                      <Ionicons name={icon} size={24} color={iconColor} />
                    </View>

                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                      {exercise.description && (
                        <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                      )}

                      <View style={styles.exerciseMeta}>
                        {exercise.duration && (
                          <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={14} color={colors.secondary} />
                            <Text style={styles.metaText}>{exercise.duration}</Text>
                          </View>
                        )}

                        {exercise.difficulty && (
                          <View
                            style={[
                              styles.difficultyBadge,
                              { backgroundColor: getDifficultyColor(exercise.difficulty) + '20' },
                            ]}
                          >
                            <Text
                              style={[
                                styles.difficultyText,
                                { color: getDifficultyColor(exercise.difficulty) },
                              ]}
                            >
                              {exercise.difficulty}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <TouchableOpacity style={styles.playButton}>
                      <Ionicons name="play" size={20} color={colors.white} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })
            )}
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
    exercisesContainer: {
      gap: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.primary,
    },
    loadingContainer: {
      padding: 40,
      alignItems: 'center',
    },
    emptyState: {
      padding: 40,
      alignItems: 'center',
      gap: 12,
    },
    emptyStateText: {
      fontSize: 16,
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
