import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Logo } from './Logo';
import { colors } from '../../constants';

interface SharedHeaderProps {
  onProfilePress?: () => void;
  onSettingsPress?: () => void;
}

export const SharedHeader: React.FC<SharedHeaderProps> = ({
  onProfilePress,
  onSettingsPress,
}) => {
  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      router.push('/(tabs)/profile');
    }
  };

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      router.push('/(tabs)/settings');
    }
  };

  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.headerContent}>
        {/* Profile Icon */}
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Logo size="small" color={colors.primary} />
        </View>

        {/* Settings Icon */}
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
          <Ionicons name="settings-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    paddingBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.light + '15',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 2,
    paddingBottom: 2,
    height: 48,
  },
  profileButton: {
    padding: 2,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  settingsButton: {
    padding: 2,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});