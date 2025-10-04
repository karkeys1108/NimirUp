import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo, Button } from '../components/ui';
import { colors, typography } from '../constants';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Logo size="large" style={{ marginBottom: 32 }} />
        
        <Text style={styles.title}>Under Development</Text>
        <Text style={styles.subtitle}>Dashboard Coming Soon!</Text>
        <Text style={styles.description}>
          We're working hard to bring you an amazing posture monitoring experience with real-time analytics and personalized insights.
        </Text>
        
        <Button
          title="← Back to Onboarding"
          onPress={() => router.push('/')}
          variant="primary"
          size="medium"
          style={{ marginTop: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    ...typography.h1,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.h3,
    color: colors.accent,
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
});