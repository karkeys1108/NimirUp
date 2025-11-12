import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DETAILS: 'user_details',
  TOP_EXERCISES: 'top_exercises',
  TOP_RECOMMENDATIONS: 'top_recommendations',
  LAST_SYNC: 'last_sync',
  DEVICE_ID: 'device_id',
  DEVICE_NAME: 'device_name',
} as const;

class StorageService {
  // User Authentication
  async saveUserToken(token: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
  }

  async getUserToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
  }

  async removeUserToken(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
  }

  // User Details
  async saveUserDetails(details: any): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DETAILS, JSON.stringify(details));
  }

  async getUserDetails(): Promise<any | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DETAILS);
    return data ? JSON.parse(data) : null;
  }

  async removeUserDetails(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DETAILS);
  }

  // Top Exercises (cached from API)
  async saveTopExercises(exercises: any[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.TOP_EXERCISES, JSON.stringify(exercises));
  }

  async getTopExercises(): Promise<any[] | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TOP_EXERCISES);
    return data ? JSON.parse(data) : null;
  }

  // Top Recommendations (cached from API)
  async saveTopRecommendations(recommendations: any[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.TOP_RECOMMENDATIONS, JSON.stringify(recommendations));
  }

  async getTopRecommendations(): Promise<any[] | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TOP_RECOMMENDATIONS);
    return data ? JSON.parse(data) : null;
  }

  // Last Sync Time
  async saveLastSync(timestamp: number): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp.toString());
  }

  async getLastSync(): Promise<number | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return data ? parseInt(data, 10) : null;
  }

  // Device Info
  async saveDeviceInfo(deviceId: string, deviceName: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
    await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_NAME, deviceName);
  }

  async getDeviceInfo(): Promise<{ deviceId: string | null; deviceName: string | null }> {
    const deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    const deviceName = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_NAME);
    return { deviceId, deviceName };
  }

  async removeDeviceInfo(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.DEVICE_ID);
    await AsyncStorage.removeItem(STORAGE_KEYS.DEVICE_NAME);
  }

  // Clear all data
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  }
}

export const storageService = new StorageService();

