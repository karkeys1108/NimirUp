# Bluetooth Device Connection Setup Guide

## 🔧 Installation Steps

### Step 1: Install Dependencies
The required package has been added to `package.json`. Run:

```bash
npm install
```

### Step 2: Install Native Dependencies (iOS only)
For iOS, you need to install CocoaPods dependencies:

```bash
npx pod-install
```

Or if using Expo locally:
```bash
cd ios && pod install && cd ..
```

### Step 3: Update Android Permissions
Add the following permissions to your `app.json` for Android:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "permissions": [
              "android.permission.BLUETOOTH_SCAN",
              "android.permission.BLUETOOTH_CONNECT",
              "android.permission.ACCESS_FINE_LOCATION"
            ]
          }
        }
      ]
    ]
  }
}
```

## 🎯 Features Implemented

### DeviceSettingsModal Component
Located in: `components/ui/DeviceSettingsModal.tsx`

**Features:**
- ✅ Scan for nearby Bluetooth devices
- ✅ Display discovered devices in a list
- ✅ Connect to selected devices
- ✅ Show connection status
- ✅ Disconnect from connected device
- ✅ Permission handling for Android
- ✅ Loading states and error handling

### Profile Integration
The modal is integrated into the profile screen (`app/(tabs)/profile.tsx`):

1. **Device Settings Button** - Opens the modal when clicked
2. **Connection Status Display** - Shows if a device is connected
3. **Device Information** - Displays device details and battery level

## 📱 How to Use

### In Your App
1. Navigate to the **Profile** tab
2. Scroll down to the **Connected Device** section
3. Click the **Device Settings** button
4. The Device Settings modal will appear with:
   - Current connection status
   - **Find Device** button to scan for nearby devices
   - List of discovered devices
   - Option to connect to available devices
   - **Disconnect Device** button when connected

### User Flow

#### When Device is NOT Connected:
1. Click "Find Device" button
2. App scans for available Bluetooth devices (10-second scan)
3. Discovered devices appear in the list
4. Click on a device to connect
5. Once connected, status updates to show the device name

#### When Device IS Connected:
1. Connection status shows: "Connected: [Device Name]"
2. Connection badge shows green status indicator
3. Click "Disconnect Device" button to disconnect
4. Status updates back to "Device Not Connected"

## 🔐 Permissions

### Android Permissions Required:
- `BLUETOOTH_SCAN` - To scan for devices
- `BLUETOOTH_CONNECT` - To connect to devices
- `ACCESS_FINE_LOCATION` - Required for Bluetooth scanning

The app requests these permissions automatically when the modal first opens.

### iOS
- Update Info.plist with Bluetooth usage descriptions if needed

## 📦 Package Details

The following package is now installed:
- **react-native-ble-plx** ^3.1.0 - BLE communication library

## 🛠️ Component Props

### DeviceSettingsModal

```typescript
interface DeviceSettingsModalProps {
  visible: boolean;                           // Show/hide modal
  onClose: () => void;                        // Called when modal closes
  colors: ColorPalette;                       // Theme colors
  onDeviceConnected?: (device: Device) => void;     // Callback on connection
  onDeviceDisconnected?: () => void;          // Callback on disconnection
  isConnected: boolean;                       // Connection status
  connectedDeviceName?: string;              // Name of connected device
}
```

## 🎨 UI/UX Features

- **Status Section** - Shows current connection status with visual indicator
- **Responsive Design** - Works on different screen sizes
- **Loading States** - Loading spinner during scanning and connecting
- **Empty States** - Clear messaging when no devices found
- **Error Handling** - User-friendly alerts for connection failures
- **Smooth Animations** - Modal slides up from bottom with backdrop

## 🐛 Troubleshooting

### Devices not showing up during scan?
1. Ensure Bluetooth is enabled on both devices
2. Make sure the device you're searching for is in pairing mode
3. Verify permissions are granted on Android
4. Try moving devices closer together

### Connection fails?
1. Check that the device hasn't exceeded maximum connections
2. Verify the device is compatible with BLE
3. Try disconnecting and reconnecting
4. Restart the app and Bluetooth on both devices

### Permission denied errors?
1. Go to app settings and enable Bluetooth permissions
2. On Android, ensure Location permission is also granted (required for BLE scan)
3. Restart the app after granting permissions

## 📝 Code Example

```typescript
// In your component
const [isDeviceConnected, setIsDeviceConnected] = useState(false);
const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
const [isModalVisible, setIsModalVisible] = useState(false);

const handleDeviceConnected = (device: Device) => {
  setConnectedDevice(device);
  setIsDeviceConnected(true);
};

const handleDeviceDisconnected = () => {
  setConnectedDevice(null);
  setIsDeviceConnected(false);
};

// Use the component
<DeviceSettingsModal
  visible={isModalVisible}
  onClose={() => setIsModalVisible(false)}
  colors={colors}
  onDeviceConnected={handleDeviceConnected}
  onDeviceDisconnected={handleDeviceDisconnected}
  isConnected={isDeviceConnected}
  connectedDeviceName={connectedDevice?.name}
/>
```

## 🚀 Next Steps

1. Build the app for Android/iOS
2. Test with actual Bluetooth devices
3. Customize the device name filtering as needed
4. Add additional BLE service/characteristic handling
5. Implement persistent storage for connected device info

## 📚 Resources

- [react-native-ble-plx Documentation](https://github.com/dotintent/react-native-ble-plx)
- [BLE Protocol Overview](https://www.bluetooth.org/en-us/specification/adopted-specifications)
- [React Native Permissions](https://reactnative.dev/docs/permissions)

## ⚠️ Important Notes

- The BLE manager instance is a singleton and shared across the app
- Always request permissions before scanning
- The scan automatically stops after 10 seconds
- Connection attempts include service discovery for compatibility
- Test on actual devices for best results (emulators may have limitations)
