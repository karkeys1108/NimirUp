import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface SmoothPaginationProps {
  currentIndex: number;
  totalSlides: number;
}

export const SmoothPagination: React.FC<SmoothPaginationProps> = ({ 
  currentIndex, 
  totalSlides 
}) => {
  // Separate animated values for different properties
  const widthValues = useRef(
    Array.from({ length: totalSlides }, () => new Animated.Value(0))
  ).current;

  const opacityValues = useRef(
    Array.from({ length: totalSlides }, () => new Animated.Value(0.4))
  ).current;

  const colorValues = useRef(
    Array.from({ length: totalSlides }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Animate all dots with consistent useNativeDriver: false
    widthValues.forEach((widthValue, index) => {
      const isActive = index === currentIndex;
      
      // Width animation
      Animated.spring(widthValue, {
        toValue: isActive ? 1 : 0,
        tension: 120,
        friction: 8,
        useNativeDriver: false,
      }).start();

      // Opacity animation
      Animated.spring(opacityValues[index], {
        toValue: isActive ? 1 : 0.4,
        tension: 120,
        friction: 8,
        useNativeDriver: false,
      }).start();

      // Color animation
      Animated.spring(colorValues[index], {
        toValue: isActive ? 1 : 0,
        tension: 120,
        friction: 8,
        useNativeDriver: false,
      }).start();
    });
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSlides }).map((_, index) => {
        const widthInterpolate = widthValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [12, 32],
        });

        const backgroundColorInterpolate = colorValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [colors.white, colors.accent],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: widthInterpolate,
                opacity: opacityValues[index],
                backgroundColor: backgroundColorInterpolate,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  dot: {
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
});