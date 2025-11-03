import React, { useMemo } from 'react';
import { Animated, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
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
  const isProfileRoute = pathname?.includes('/profile');
  const isSettingsRoute = pathname?.includes('/settings');
  const showBackButton = isProfileRoute || isSettingsRoute;
  const headerTitle = isProfileRoute ? 'Profile' : isSettingsRoute ? 'Settings' : '';

  const handleProfilePress = () => {
    if (onProfilePress) onProfilePress();
    else router.push('/(tabs)/profile');
  };

  const handleSettingsPress = () => {
    if (onSettingsPress) onSettingsPress();
    else router.push('/(tabs)/settings');
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
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
        {showBackButton ? (
          <View style={styles.backHeaderContent}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.backTitle}>{headerTitle}</Text>
            <View style={styles.backSpacer} />
          </View>
        ) : (
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={[styles.iconButton, isProfileRoute && styles.iconButtonActive]}
              onPress={handleProfilePress}
            >
              <Ionicons
                name="person-circle-outline"
                size={28}
                color={isProfileRoute ? colors.white : colors.primary}
              />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Logo size="small" color={colors.primary} />
            </View>

            <TouchableOpacity
              style={[styles.iconButton, isSettingsRoute && styles.iconButtonActive]}
              onPress={handleSettingsPress}
            >
              <Ionicons
                name="settings-outline"
                size={26}
                color={isSettingsRoute ? colors.white : colors.primary}
              />
            </TouchableOpacity>
          </View>
        )}
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
    backHeaderContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      height: 28,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${colors.accent}20`,
    },
    backTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '600',
      color: colors.primary,
    },
    backSpacer: {
      width: 40,
    },
  });