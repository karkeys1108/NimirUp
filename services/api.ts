import axios, { AxiosInstance, AxiosError } from 'axios';
import { storageService } from './storage';
import { databaseService } from './database';
import { networkService } from './network';

// Update this with your backend API URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-api-url.com/api';

class ApiService {
  private client: AxiosInstance;
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private readonly SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await storageService.getUserToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh or logout
          await storageService.removeUserToken();
          // You can emit an event here to trigger logout in the app
        }
        return Promise.reject(error);
      }
    );
  }

  // Start automatic sync every 5 minutes
  startAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      await this.syncBluetoothData();
    }, this.SYNC_INTERVAL_MS);

    // Initial sync
    this.syncBluetoothData();
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Sync unsynced Bluetooth data to backend
  async syncBluetoothData(): Promise<void> {
    try {
      const unsyncedData = await databaseService.getUnsyncedData();
      if (unsyncedData.length === 0) return;

      const response = await this.client.post('/bluetooth/data/batch', {
        data: unsyncedData.map((entry) => ({
          id: entry.id,
          timestamp: entry.timestamp,
          deviceId: entry.deviceId,
          value: entry.value,
          raw: entry.raw,
        })),
      });

      if (response.data.success) {
        const syncedIds = unsyncedData.map((entry) => entry.id);
        await databaseService.markAsSynced(syncedIds);
        await storageService.saveLastSync(Date.now());
      }
    } catch (error) {
      console.error('Sync error:', error);
      // Data will be synced on next interval
    }
  }

  // Send a single bluetooth entry to backend immediately
  async sendBluetoothEntry(entry: { id: string; timestamp: number; deviceId: string; value: string; raw?: string; }): Promise<boolean> {
    try {
      const response = await this.client.post('/bluetooth/data', {
        data: {
          id: entry.id,
          timestamp: entry.timestamp,
          deviceId: entry.deviceId,
          value: entry.value,
          raw: entry.raw,
        },
      });

      if (response.data && response.data.success) {
        await storageService.saveLastSync(Date.now());
        return true;
      }
      return false;
    } catch (error) {
      console.error('sendBluetoothEntry error:', error);
      return false;
    }
  }

  // Get user details (offline-first: check local, then API)
  async getUserDetails(): Promise<any> {
    // Check local storage first
    const cached = await storageService.getUserDetails();
    
    // Try API if online
    const isOnline = await networkService.isConnected();
    if (isOnline) {
      try {
        const response = await this.client.get('/user/details');
        await storageService.saveUserDetails(response.data);
        return response.data;
      } catch (error) {
        // If API fails, return cached data
        if (cached) return cached;
        throw error;
      }
    }
    
    // Return cached data if offline
    if (cached) return cached;
    throw new Error('No cached data available and offline');
  }

  // Get top exercises (offline-first)
  async getTopExercises(): Promise<any[]> {
    const cached = await storageService.getTopExercises();
    const isOnline = await networkService.isConnected();
    
    if (isOnline) {
      try {
        const response = await this.client.get('/exercises/top?limit=4');
        await storageService.saveTopExercises(response.data);
        return response.data;
      } catch (error) {
        if (cached) return cached;
        throw error;
      }
    }
    
    if (cached) return cached;
    return [];
  }

  // Get top recommendations (offline-first)
  async getTopRecommendations(): Promise<any[]> {
    const cached = await storageService.getTopRecommendations();
    const isOnline = await networkService.isConnected();
    
    if (isOnline) {
      try {
        const response = await this.client.get('/recommendations/top');
        await storageService.saveTopRecommendations(response.data);
        return response.data;
      } catch (error) {
        if (cached) return cached;
        throw error;
      }
    }
    
    if (cached) return cached;
    return [];
  }

  // Get recent insights with alerts (offline-first)
  async getRecentInsights(): Promise<any[]> {
    const isOnline = await networkService.isConnected();
    
    if (isOnline) {
      try {
        const response = await this.client.get('/insights/recent');
        return response.data;
      } catch (error) {
        // No local cache for insights, return empty
        return [];
      }
    }
    
    return [];
  }

  // Get all exercises (offline-first)
  async getExercises(): Promise<any[]> {
    const isOnline = await networkService.isConnected();
    
    if (isOnline) {
      try {
        const response = await this.client.get('/exercises');
        return response.data;
      } catch (error) {
        return [];
      }
    }
    
    return [];
  }

  // Get exercises by body part
  async getExercisesByBodyPart(bodyPart: string): Promise<any[]> {
    const response = await this.client.get(`/exercises?bodyPart=${bodyPart}`);
    return response.data;
  }

  // Send analysis result to ESP32 (via backend)
  async sendToDevice(deviceId: string, message: string): Promise<void> {
    await this.client.post('/device/send', {
      deviceId,
      message,
    });
  }

  // Upload analysis result
  async uploadAnalysisResult(result: any): Promise<void> {
    await this.client.post('/analysis/result', result);
  }
}

export const apiService = new ApiService();

