import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BleManager, Device } from 'react-native-ble-plx';
import { ColorPalette } from '../../constants/colors';

interface DeviceSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  colors: ColorPalette;
  onDeviceConnected?: (device: Device) => void;
  onDeviceDisconnected?: () => void;
  isConnected: boolean;
  connectedDeviceName?: string;
}

const manager = new BleManager();

export const DeviceSettingsModal = ({
  visible,
  onClose,
  colors,
  onDeviceConnected,
  onDeviceDisconnected,
  isConnected,
  connectedDeviceName,
}: DeviceSettingsModalProps) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    requestPermissions();
    return () => {
      manager.stopDeviceScan();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
      } catch (error) {
        console.warn('Permission request failed:', error);
      }
    }
  };

  const scanForDevices = async () => {
    if (isScanning) {
      manager.stopDeviceScan();
      setIsScanning(false);
      return;
    }

    setIsScanning(true);
    setDevices([]);

    try {
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.warn('Scan error:', error);
          setIsScanning(false);
          return;
        }

        if (device && device.name) {
          setDevices((prevDevices) => {
            const exists = prevDevices.some((d) => d.id === device.id);
            if (!exists) {
              return [...prevDevices, device];
            }
            return prevDevices;
          });
        }
      });

      // Stop scanning after 10 seconds
      setTimeout(() => {
        manager.stopDeviceScan();
        setIsScanning(false);
      }, 10000);
    } catch (error) {
      console.warn('Scan start error:', error);
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: Device) => {
    setConnecting(true);
    try {
      console.log('🔗 Connecting to', device.name);
      const connectedDev = await manager.connectToDevice(device.id);
      await connectedDev.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connectedDev);
      console.log('✅ Connected to', device.name);
      
      if (onDeviceConnected) {
        onDeviceConnected(connectedDev);
      }

      Alert.alert('Success', `Connected to ${device.name}`);
    } catch (error) {
      console.warn('❌ Connection failed:', error);
      Alert.alert('Connection Failed', `Could not connect to ${device.name}`);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await manager.cancelDeviceConnection(connectedDevice.id);
        setConnectedDevice(null);
        if (onDeviceDisconnected) {
          onDeviceDisconnected();
        }
        Alert.alert('Success', 'Device disconnected');
      } catch (error) {
        console.warn('Disconnect error:', error);
        Alert.alert('Error', 'Failed to disconnect device');
      }
    }
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 24,
      paddingHorizontal: 20,
      paddingBottom: 30,
      maxHeight: '90%',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${colors.secondary}15`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusSection: {
      marginBottom: 24,
      padding: 16,
      backgroundColor: `${colors.accent}10`,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: `${colors.accent}25`,
    },
    statusTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.secondary,
      marginBottom: 8,
    },
    statusContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    statusBadge: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: isConnected ? '#4ade80' : '#ef4444',
    },
    statusText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      flex: 1,
    },
    scanButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.accent,
      borderRadius: 12,
      marginBottom: 20,
    },
    scanButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.white,
    },
    disconnectButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#ef4444',
      borderRadius: 12,
      marginBottom: 20,
    },
    disconnectButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.white,
    },
    deviceListContainer: {
      marginVertical: 12,
    },
    deviceListTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.secondary,
      marginBottom: 12,
    },
    deviceItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      marginBottom: 10,
      backgroundColor: colors.light,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: `${colors.secondary}15`,
    },
    deviceIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${colors.accent}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    deviceInfo: {
      flex: 1,
    },
    deviceName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    deviceId: {
      fontSize: 12,
      color: colors.secondary,
      opacity: 0.7,
      marginTop: 2,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyStateIcon: {
      marginBottom: 12,
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.secondary,
      textAlign: 'center',
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: colors.secondary,
      fontWeight: '500',
    },
    notConnectedText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ef4444',
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Device Settings</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={colors.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Connection Status */}
            <View style={styles.statusSection}>
              <Text style={styles.statusTitle}>Connection Status</Text>
              <View style={styles.statusContent}>
                <View style={styles.statusBadge} />
                <Text style={styles.statusText}>
                  {isConnected ? `Connected: ${connectedDeviceName || 'Device'}` : 'Device Not Connected'}
                </Text>
              </View>
            </View>

            {/* Action Button */}
            {isConnected && connectedDevice ? (
              <TouchableOpacity
                style={styles.disconnectButton}
                onPress={disconnectDevice}
                disabled={connecting}
              >
                <Ionicons name="link-outline" size={18} color={colors.white} />
                <Text style={styles.disconnectButtonText}>
                  {connecting ? 'Disconnecting...' : 'Disconnect Device'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.scanButton}
                onPress={scanForDevices}
                disabled={connecting}
              >
                {isScanning ? (
                  <>
                    <ActivityIndicator color={colors.white} size="small" />
                    <Text style={styles.scanButtonText}>Scanning...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="bluetooth" size={18} color={colors.white} />
                    <Text style={styles.scanButtonText}>Find Device</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {/* Devices List */}
            {!isConnected && (
              <View style={styles.deviceListContainer}>
                <Text style={styles.deviceListTitle}>
                  Available Devices {devices.length > 0 && `(${devices.length})`}
                </Text>

                {isScanning && devices.length === 0 ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color={colors.accent} size="large" />
                    <Text style={styles.loadingText}>Scanning for devices...</Text>
                  </View>
                ) : devices.length === 0 ? (
                  <View style={styles.emptyState}>
                    <View style={styles.emptyStateIcon}>
                      <Ionicons name="bluetooth-outline" size={40} color={colors.secondary} />
                    </View>
                    <Text style={styles.emptyStateText}>
                      {isScanning ? 'Searching for devices...' : 'No devices found. Tap Find Device to search.'}
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={devices}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.deviceItem}
                        onPress={() => connectToDevice(item)}
                        disabled={connecting}
                      >
                        <View style={styles.deviceIcon}>
                          <Ionicons name="fitness" size={20} color={colors.accent} />
                        </View>
                        <View style={styles.deviceInfo}>
                          <Text style={styles.deviceName}>{item.name || 'Unnamed Device'}</Text>
                          <Text style={styles.deviceId}>ID: {item.id.substring(0, 12)}...</Text>
                        </View>
                        {connecting ? (
                          <ActivityIndicator color={colors.accent} size="small" />
                        ) : (
                          <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
                        )}
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
