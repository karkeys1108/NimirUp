import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useNavigationState } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { Footer } from '../../components/ui';
import { ColorPalette } from '../../constants/colors';
import { useTheme } from '../../contexts/ThemeContext';

type RouteKey = 'history' | 'index' | 'ai-suggestions' | 'exercise';

const TAB_CONFIG: Record<RouteKey, { icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap; size?: number; }> = {
  history: { icon: 'time-outline', activeIcon: 'time', size: 22 },
  index: { icon: 'home-outline', activeIcon: 'home', size: 22 },
  'ai-suggestions': { icon: 'bulb-outline', activeIcon: 'bulb', size: 22 },
  exercise: { icon: 'barbell-outline', activeIcon: 'barbell', size: 26 },
};

type CustomTabBarButtonProps = BottomTabBarButtonProps & {
  routeName: RouteKey;
  colors: ColorPalette;
};

const CustomTabBarButton = ({
  accessibilityState,
  onPress,
  style,
  routeName,
  colors,
}: CustomTabBarButtonProps) => {
  // Get current route name from navigation state
  const currentRoute = useNavigationState((state) => {
    const route = state?.routes[state?.index || 0];
    return route?.name;
  });
  
  const routeMatch = routeName === 'index' 
    ? (currentRoute === 'index' || !currentRoute || currentRoute === '(tabs)')
    : currentRoute === routeName;
  
  const isFocused = Boolean(accessibilityState?.selected) || routeMatch;
  const config = TAB_CONFIG[routeName] ?? TAB_CONFIG.index;

  // Animation values
  const scaleAnim = useRef(new Animated.Value(isFocused ? 1 : 0.9)).current;
  const opacityAnim = useRef(new Animated.Value(isFocused ? 1 : 0.6)).current;
  const iconScaleAnim = useRef(new Animated.Value(isFocused ? 1.1 : 1)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  // Animate on focus change
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isFocused ? 1 : 0.9,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
      Animated.timing(opacityAnim, {
        toValue: isFocused ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(iconScaleAnim, {
        toValue: isFocused ? 1.1 : 1,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
    ]).start();
  }, [isFocused]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.85,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => [
        styles.tabButton,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: Animated.multiply(scaleAnim, pressAnim) }],
            opacity: opacityAnim,
          },
          isFocused && {
            backgroundColor: colors.accent + '15',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              transform: [{ scale: iconScaleAnim }],
            },
            isFocused && {
              backgroundColor: colors.accent,
              width: 48,
              height: 48,
              borderRadius: 24,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            },
          ]}
        >
          <Ionicons
            name={isFocused ? config.activeIcon : config.icon}
            size={isFocused ? 24 : 22}
            color={isFocused ? colors.white : colors.secondary}
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export default function TabsLayout() {
  let colors: ColorPalette;
  try {
    colors = useTheme().colors;
  } catch (e) {
    // Fallback colors if ThemeProvider is not available
    colors = {
      primary: '#1a1a1a',
      secondary: '#666666',
      accent: '#007AFF',
      white: '#FFFFFF',
      black: '#000000',
      light: '#F5F5F5',
      shadow: '#000000',
    } as ColorPalette;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: 102,
          paddingBottom: 36,
          paddingTop: 20,
          paddingHorizontal: 32,
          elevation: 0,
        },
        tabBarBackground: () => <Footer />,
        headerShown: false,
        tabBarButton: (props) =>
          ['profile', 'settings'].includes(route.name)
            ? null
            : <CustomTabBarButton {...props} routeName={route.name as RouteKey} colors={colors} />,
      })}
    >
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="ai-suggestions" options={{ title: 'AI Coach' }} />
      <Tabs.Screen name="exercise" options={{ title: 'Exercise' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', href: null }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
