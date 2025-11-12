import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
import * as Location from 'expo-location';

// Lazy load BleManager - it's a native module and won't work in Expo Go
let manager: any = null;
let initError: Error | null = null;

const getBleManager = () => {
  if (manager) return manager;
  if (initError) throw initError;
  
  try {
    const { BleManager } = require('react-native-ble-plx');
    manager = new BleManager();
    return manager;
  } catch (e) {
    initError = e as Error;
    console.warn('⚠️ BleManager not available (requires native build):', (e as Error).message);
    throw initError;
  }
};

class PermissionsService {
  async checkBluetoothPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
      );
      return hasPermission;
    }
    // iOS permissions are handled differently
    return true;
  }

  async requestBluetoothPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (error) {
        console.error('Bluetooth permission error:', error);
        return false;
      }
    }
    return true;
  }

  async checkLocationPermission(): Promise<boolean> {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  }

  async requestLocationPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async checkBluetoothEnabled(): Promise<boolean> {
    try {
      const mgr = getBleManager();
      const state = await mgr.state();
      return state === 'PoweredOn';
    } catch (error) {
      console.warn('Bluetooth state check error (BleManager not available):', error);
      return false;
    }
  }

  async requestAllPermissions(): Promise<{
    bluetooth: boolean;
    location: boolean;
    bluetoothEnabled: boolean;
  }> {
    const bluetoothPermission = await this.requestBluetoothPermission();
    const locationPermission = await this.requestLocationPermission();
    const bluetoothEnabled = await this.checkBluetoothEnabled();

    return {
      bluetooth: bluetoothPermission,
      location: locationPermission,
      bluetoothEnabled,
    };
  }

  showPermissionAlert(
    title: string,
    message: string,
    onPressSettings?: () => void
  ): void {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => {
            if (onPressSettings) {
              onPressSettings();
            } else {
              Linking.openSettings();
            }
          },
        },
      ]
    );
  }

  async checkAndRequestPermissionsOnAppStart(): Promise<{
    bluetooth: boolean;
    location: boolean;
    bluetoothEnabled: boolean;
  }> {
    const permissions = await this.requestAllPermissions();

    if (!permissions.bluetooth) {
      this.showPermissionAlert(
        'Bluetooth Permission Required',
        'This app needs Bluetooth permission to connect to your posture device. Please enable it in settings.'
      );
    }

    if (!permissions.location) {
      this.showPermissionAlert(
        'Location Permission Required',
        'This app needs Location permission for Bluetooth scanning. Please enable it in settings.'
      );
    }

    if (!permissions.bluetoothEnabled) {
      this.showPermissionAlert(
        'Bluetooth Not Enabled',
        'Please enable Bluetooth in your device settings to use this app.',
        () => {
          if (Platform.OS === 'android') {
            Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
          }
        }
      );
    }

    return permissions;
  }
}

export const permissionsService = new PermissionsService();

