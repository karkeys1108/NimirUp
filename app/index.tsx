import React from 'react';
import { router } from 'expo-router';
import { OnboardingContainer } from '../components/onboarding';

export default function OnboardingScreen() {
  const handleSkip = () => {
    // Navigate to main app tabs after skipping
    router.push('/(tabs)');
  };

  const handleGetStarted = () => {
    // This will be called after successful authentication
    // Navigate to main app tabs
    router.push('/(tabs)');
  };

  return (
    <OnboardingContainer 
      onSkip={handleSkip}
      onGetStarted={handleGetStarted} 
    />
  );
}