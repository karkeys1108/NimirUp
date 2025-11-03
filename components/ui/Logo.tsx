import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { typography } from '../../constants/typography';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  underlineColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  color,
  underlineColor,
  style,
  textStyle,
}) => {
  const { colors: themeColors } = useTheme();
  const textColor = color || themeColors.accent;
  const lineColor = underlineColor ?? textColor;
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
    color: textColor,
    ...textStyle,
  };

  return (
    <View style={[{ alignItems: 'center' }, style]}>
      <Text style={logoTextStyle}>NimirUp</Text>
      <View
        style={{
          height: 2,
          backgroundColor: lineColor,
          width: size === 'small' ? 40 : size === 'medium' ? 50 : 60,
          borderRadius: 1,
        }}
      />
    </View>
  );
};