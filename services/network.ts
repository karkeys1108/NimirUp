import { useEffect, useState } from 'react';
import * as Network from 'expo-network';

class NetworkService {
  private listeners: Set<(isConnected: boolean) => void> = new Set();
  private checkInterval: ReturnType<typeof setInterval> | null = null;

  async isConnected(): Promise<boolean> {
    try {
      const networkState = await Network.getNetworkStateAsync();
      return networkState.isConnected ?? false;
    } catch (error) {
      console.error('Network check error:', error);
      return false;
    }
  }

  subscribe(callback: (isConnected: boolean) => void): () => void {
    this.listeners.add(callback);
    
    // Initial check
    this.isConnected().then(callback);

    // Poll network state every 2 seconds
    this.checkInterval = setInterval(async () => {
      const connected = await this.isConnected();
      this.listeners.forEach((listener) => listener(connected));
    }, 2000);

    return () => {
      this.listeners.delete(callback);
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
      }
    };
  }
}

export const networkService = new NetworkService();

// React hook for network status
export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = networkService.subscribe(setIsConnected);
    return unsubscribe;
  }, []);

  return isConnected;
};

