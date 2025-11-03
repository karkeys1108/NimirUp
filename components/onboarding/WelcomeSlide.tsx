import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from '../ui';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

const { width, height } = Dimensions.get('window');

export const WelcomeSlide: React.FC = () => {
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
          `${colors.primary}90`,
          `${colors.primary}60`,
          `${colors.primary}80`
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
          marginBottom: 60,
        }}>
          <Logo size="large" color={colors.white} underlineColor={colors.accent} />
        </View>
        
        {/* Main Content */}
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 100,
        }}>
          <Text style={{
            ...typography.h1,
            color: colors.white,
            textAlign: 'center',
            marginBottom: 16,
          }}>
            Welcome to NimirUp
          </Text>
          
          <Text style={{
            ...typography.body,
            color: colors.light,
            textAlign: 'center',
            lineHeight: 24,
            paddingHorizontal: 20,
          }}>
            Your intelligent posture correction companion. Experience the future of health monitoring with our advanced IoT technology.
          </Text>
        </View>
      </View>
    </View>
  );
};