import React, { useEffect, useState, useRef } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BleManager, Device } from 'react-native-ble-plx';
import { toByteArray } from 'base64-js';
import { useBluetoothData } from '../../contexts/BluetoothDataContext';
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

export const DeviceSettingsModal = ({
  visible,
  onClose,
  colors,
  onDeviceConnected,
  onDeviceDisconnected,
  isConnected,
  connectedDeviceName,
}: DeviceSettingsModalProps) => {
  const managerRef = useRef<BleManager | null>(null);
  const subscriptionsRef = useRef<Array<{ remove: () => void }>>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const { pushEntry } = useBluetoothData();

  // ESP32 service/characteristic UUIDs (from your provided code)
  const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'.toLowerCase();
  const CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'.toLowerCase();

  // Initialize BLE
  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (visible && !managerRef.current) {
      managerRef.current = new BleManager();
      requestPermissions();
    }

    return () => {
      // keep manager alive so connection persists across modal open/close
      try {
        subscriptionsRef.current.forEach((s) => s?.remove && s.remove());
      } catch {}
      subscriptionsRef.current = [];
      try {
        managerRef.current?.stopDeviceScan();
      } catch {}
      // Do NOT destroy the manager here so BLE connection can remain active
    };
  }, [visible]);

  const requestPermissions = async () => {
    if (Platform.OS !== 'android') return;

    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ];
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const denied = Object.values(granted).some(
        (status) => status !== PermissionsAndroid.RESULTS.GRANTED
      );
      if (denied) {
        Alert.alert(
          'Permissions Required',
          'Bluetooth permissions are required to find and connect to devices.'
        );
      }
    } catch (error) {
      console.warn('Permission request failed:', error);
    }
  };

  // Scan for BLE devices
  const scanForDevices = async () => {
    const manager = managerRef.current;
    if (!manager) {
      Alert.alert('Bluetooth Not Ready', 'BLE manager not initialized');
      return;
    }

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
          setDevices((prev) => {
            const exists = prev.some((d) => d.id === device.id);
            if (!exists) return [...prev, device];
            return prev;
          });
        }
      });

      setTimeout(() => {
        manager.stopDeviceScan();
        setIsScanning(false);
      }, 10000);
    } catch (error) {
      console.warn('Scan failed:', error);
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: Device) => {
    const manager = managerRef.current;
    if (!manager) {
      Alert.alert('Bluetooth Not Ready', 'BLE manager not initialized');
      return;
    }

    setConnecting(true);
    try {
      // Connecting to device
      const connectedDev = await manager.connectToDevice(device.id);
      await connectedDev.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connectedDev);

      // listen for unexpected disconnects and attempt to reconnect
      try {
        const discSub = manager.onDeviceDisconnected(connectedDev.id, async (error, dev) => {
          console.warn('Device disconnected:', error, dev?.id);
          setConnectedDevice(null);
          if (onDeviceDisconnected) onDeviceDisconnected();
          // try to reconnect a few times
          const tryReconnect = async (attempt = 0) => {
            if (attempt >= 5) {
              console.warn('Max reconnect attempts reached');
              return;
            }
            const delay = 2000 * (attempt + 1);
            await new Promise((r) => setTimeout(r, delay));
            try {
              const reconnected = await manager.connectToDevice(device.id);
              await reconnected.discoverAllServicesAndCharacteristics();
              setConnectedDevice(reconnected);
              subscribeToNotifications(reconnected);
              if (onDeviceConnected) onDeviceConnected(reconnected);
              console.log('Reconnected to device after disconnect');
            } catch (e) {
              console.warn('Reconnect attempt failed, retrying...', e);
              await tryReconnect(attempt + 1);
            }
          };
          tryReconnect();
        });
        subscriptionsRef.current.push(discSub as any);
      } catch (e) {
        // some platforms may not support onDeviceDisconnected; ignore
      }

      subscribeToNotifications(connectedDev);

      if (onDeviceConnected) onDeviceConnected(connectedDev);
      Alert.alert('Connected', `Connected to ${device.name}`);
    } catch (error) {
      console.warn('❌ Connection failed:', error);
  Alert.alert('Connection Failed', `Could not connect to ${device.name}`);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectDevice = async () => {
    const manager = managerRef.current;
    if (connectedDevice && manager) {
      try {
        await manager.cancelDeviceConnection(connectedDevice.id);
        setConnectedDevice(null);
        subscriptionsRef.current.forEach((s) => s.remove?.());
        subscriptionsRef.current = [];
        if (onDeviceDisconnected) onDeviceDisconnected();
        Alert.alert('Disconnected', 'Device disconnected');
      } catch (error) {
        console.warn('Disconnect error:', error);
        Alert.alert('Error', 'Failed to disconnect device');
      }
    }
  };

  const subscribeToNotifications = async (connectedDev: Device) => {
    const manager = managerRef.current;
    if (!manager) return;

    try {
      // Prefer subscribing directly to the known service/characteristic from the ESP32
      const trySub = async (serviceUuid: string, charUuid: string) => {
        try {
          const sub = manager.monitorCharacteristicForDevice(
            connectedDev.id,
            serviceUuid,
            charUuid,
            (error, characteristic) => {
              if (error) {
                console.warn('Notification error (direct):', error);
                return;
              }
              if (characteristic && characteristic.value) {
                const raw = characteristic.value;
                // decode base64 -> bytes -> ascii (ESP32 is sending ASCII text)
                try {
                  const bytes = toByteArray(raw);
                  const decoded = String.fromCharCode.apply(null, bytes as any);
                  pushEntry({ deviceId: connectedDev.id, value: decoded, raw });
                } catch (e) {
                  // fallback: store raw
                  pushEntry({ deviceId: connectedDev.id, value: raw, raw });
                }
              }
            }
          );
          subscriptionsRef.current.push(sub as any);
          return true;
        } catch (e) {
          return false;
        }
      };

      let directOk = false;
      try {
        directOk = await trySub(SERVICE_UUID, CHARACTERISTIC_UUID);
      } catch {}

      if (!directOk) {
        // Fallback: iterate services/characteristics and subscribe to any notify-capable
        const services = await connectedDev.services();
        for (const svc of services) {
          const characteristics = await connectedDev.characteristicsForService(svc.uuid);
          for (const char of characteristics) {
            const properties = (char as any).properties || [];
            const canNotify = properties.includes('Notify') || properties.includes('notify');
            if (!canNotify) continue;

            const sub = manager.monitorCharacteristicForDevice(
              connectedDev.id,
              svc.uuid,
              char.uuid,
              (error, characteristic) => {
                if (error) {
                  console.warn('Notification error (fallback):', error);
                  return;
                }
                if (characteristic && characteristic.value) {
                  const raw = characteristic.value;
                  try {
                    const bytes = toByteArray(raw);
                    const decoded = String.fromCharCode.apply(null, bytes as any);
                    pushEntry({ deviceId: connectedDev.id, value: decoded, raw });
                  } catch (e) {
                    pushEntry({ deviceId: connectedDev.id, value: raw, raw });
                  }
                }
              }
            );
            subscriptionsRef.current.push(sub as any);
          }
        }
      }
    } catch (e) {
      console.warn('Subscribe error:', e);
    }
  };

  const styles = StyleSheet.create({
    centeredView: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalView: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      maxHeight: '90%',
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 18, fontWeight: '700', color: colors.primary },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${colors.secondary}15`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scanButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      backgroundColor: colors.accent,
      borderRadius: 12,
      marginBottom: 20,
    },
    scanButtonText: { color: colors.white, fontWeight: '600' },
  });

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>Device Settings</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={colors.secondary} />
            </TouchableOpacity>
          </View>

          <Text style={{ marginBottom: 16 }}>
            {isConnected ? `✅ Connected: ${connectedDeviceName || 'Device'}` : '❌ Not connected'}
          </Text>

          {isConnected && connectedDevice ? (
            <TouchableOpacity
              style={[styles.scanButton, { backgroundColor: '#ef4444' }]}
              onPress={disconnectDevice}
            >
              <Ionicons name="link-outline" size={18} color={colors.white} />
              <Text style={styles.scanButtonText}>Disconnect</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.scanButton} onPress={scanForDevices}>
              {isScanning ? (
                <>
                  <ActivityIndicator color={colors.white} />
                  <Text style={styles.scanButtonText}>Scanning...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="bluetooth" size={18} color={colors.white} />
                  <Text style={styles.scanButtonText}>Find Devices</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {!isConnected && (
            <FlatList
              data={devices}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => connectToDevice(item)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: colors.light,
                    marginBottom: 10,
                  }}
                >
                  <Ionicons
                    name="watch-outline"
                    size={22}
                    color={colors.accent}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>
                    {item.name || 'Unnamed Device'}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={{ textAlign: 'center', color: colors.secondary }}>
                  {isScanning ? 'Scanning...' : 'No devices found. Tap Find Devices.'}
                </Text>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
};