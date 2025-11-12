import { Ionicons } from '@expo/vector-icons';

// Map body parts to icons
export const getBodyPartIcon = (bodyPart: string): keyof typeof Ionicons.glyphMap => {
  const normalizedPart = bodyPart.toLowerCase();
  
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    neck: 'body-outline',
    head: 'headset-outline',
    shoulder: 'muscle-outline',
    shoulders: 'muscle-outline',
    back: 'fitness-outline',
    spine: 'trending-up-outline',
    chest: 'heart-outline',
    core: 'ellipse-outline',
    abs: 'ellipse-outline',
    waist: 'remove-outline',
    hip: 'triangle-outline',
    hips: 'triangle-outline',
    leg: 'footsteps-outline',
    legs: 'footsteps-outline',
    knee: 'radio-button-on-outline',
    knees: 'radio-button-on-outline',
    ankle: 'radio-button-off-outline',
    ankles: 'radio-button-off-outline',
    arm: 'hand-left-outline',
    arms: 'hand-left-outline',
    wrist: 'radio-button-on-outline',
    wrists: 'radio-button-on-outline',
    foot: 'footsteps-outline',
    feet: 'footsteps-outline',
  };

  return iconMap[normalizedPart] || 'body-outline';
};

// Get alert icon based on alert level (1-5, where 1 is most crucial)
export const getAlertIcon = (alertLevel: number): keyof typeof Ionicons.glyphMap => {
  switch (alertLevel) {
    case 1:
      return 'warning'; // Most crucial - filled warning
    case 2:
      return 'warning-outline'; // High priority
    case 3:
      return 'alert-circle-outline'; // Medium priority
    case 4:
      return 'information-circle-outline'; // Low priority
    case 5:
      return 'checkmark-circle-outline'; // Info/Positive
    default:
      return 'help-circle-outline';
  }
};

// Get alert color based on alert level
export const getAlertColor = (alertLevel: number): string => {
  switch (alertLevel) {
    case 1:
      return '#EF4444'; // Red - critical
    case 2:
      return '#F59E0B'; // Orange - high
    case 3:
      return '#FBBF24'; // Yellow - medium
    case 4:
      return '#3B82F6'; // Blue - low
    case 5:
      return '#10B981'; // Green - positive
    default:
      return '#6B7280'; // Gray
  }
};

