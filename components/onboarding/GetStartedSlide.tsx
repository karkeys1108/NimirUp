import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Logo } from '../ui';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

const { width } = Dimensions.get('window');

interface GetStartedSlideProps {
  onGetStarted: () => void;
}

export const GetStartedSlide: React.FC<GetStartedSlideProps> = ({ onGetStarted }) => {
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
          `${colors.accent}40`,
          `${colors.primary}80`,
          `${colors.primary}95`
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
        
        {/* Main Content */}
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 80,
        }}>
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: `${colors.accent}90`,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
          }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: colors.white,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <View style={{
                width: 0,
                height: 0,
                borderLeftWidth: 15,
                borderRightWidth: 15,
                borderBottomWidth: 20,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: colors.primary,
                transform: [{ rotate: '90deg' }],
              }} />
            </View>
          </View>
          
          <Text style={{
            ...typography.h1,
            color: colors.white,
            textAlign: 'center',
            marginBottom: 16,
          }}>
            Ready to Transform
          </Text>
          
          <Text style={{
            ...typography.body,
            color: colors.light,
            textAlign: 'center',
            marginBottom: 48,
            paddingHorizontal: 20,
            lineHeight: 24,
          }}>
            Join thousands of users who have improved their posture and overall health with NimirUp.
          </Text>
          
          <Button
            title="Get Started"
            onPress={onGetStarted}
            variant="primary"
            size="large"
            fullWidth
            style={{ marginBottom: 16 }}
          />
          
          <Button
            title="Learn More"
            onPress={() => {}}
            variant="outline"
            size="medium"
            style={{ 
              paddingHorizontal: 32,
              borderColor: colors.white,
            }}
            textStyle={{ color: colors.white }}
          />
        </View>
      </View>
    </View>
  );
};