import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, StyleProp, ViewStyle, View } from 'react-native';
import { Footer } from '../../components/ui';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorPalette } from '../../constants/colors';

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
  const focused = Boolean(accessibilityState?.selected);
  const config = TAB_CONFIG[routeName] ?? TAB_CONFIG.index;
  const buttonStyles: StyleProp<ViewStyle> = [
    styles.tabButton,
    focused && styles.tabButtonFocused,
    focused && {
      backgroundColor: `${colors.accent}1F`,
      borderColor: `${colors.accent}55`,
      shadowColor: colors.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 10,
      elevation: 6,
    },
    style,
  ];

  const iconWrapperStyles: StyleProp<ViewStyle> = [
    styles.iconWrapper,
    focused && { backgroundColor: colors.accent },
  ];

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.9}
      onPress={onPress}
      style={buttonStyles}
    >
      <View style={iconWrapperStyles}>
        <Ionicons
          name={focused ? config.activeIcon : config.icon}
          size={config.size ?? (focused ? 24 : 22)}
          color={focused ? colors.white : colors.secondary}
        />
      </View>
    </TouchableOpacity>
  );
};

export default function TabsLayout() {
  const { colors } = useTheme();

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
          height: 76,
          paddingBottom: 12,
          paddingTop: 12,
          paddingHorizontal: 24,
          elevation: 0,
        },
        tabBarBackground: () => <Footer />,
        headerShown: false,
        tabBarButton: (props) => (
          ['profile', 'settings'].includes(route.name)
            ? null
            : <CustomTabBarButton {...props} routeName={route.name as RouteKey} colors={colors} />
        ),
      })}
    >
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="ai-suggestions"
        options={{
          title: 'AI Coach',
        }}
      />
      <Tabs.Screen
        name="exercise"
        options={{
          title: 'Exercise',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabButtonFocused: {
    transform: [{ scale: 1.05 }, { translateY: -2 }],
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});