import React from 'react';
import { router } from 'expo-router';
import { OnboardingContainer } from '../components/onboarding';

export default function OnboardingScreen() {
  const handleGetStarted = () => {
    router.push('/(tabs)');
  };

  return (
    <OnboardingContainer 
      onSkip={handleGetStarted}
      onGetStarted={handleGetStarted} 
    />
  );
}