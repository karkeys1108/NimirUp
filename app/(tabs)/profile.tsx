import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Device } from 'react-native-ble-plx';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeviceSettingsModal, Header } from '../../components/ui';
import { ColorPalette } from '../../constants/colors';
import { useTheme } from '../../contexts/ThemeContext';

type ProfileStat = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type DeviceInfo = {
  name: string;
  model: string;
  firmware: string;
  battery: number;
  connected: boolean;
};

export default function ProfilePage() {
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [notifications, setNotifications] = useState(true);
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isDeviceModalVisible, setIsDeviceModalVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { colors, theme, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const statusBarStyle = theme === 'dark' ? 'light-content' : 'dark-content';
  const isDarkMode = theme === 'dark';

  const profileStats = useMemo<ProfileStat[]>(
    () => [
      { label: 'Sessions', value: '24', icon: 'pulse-outline' },
      { label: 'Streak', value: '7 days', icon: 'flame-outline' },
      { label: 'Posture', value: '85%', icon: 'trophy-outline' },
    ],
    []
  );

  const deviceInfo = useMemo<DeviceInfo>(
    () => ({
      name: 'NimirUp Smart Belt',
      model: 'NSB-202',
      firmware: 'v1.0.0',
      battery: 78,
      connected: isDeviceConnected,
    }),
    [isDeviceConnected]
  );

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      setIsStatusBarVisible((prev) => !prev);
    }
    setLastTap(now);
  };

  const handleDeviceConnected = (device: Device) => {
    setConnectedDevice(device);
    setIsDeviceConnected(true);
  };

  const handleDeviceDisconnected = () => {
    setConnectedDevice(null);
    setIsDeviceConnected(false);
  };

  const handleOpenDeviceSettings = () => {
    setIsDeviceModalVisible(true);
  };

  const handleCloseDeviceSettings = () => {
    setIsDeviceModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.white }]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={colors.white}
        hidden={!isStatusBarVisible}
        animated
      />

      <Header scrollY={scrollY} />

      <Pressable style={styles.tapLayer} onPress={handleDoubleTap}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
        >
          {/* Profile Header */}
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.profileHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color={colors.white} />
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>Karthikeyan</Text>
            <Text style={styles.userEmail}>karthikeyan30@gmail.com</Text>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            {profileStats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Ionicons name={stat.icon} size={20} color={colors.accent} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* IoT Device Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connected Device</Text>
            <View style={styles.deviceCard}>
              <View style={styles.deviceHeader}>
                <View style={styles.deviceIcon}>
                  <Ionicons name="fitness" size={24} color={colors.accent} />
                </View>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{deviceInfo.name}</Text>
                  <Text style={styles.deviceModel}>{deviceInfo.model}</Text>
                </View>
                <View
                  style={[
                    styles.connectionStatus,
                    { backgroundColor: deviceInfo.connected ? colors.accent : '#ff6b6b' },
                  ]}
                >
                  <Text style={styles.connectionText}>
                    {deviceInfo.connected ? 'Connected' : 'Offline'}
                  </Text>
                </View>
              </View>

              <View style={styles.deviceDetails}>
                <View style={styles.deviceDetailRow}>
                  <Text style={styles.deviceDetailLabel}>Firmware Version</Text>
                  <Text style={styles.deviceDetailValue}>{deviceInfo.firmware}</Text>
                </View>
                <View style={styles.deviceDetailRow}>
                  <Text style={styles.deviceDetailLabel}>Battery Level</Text>
                  <View style={styles.batteryContainer}>
                    <View style={styles.batteryBar}>
                      <View style={[styles.batteryFill, { width: `${deviceInfo.battery}%` }]} />
                    </View>
                    <Text style={styles.batteryText}>{deviceInfo.battery}%</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.deviceButton}
                onPress={handleOpenDeviceSettings}
              >
                <Ionicons name="settings-outline" size={16} color={colors.accent} />
                <Text style={styles.deviceButtonText}>Device Settings</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Settings</Text>
            <View style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <Ionicons name="notifications-outline" size={20} color={colors.primary} />
                  <Text style={styles.settingLabel}>Notifications</Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: `${colors.secondary}25`, true: `${colors.accent}55` }}
                  thumbColor={notifications ? colors.accent : colors.white}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <Ionicons name="color-palette-outline" size={20} color={colors.primary} />
                  <Text style={styles.settingLabel}>Dark Mode</Text>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  trackColor={{ false: `${colors.secondary}25`, true: `${colors.accent}55` }}
                  thumbColor={isDarkMode ? colors.accent : colors.white}
                />
              </View>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
                  <Text style={styles.settingLabel}>Privacy & Security</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.secondary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
                  <Text style={styles.settingLabel}>Help & Support</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Actions */}
          <View style={styles.section}>
            <View style={styles.accountActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="download-outline" size={18} color={colors.primary} />
                <Text style={styles.actionButtonText}>Export Data</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, styles.signOutButton]}>
                <Ionicons name="log-out-outline" size={18} color="#ff6b6b" />
                <Text style={[styles.actionButtonText, { color: '#ff6b6b' }]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.ScrollView>
      </Pressable>

      <DeviceSettingsModal
        visible={isDeviceModalVisible}
        onClose={handleCloseDeviceSettings}
        colors={colors}
        onDeviceConnected={handleDeviceConnected}
        onDeviceDisconnected={handleDeviceDisconnected}
        isConnected={isDeviceConnected}
        connectedDeviceName={connectedDevice?.name || 'NimirUp Smart Belt'}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    tapLayer: {
      flex: 1,
      marginBottom: 80,
    },
    scrollContent: {
      paddingTop: 92,
      paddingBottom: 40,
      gap: 24,
    },
    profileHeader: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 20,
      marginHorizontal: 20,
      borderRadius: 20,
      backgroundColor: colors.primary,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: `${colors.white}22`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    editAvatarButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.white,
    },
    userName: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.white,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: colors.white,
      opacity: 0.85,
      marginBottom: 16,
    },
    editProfileButton: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      backgroundColor: colors.white,
      borderRadius: 20,
    },
    editProfileText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      gap: 12,
    },
    statCard: {
      flex: 1,
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.light,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: `${colors.secondary}25`,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
      gap: 8,
    },
    statValue: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
    },
    statLabel: {
      fontSize: 12,
      color: colors.secondary,
    },
    section: {
      paddingHorizontal: 20,
      gap: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
    },
    deviceCard: {
      backgroundColor: colors.light,
      borderRadius: 18,
      padding: 20,
      borderWidth: 1,
      borderColor: `${colors.secondary}25`,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
      gap: 16,
    },
    deviceHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    deviceIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${colors.accent}22`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deviceInfo: {
      flex: 1,
    },
    deviceName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
    deviceModel: {
      fontSize: 13,
      color: colors.secondary,
      opacity: 0.8,
    },
    connectionStatus: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    connectionText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.white,
    },
    deviceDetails: {
      gap: 12,
    },
    deviceDetailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deviceDetailLabel: {
      fontSize: 14,
      color: colors.secondary,
      opacity: 0.9,
    },
    deviceDetailValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    batteryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    batteryBar: {
      width: 60,
      height: 8,
      backgroundColor: `${colors.secondary}22`,
      borderRadius: 4,
      overflow: 'hidden',
    },
    batteryFill: {
      height: '100%',
      backgroundColor: colors.accent,
      borderRadius: 4,
    },
    batteryText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
    },
    deviceButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 10,
    },
    deviceButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.accent,
    },
    settingsCard: {
      backgroundColor: colors.light,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: `${colors.secondary}25`,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 5,
      gap: 12,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    settingLabel: {
      fontSize: 14,
      color: colors.primary,
    },
    accountActions: {
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 14,
      backgroundColor: colors.light,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: `${colors.secondary}25`,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 5,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    signOutButton: {
      borderColor: '#ff6b6b55',
    },
  });