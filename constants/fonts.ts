// Font configuration for web and native platforms
// This would be enhanced with actual font loading in a production app

export const fontFamilies = {
  mozillaText: {
    regular: 'Mozilla-Text-Regular',
    medium: 'Mozilla-Text-Medium', 
    bold: 'Mozilla-Text-Bold',
  },
  roboto: {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },
  // Fallback to system fonts for React Native
  system: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  }
};

// Font weight mapping for cross-platform consistency
export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

// CSS-like font styling for consistent typography
export const fontStyles = {
  mozillaText: {
    fontOpticalSizing: 'auto',
    fontStyle: 'normal',
  },
  roboto: {
    fontOpticalSizing: 'auto',
    fontStyle: 'normal',
    fontVariationSettings: '"wdth" 100',
  }
};

// Professional text presets matching the requested styling
export const textPresets = {
  heroTitle: {
    fontFamily: fontFamilies.system.bold, // Would be Mozilla Text in production
    fontSize: 42,
    fontWeight: fontWeights.bold,
    letterSpacing: -1.2,
    lineHeight: 48,
  },
  subtitle: {
    fontFamily: fontFamilies.system.medium, // Would be Roboto in production  
    fontSize: 22,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  bodyText: {
    fontFamily: fontFamilies.system.regular, // Would be Roboto in production
    fontSize: 17,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.2,
    lineHeight: 30,
  }
};