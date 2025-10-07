import React, { useMemo } from 'react';
import { Animated, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { Logo } from './Logo';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorPalette } from '../../constants/colors';

interface HeaderProps {
  scrollY: Animated.Value; // <-- pass this from parent ScrollView
  onProfilePress?: () => void;
  onSettingsPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  scrollY,
  onProfilePress,
  onSettingsPress,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const pathname = usePathname();
  const isProfileActive = pathname?.includes('/profile');
  const isSettingsActive = pathname?.includes('/settings');
  const handleProfilePress = () => {
    if (onProfilePress) onProfilePress();
    else router.push('/(tabs)/profile');
  };

  const handleSettingsPress = () => {
    if (onSettingsPress) onSettingsPress();
    else router.push('/(tabs)/settings');
  };

  // Fade in when scrolling down ~50px
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerBackgroundStyle = {
    opacity: headerOpacity,
  };

  const headerShadowStyle = {
    shadowOpacity: scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 0.1],
      extrapolate: 'clamp',
    }),
    elevation: scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 4],
      extrapolate: 'clamp',
    }),
  };

  return (
    <Animated.View style={[styles.header, headerShadowStyle]}>
      {/* Background that appears on scroll */}
      <Animated.View style={[styles.headerBackground, headerBackgroundStyle]} />
      
      <SafeAreaView>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={[styles.iconButton, isProfileActive && styles.iconButtonActive]}
            onPress={handleProfilePress}
          >
            <Ionicons
              name="person-circle-outline"
              size={28}
              color={isProfileActive ? colors.white : colors.primary}
            />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Logo size="small" color={colors.primary} />
          </View>

          <TouchableOpacity
            style={[styles.iconButton, isSettingsActive && styles.iconButtonActive]}
            onPress={handleSettingsPress}
          >
            <Ionicons
              name="settings-outline"
              size={26}
              color={isSettingsActive ? colors.white : colors.primary}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'transparent',
    },
    headerBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.white,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      height: 28,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    iconButtonActive: {
      backgroundColor: colors.accent,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    },
    logoContainer: {
      flex: 1,
      alignItems: 'center',
    },
  });