import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { databaseService } from '../services/database';
import { apiService } from '../services/api';

export type BluetoothDataEntry = {
  id: string;
  timestamp: number;
  deviceId: string;
  value: string;
  raw?: string;
};

type BluetoothDataContextValue = {
  entries: BluetoothDataEntry[];
  pushEntry: (entry: Omit<BluetoothDataEntry, 'id' | 'timestamp'>) => Promise<void>;
  clear: () => Promise<void>;
  refreshEntries: () => Promise<void>;
  loading: boolean;
};

const BluetoothDataContext = createContext<BluetoothDataContextValue | undefined>(undefined);

export const BluetoothDataProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<BluetoothDataEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const refreshEntries = useCallback(async () => {
    try {
      setLoading(true);
      // Get only latest 50 entries for history page
      const data = await databaseService.getBluetoothData(50, 0);
      setEntries(data);
    } catch (error) {
      console.error('Failed to refresh entries:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        await databaseService.initialize();
        setInitialized(true);
        await refreshEntries();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    initialize();
  }, [refreshEntries]);

  const pushEntry = useCallback(async (entry: Omit<BluetoothDataEntry, 'id' | 'timestamp'>) => {
    if (!initialized) {
      console.warn('Database not initialized yet');
      return;
    }

    try {
      // Get current count from database
      const totalCount = await databaseService.getTotalCount();

      // If we have more than 50 entries, implement 5-minute throttling
      if (totalCount >= 50) {
        // Get the most recent entry to check time
        const recentData = await databaseService.getBluetoothData(1, 0);
        if (recentData.length === 0) return;
        
        const lastEntry = recentData[0]; // Most recent entry
        const timeSinceLastEntry = Date.now() - lastEntry.timestamp;
        const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

        // Only allow new entry if 5 minutes have passed
        if (timeSinceLastEntry < fiveMinutes) {
          console.log('Throttling: Waiting for 5-minute interval');
          return;
        }
      }

      const newEntry: BluetoothDataEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        timestamp: Date.now(),
        ...entry,
      };
      
      // Save to SQLite (offline-first)
      await databaseService.insertBluetoothData(newEntry);

      // Try to send to backend if online (non-blocking)
      (async () => {
        try {
          const { networkService } = await import('../services/network');
          const isOnline = await networkService.isConnected();
          if (isOnline) {
            const sent = await apiService.sendBluetoothEntry(newEntry);
            if (sent) {
              await databaseService.markAsSynced([newEntry.id]);
            }
          }
        } catch (e) {
          // ignore; will be retried by auto-sync when online
        }
      })();

      // Update state (keep only latest 50 in memory for performance)
      setEntries((prev) => [newEntry, ...prev].slice(0, 50));
    } catch (error) {
      console.error('Failed to push entry:', error);
    }
  }, [initialized]);

  const clear = useCallback(async () => {
    try {
      await databaseService.clearAllData();
      setEntries([]);
    } catch (error) {
      console.error('Failed to clear entries:', error);
    }
  }, []);

  return (
    <BluetoothDataContext.Provider value={{ entries, pushEntry, clear, refreshEntries, loading }}>
      {children}
    </BluetoothDataContext.Provider>
  );
};

export const useBluetoothData = () => {
  const ctx = useContext(BluetoothDataContext);
  if (!ctx) throw new Error('useBluetoothData must be used within BluetoothDataProvider');
  return ctx;
};

export default BluetoothDataContext;
