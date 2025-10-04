import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from '../ui';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

const { width } = Dimensions.get('window');

export const FeaturesSlide: React.FC = () => {
  const features = [
    {
      title: 'Real-time Monitoring',
      description: 'Advanced sensors track your posture 24/7',
    },
    {
      title: 'Smart Corrections',
      description: 'Gentle vibrations guide you to better posture',
    },
    {
      title: 'Health Analytics',
      description: 'Detailed insights into your posture patterns',
    },
  ];

  return (
    <View style={{
      width,
      flex: 1,
      position: 'relative',
    }}>
      {/* Background Video */}
      <Video
        source={require('../../assets/videos/walk1.mp4')}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
        shouldPlay
        isLooping
        isMuted
        resizeMode={ResizeMode.COVER}
      />
      
      {/* Gradient Overlay */}
      <LinearGradient
        colors={[
          `${colors.secondary}95`,
          `${colors.primary}70`,
          `${colors.secondary}90`
        ]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
      />
      
      {/* Content */}
      <View style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        zIndex: 10,
      }}>
        {/* Logo at Top Center */}
        <View style={{
          alignItems: 'center',
          marginBottom: 40,
        }}>
          <Logo size="large" color={colors.white} />
        </View>
        
        <Text style={{
          ...typography.h2,
          color: colors.white,
          textAlign: 'center',
          marginBottom: 32,
        }}>
          Smart Features
        </Text>
        
        <View style={{ flex: 1, justifyContent: 'center' }}>
          {features.map((feature, index) => (
            <View key={index} style={{
              backgroundColor: `${colors.white}90`,
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
              backdropFilter: 'blur(10px)',
            }}>
              <Text style={{
                ...typography.h3,
                fontSize: 18,
                marginBottom: 8,
                color: colors.primary,
              }}>
                {feature.title}
              </Text>
              <Text style={{
                ...typography.body,
                color: colors.secondary,
              }}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};