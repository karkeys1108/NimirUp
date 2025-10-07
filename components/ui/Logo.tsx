import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { typography } from '../../constants/typography';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  color,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const accentColor = color || colors.accent;
  const getSizeStyles = () => {
    const sizes = {
      small: { fontSize: 20, marginBottom: 4 },
      medium: { fontSize: 24, marginBottom: 8 },
      large: { fontSize: 32, marginBottom: 12 },
    };
    return sizes[size];
  };

  const logoTextStyle: TextStyle = {
    ...typography.logo,
    ...getSizeStyles(),
  color: accentColor,
    ...textStyle,
  };

  return (
    <View style={[{ alignItems: 'center' }, style]}>
      <Text style={logoTextStyle}>NimirUp</Text>
      <View style={{
        height: 1,
  backgroundColor: accentColor,
        width: size === 'small' ? 40 : size === 'medium' ? 50 : 60,
        borderRadius: 1,
      }} />
    </View>
  );
};