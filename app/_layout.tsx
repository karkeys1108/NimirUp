import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { UIProvider } from '../contexts/UIContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { BluetoothDataProvider } from '../contexts/BluetoothDataContext';
import { AuthProvider } from '../contexts/AuthContext';
import { permissionsService } from '../services/permissions';
import { apiService } from '../services/api';
import '../global.css';

// Suppress known harmless warnings
LogBox.ignoreLogs([
  'expo-av: Video component from `expo-av` is deprecated',
]);

export default function RootLayout() {
  useEffect(() => {
    const initialize = async () => {
      try {
        // Check and request permissions on app start
        await permissionsService.checkAndRequestPermissionsOnAppStart();
        
        // Start auto-sync for API (only if user is authenticated)
        // This will be started after user logs in
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initialize();
  }, []);

  return (
    <ThemeProvider>
      <UIProvider>
        <AuthProvider>
          <BluetoothDataProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="404" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </BluetoothDataProvider>
        </AuthProvider>
      </UIProvider>
    </ThemeProvider>
  );
}
