import React, { useEffect, useRef } from 'react';
import { Text, TextStyle, Animated } from 'react-native';

interface AnimatedTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  delay?: number;
  duration?: number;
  slideFromDirection?: 'left' | 'right' | 'top' | 'bottom' | 'fade';
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  style,
  delay = 0,
  duration = 800,
  slideFromDirection = 'fade',
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const translateValue = useRef(new Animated.Value(
    slideFromDirection === 'left' ? -50 :
    slideFromDirection === 'right' ? 50 :
    slideFromDirection === 'top' ? -30 :
    slideFromDirection === 'bottom' ? 30 : 0
  )).current;

  useEffect(() => {
    // Reset values before animation
    animatedValue.setValue(0);
    translateValue.setValue(
      slideFromDirection === 'left' ? -50 :
      slideFromDirection === 'right' ? 50 :
      slideFromDirection === 'top' ? -30 :
      slideFromDirection === 'bottom' ? 30 : 0
    );

    const animation = Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateValue, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]);

    animation.start();
  }, [delay, duration, slideFromDirection]);

  const getTransform = () => {
    if (slideFromDirection === 'left' || slideFromDirection === 'right') {
      return [{ translateX: translateValue }];
    } else if (slideFromDirection === 'top' || slideFromDirection === 'bottom') {
      return [{ translateY: translateValue }];
    }
    return [];
  };

  return (
    <Animated.Text
      style={[
        style,
        {
          opacity: animatedValue,
          transform: getTransform(),
        },
      ]}
    >
      {children}
    </Animated.Text>
  );
};