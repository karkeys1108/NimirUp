import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBluetoothData } from '../../contexts/BluetoothDataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorPalette } from '../../constants/colors';
import { DeviceSettingsModal, OfflineIndicator } from '../../components/ui';

export default function HistoryPage() {
  const { colors } = useTheme();
  const { entries, refreshEntries, loading } = useBluetoothData();
  const [deviceModalVisible, setDeviceModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const styles = createStyles(colors);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshEntries();
    setRefreshing(false);
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.dataItem}>
      <View style={styles.dataHeader}>
        <Ionicons name="bluetooth" size={16} color={colors.accent} />
        <Text style={styles.dataTime}>{formatTimestamp(item.timestamp)}</Text>
      </View>
      <Text style={styles.dataValue} numberOfLines={2}>
        {item.value}
      </Text>
      <Text style={styles.dataDeviceId}>{item.deviceId}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <OfflineIndicator />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bluetooth Data History</Text>
        <TouchableOpacity
          style={styles.deviceButton}
          onPress={() => setDeviceModalVisible(true)}
        >
          <Ionicons name="settings-outline" size={20} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {loading && entries.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : entries.length > 0 ? (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
          }
        />
      ) : (
        <View style={styles.zeroState}>
          <Text style={styles.zeroValue}>0</Text>
          <Text style={styles.zeroLabel}>BLE Data Points</Text>
          <Text style={styles.zeroSubtext}>
            Connect a device to start collecting data
          </Text>
        </View>
      )}

      <DeviceSettingsModal
        visible={deviceModalVisible}
        onClose={() => setDeviceModalVisible(false)}
        colors={{
          white: colors.white,
          black: colors.black || '#000000',
          primary: colors.primary,
          secondary: colors.secondary,
          tertiary: colors.light,
          accent: colors.accent,
          light: colors.light,
          shadow: colors.shadow || '#000000',
          overlay: 'rgba(0,0,0,0.5)',
        }}
        isConnected={false}
        connectedDeviceName={undefined}
        onDeviceConnected={() => {}}
        onDeviceDisconnected={() => {}}
      />
    </View>
  );
}

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      paddingTop: 60,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.light + '60',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.primary,
    },
    deviceButton: {
      padding: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listContent: {
      padding: 20,
      gap: 12,
    },
    dataItem: {
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.light + '50',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    dataHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    dataTime: {
      fontSize: 12,
      color: colors.secondary,
      opacity: 0.7,
    },
    dataValue: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
      marginBottom: 4,
    },
    dataDeviceId: {
      fontSize: 11,
      color: colors.secondary,
      opacity: 0.6,
    },
    zeroState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
      gap: 12,
    },
    zeroValue: {
      fontSize: 64,
      fontWeight: '700',
      color: colors.secondary,
      opacity: 0.5,
    },
    zeroLabel: {
      fontSize: 16,
      color: colors.secondary,
      opacity: 0.7,
      textTransform: 'uppercase',
      letterSpacing: 1,
      fontWeight: '600',
    },
    zeroSubtext: {
      fontSize: 14,
      color: colors.secondary,
      opacity: 0.6,
      textAlign: 'center',
      marginTop: 8,
    },
  });
