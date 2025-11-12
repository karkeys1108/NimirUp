import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorPalette } from '../../constants/colors';
import { useNetworkStatus } from '../../services/network';

export const OfflineIndicator: React.FC = () => {
  const isConnected = useNetworkStatus();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (isConnected) {
    return null; // Don't show when connected
  }

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={16} color={colors.white} />
      <Text style={styles.text}>Application working in offline mode</Text>
    </View>
  );
};

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ff6b6b',
      paddingVertical: 8,
      paddingHorizontal: 16,
      gap: 8,
    },
    text: {
      color: colors.white,
      fontSize: 12,
      fontWeight: '600',
    },
  });

