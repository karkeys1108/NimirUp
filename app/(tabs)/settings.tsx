import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Pressable,
  Switch,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../../components/ui';
import { apiService } from '../../services/api';
import { typography } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorPalette } from '../../constants/colors';

export default function SettingsPage() {
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(false);
  const { colors, theme, setTheme } = useTheme();
  const [lastTap, setLastTap] = useState(0);
  const [notifications, setNotifications] = useState(true);
  const [postureAlerts, setPostureAlerts] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isDarkMode = theme === 'dark';

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      setIsStatusBarVisible((prev) => !prev);
    }
    setLastTap(now);
  };

  const handleThemeSwitch = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const showThemeOptions = () => {
    Alert.alert(
      'Theme Preferences',
      'Choose your preferred theme',
      [
        { text: 'Light Theme', onPress: () => setTheme('light') },
        { text: 'Dark Theme', onPress: () => setTheme('dark') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const settingSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: 'color-palette-outline',
          label: 'Theme',
          value: isDarkMode ? 'Dark' : 'Light',
          onPress: showThemeOptions,
          type: 'action',
        },
        {
          icon: 'contrast-outline',
          label: 'Dark Mode',
          value: isDarkMode,
          onPress: handleThemeSwitch,
          type: 'switch',
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: 'notifications-outline',
          label: 'Push Notifications',
          value: notifications,
          onPress: setNotifications,
          type: 'switch',
        },
        {
          icon: 'alert-circle-outline',
          label: 'Posture Alerts',
          value: postureAlerts,
          onPress: setPostureAlerts,
          type: 'switch',
        },
        {
          icon: 'volume-high-outline',
          label: 'Sound Alerts',
          value: soundEnabled,
          onPress: setSoundEnabled,
          type: 'switch',
        },
        {
          icon: 'phone-portrait-outline',
          label: 'Vibration',
          value: vibrationEnabled,
          onPress: setVibrationEnabled,
          type: 'switch',
        },
      ],
    },
    {
      title: 'Data & Sync',
      items: [
        {
          icon: 'sync-outline',
          label: 'Auto Sync',
          value: autoSync,
          onPress: setAutoSync,
          type: 'switch',
        },
        {
          icon: 'cloud-upload-outline',
          label: 'Backup Settings',
          onPress: () => Alert.alert('Backup', 'Backup your settings to cloud'),
          type: 'action',
        },
        {
          icon: 'download-outline',
          label: 'Export Data',
          onPress: () => Alert.alert('Export', 'Export your posture data'),
          type: 'action',
        },
      ],
    },
    {
      title: 'Device',
      items: [
        {
          icon: 'fitness-outline',
          label: 'Smart Belt Settings',
          onPress: () => Alert.alert('Device', 'Configure your NimirUp Smart Belt'),
          type: 'action',
        },
        {
          icon: 'bluetooth-outline',
          label: 'Bluetooth Connection',
          onPress: () => Alert.alert('Bluetooth', 'Manage device connections'),
          type: 'action',
        },
        {
          icon: 'wifi-outline',
          label: 'WiFi Settings',
          onPress: () => Alert.alert('WiFi', 'Configure network settings'),
          type: 'action',
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: 'shield-checkmark-outline',
          label: 'Privacy Policy',
          onPress: () => Alert.alert('Privacy', 'View privacy policy'),
          type: 'action',
        },
        {
          icon: 'lock-closed-outline',
          label: 'Data Security',
          onPress: () => Alert.alert('Security', 'View security settings'),
          type: 'action',
        },
        {
          icon: 'eye-off-outline',
          label: 'Anonymous Analytics',
          value: true,
          onPress: () => {},
          type: 'switch',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline',
          label: 'Help Center',
          onPress: () => Alert.alert('Help', 'Access help documentation'),
          type: 'action',
        },
        {
          icon: 'chatbubble-outline',
          label: 'Contact Support',
          onPress: () => Alert.alert('Support', 'Contact our support team'),
          type: 'action',
        },
        {
          icon: 'star-outline',
          label: 'Rate App',
          onPress: () => Alert.alert('Rate', 'Rate NimirUp on the app store'),
          type: 'action',
        },
        {
          icon: 'information-circle-outline',
          label: 'About',
          onPress: () => Alert.alert('About', 'NimirUp v1.0.0'),
          type: 'action',
        },
      ],
    },
  ];

  // Metrics from backend
  const [metrics, setMetrics] = useState<{ session?: number; streak?: number; posture?: string } | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      setMetricsLoading(true);
      setMetricsError(null);
      try {
        const data = await apiService.getUserDetails();
        // expecting backend to return something like { metrics: { session, streak, posture } }
        if (!mounted) return;
        const m = data?.metrics || {
          session: data?.sessionCount,
          streak: data?.streak,
          posture: data?.postureStatus,
        };
        setMetrics(m);
      } catch (e: any) {
        console.warn('Failed to load metrics', e);
        if (!mounted) return;
        setMetricsError('Failed to load metrics');
      } finally {
        if (mounted) setMetricsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const renderSettingItem = (item: any, index: number) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.settingItem}
        onPress={item.type === 'action' ? item.onPress : undefined}
      >
        <View style={styles.settingItemLeft}>
          <View style={styles.settingIcon}>
            <Ionicons name={item.icon} size={20} color={colors.primary} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            {item.type === 'action' && item.value && (
              <Text style={styles.settingValue}>{item.value}</Text>
            )}
          </View>
        </View>
        {item.type === 'switch' ? (
          <Switch
            value={item.value}
            onValueChange={item.onPress}
            trackColor={{ false: colors.light, true: colors.accent + '40' }}
            thumbColor={item.value ? colors.accent : colors.secondary}
          />
        ) : (
          <Ionicons name="chevron-forward" size={16} color={colors.secondary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
        hidden={!isStatusBarVisible}
        animated
      />

      <Header scrollY={scrollY} />

      <Pressable style={styles.tapLayer} onPress={handleDoubleTap}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Settings Header */}
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.headerCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerIcon}>
              <Ionicons name="settings" size={24} color={colors.white} />
            </View>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>
              Customize your NimirUp experience
            </Text>
            {/* Metrics row */}
            <View style={styles.metricsRow}>
              {metricsLoading ? (
                <Text style={styles.metricText}>Loading metrics...</Text>
              ) : metricsError ? (
                <Text style={styles.metricText}>{metricsError}</Text>
              ) : (
                <View style={styles.metricsInner}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Sessions</Text>
                    <Text style={styles.metricValue}>{metrics?.session ?? '-'}</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Streak</Text>
                    <Text style={styles.metricValue}>{metrics?.streak ?? '-'}</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Posture</Text>
                    <Text style={styles.metricValue}>{metrics?.posture ?? '-'}</Text>
                  </View>
                </View>
              )}
            </View>
          </LinearGradient>

          {/* Settings Sections */}
          {settingSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.settingsCard}>
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    {renderSettingItem(item, itemIndex)}
                    {itemIndex < section.items.length - 1 && (
                      <View style={styles.separator} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Version Info */}
          <View style={styles.versionCard}>
            <Text style={styles.versionTitle}>NimirUp</Text>
            <Text style={styles.versionText}>Version 1.0.0 (Build 100)</Text>
            <Text style={styles.versionSubtext}>
              Smart posture monitoring with IoT integration
            </Text>
          </View>
        </Animated.ScrollView>
      </Pressable>
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.white,
    },
    tapLayer: {
      flex: 1,
      marginBottom: 80,
    },
    scrollContent: {
      paddingTop: 68,
      paddingBottom: 40,
      paddingHorizontal: 20,
      gap: 20,
    },
    headerCard: {
      alignItems: 'center',
      paddingVertical: 28,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginBottom: 8,
    },
    headerIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.light + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.white,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.light,
      opacity: 0.9,
      textAlign: 'center',
    },
    section: {
      gap: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      marginLeft: 4,
    },
    settingsCard: {
      backgroundColor: colors.white,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.light + '50',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
      overflow: 'hidden',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    settingItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.light + '40',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    settingTextContainer: {
      flex: 1,
    },
    settingLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.primary,
    },
    settingValue: {
      fontSize: 13,
      color: colors.secondary,
      marginTop: 2,
    },
    separator: {
      height: 1,
      backgroundColor: colors.light + '40',
      marginLeft: 64,
    },
    versionCard: {
      alignItems: 'center',
      padding: 24,
      backgroundColor: colors.light + '20',
      borderRadius: 16,
      marginTop: 8,
    },
    versionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 4,
    },
    versionText: {
      fontSize: 14,
      color: colors.secondary,
      marginBottom: 8,
    },
    versionSubtext: {
      fontSize: 12,
      color: colors.secondary,
      opacity: 0.7,
      textAlign: 'center',
    },
    metricsRow: {
      marginTop: 16,
      width: '100%',
      alignItems: 'center',
    },
    metricsInner: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 12,
    },
    metricItem: {
      alignItems: 'center',
      flex: 1,
    },
    metricLabel: {
      fontSize: 12,
      color: colors.light,
      marginBottom: 4,
    },
    metricValue: {
      fontSize: 18,
      color: colors.white,
      fontWeight: '700',
    },
    metricText: {
      fontSize: 14,
      color: colors.white,
    },
  });