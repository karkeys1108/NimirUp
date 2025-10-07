import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { UIProvider } from '../contexts/UIContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import '../global.css';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <UIProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="404" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </UIProvider>
    </ThemeProvider>
  );
}
