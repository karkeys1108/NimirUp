import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoBackground } from '../ui/VideoBackground';
import { SmoothPagination } from '../ui/SmoothPagination';
import { AnimatedButton } from '../ui/AnimatedButton';
import { Logo, AnimatedText, AuthModal } from '../ui';
import { colors, typography } from '../../constants';

const { width } = Dimensions.get('window');

interface OnboardingContainerProps {
  onSkip: () => void;
  onGetStarted: () => void;
}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  onSkip,
  onGetStarted,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const totalSlides = 3;

  const slides = [
    {
      id: 1,
      title: "",
      subtitle: "Welcome to NimirUp",
      caption: "Smart posture monitoring technology that helps reduce back pain naturally and improves your daily well-being."
    },
    {
      id: 2,
      title: "",
      subtitle: "AI-Powered Guidance",
      caption: "Receive personalized feedback and build lasting posture habits with intelligent real-time coaching."
    },
    {
      id: 3,
      title: "",
      subtitle: "Transform Your Posture",
      caption: "Join thousands who have improved their posture, confidence, and quality of life with NimirUp."
    }
  ];

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slideIndex !== currentSlide) {
      setCurrentSlide(slideIndex);
      setAnimationKey(prev => prev + 1);
    }
  };

  const goToNext = () => {
    if (currentSlide < totalSlides - 1) {
      const nextIndex = currentSlide + 1;
      scrollViewRef.current?.scrollTo({ 
        x: nextIndex * width, 
        animated: true 
      });
      setCurrentSlide(nextIndex);
      setAnimationKey(prev => prev + 1);
    } else {
      // Show authentication modal instead of calling onGetStarted directly
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onGetStarted();
  };

  useEffect(() => {
    setAnimationKey(1);
  }, []);

  return (
    <View style={styles.container}>
      {/* Continuous Video Background */}
      <VideoBackground 
        videoSource={require('../../assets/videos/walk1.mp4')}
        currentSlide={currentSlide}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Logo at Top */}
        <View style={styles.logoContainer}>
          <Logo size="large" color={colors.white} />
        </View>

        {/* Content Slides */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={styles.scrollView}
          decelerationRate="fast"
          snapToInterval={width}
          snapToAlignment="start"
        >
          {slides.map((slide, index) => (
            <View key={slide.id} style={styles.slide}>
              <View style={styles.slideContent}>
                {index === currentSlide && (
                  <>
                    <AnimatedText
                      key={`subtitle-${animationKey}-${index}`}
                      style={styles.slideSubtitle}
                      delay={300}
                      duration={800}
                      slideFromDirection="top"
                    >
                      {slide.subtitle}
                    </AnimatedText>
                    
                    <AnimatedText
                      key={`caption-${animationKey}-${index}`}
                      style={styles.slideCaption}
                      delay={600}
                      duration={900}
                      slideFromDirection="bottom"
                    >
                      {slide.caption}
                    </AnimatedText>
                  </>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Navigation Controls */}
        <View style={styles.navigationContainer}>
          {/* Smooth Pagination */}
          <View style={styles.paginationContainer}>
            <SmoothPagination 
              currentIndex={currentSlide} 
              totalSlides={totalSlides} 
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <AnimatedButton
              title="Skip"
              onPress={onSkip}
              variant="ghost"
            />

            <AnimatedButton
              title={currentSlide === totalSlides - 1 ? 'Get Started' : 'Next'}
              onPress={goToNext}
              variant="primary"
            />
          </View>
        </View>
      </SafeAreaView>

      {/* Authentication Modal */}
      <AuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={handleAuthSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 160,
    paddingHorizontal: 15,
    maxWidth: '100%',
    flex: 1,
    overflow: 'hidden',
  },

  slideTitle: {
    ...typography.onboardingTitle,
    color: colors.white,
    marginBottom: 16,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    fontWeight: 'bold' as const,
    letterSpacing: -1.2,
  },
  slideSubtitle: {
    ...typography.onboardingSubtitle,
    color: colors.accent,
    marginBottom: 12,
    paddingHorizontal: 15,
    textAlign: 'center' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    fontSize: 26,
    maxWidth: '90%',
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  slideCaption: {
    ...typography.onboardingCaption,
    color: '#FFFFFF',
    paddingHorizontal: 8,
    marginTop: 8,
    textAlign: 'center' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
    lineHeight: 22,
    fontSize: 15,
    maxWidth: '92%',
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  navigationContainer: {
    paddingBottom: 40,
    paddingHorizontal: 30,
  },
  paginationContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});