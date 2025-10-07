import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorPalette } from '../../constants/colors';

export const Footer: React.FC = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.tabBarBackground}>
      <View style={styles.tabBarContent} />
    </View>
  );
};

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    tabBarBackground: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 76,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: colors.black,
    },
    tabBarContent: {
      flex: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderTopWidth: 0.5,
      borderLeftWidth: 0.5,
      borderRightWidth: 0.5,
      backgroundColor: colors.white,
      borderColor: `${colors.secondary}25`,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 8,
    },
  });