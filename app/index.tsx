import React from 'react';
import { router } from 'expo-router';
import { OnboardingContainer } from '../components/onboarding';

export default function OnboardingScreen() {
  const handleSkip = () => {
    // Navigate to main app or home screen after skipping
    router.push('/404'); // You can change this to your main app route later
  };

  const handleGetStarted = () => {
    // This will be called after successful authentication
    // Navigate to main app or home screen
    router.push('/404'); // You can change this to your main app route later
  };

  return (
    <OnboardingContainer 
      onSkip={handleSkip}
      onGetStarted={handleGetStarted}
    />
  );
}