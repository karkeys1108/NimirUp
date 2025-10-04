import React from 'react';
import { View } from 'react-native';
import { colors } from '../../constants/colors';

interface PaginationProps {
  currentIndex: number;
  totalSlides: number;
}

export const Pagination: React.FC<PaginationProps> = ({ currentIndex, totalSlides }) => {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
    }}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <View
          key={index}
          style={{
            width: index === currentIndex ? 32 : 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: index === currentIndex ? colors.accent : colors.white,
            marginHorizontal: 5,
            opacity: index === currentIndex ? 1 : 0.5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 3,
          }}
        />
      ))}
    </View>
  );
};