import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 44,
    color: colors.primary,
    fontFamily: 'System', // Will be enhanced with web fonts
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    color: colors.primary,
    fontFamily: 'System',
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: colors.primary,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26,
    color: colors.primary,
    fontFamily: 'System',
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
    color: colors.primary,
    fontFamily: 'System',
    letterSpacing: 0.1,
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
    color: colors.secondary,
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.8,
    color: colors.primary,
    fontFamily: 'System',
  },
  // New onboarding-specific styles
  onboardingTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    lineHeight: 48,
    letterSpacing: -1,
    textAlign: 'center' as const,
    fontFamily: 'System', // Mozilla Text equivalent
  },
  onboardingSubtitle: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 30,
    letterSpacing: -0.2,
    textAlign: 'center' as const,
    fontFamily: 'System', // Roboto equivalent
  },
  onboardingCaption: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: 0.1,
    textAlign: 'center' as const,
    fontFamily: 'System', // Roboto equivalent
  },
};