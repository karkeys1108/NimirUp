import * as SQLite from 'expo-sqlite';

export interface BluetoothDataEntry {
  id: string;
  timestamp: number;
  deviceId: string;
  value: string;
  raw?: string;
  synced?: number; // 0 = not synced, 1 = synced
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('nimirup.db');
      await this.createTables();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS bluetooth_data (
        id TEXT PRIMARY KEY,
        timestamp INTEGER NOT NULL,
        device_id TEXT NOT NULL,
        value TEXT NOT NULL,
        raw TEXT,
        synced INTEGER DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS idx_timestamp ON bluetooth_data(timestamp);
      CREATE INDEX IF NOT EXISTS idx_device_id ON bluetooth_data(device_id);
      CREATE INDEX IF NOT EXISTS idx_synced ON bluetooth_data(synced);
    `);
  }

  async insertBluetoothData(entry: Omit<BluetoothDataEntry, 'synced'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT INTO bluetooth_data (id, timestamp, device_id, value, raw, synced)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [entry.id, entry.timestamp, entry.deviceId, entry.value, entry.raw || null]
    );
  }

  async getBluetoothData(limit: number = 100, offset: number = 0): Promise<BluetoothDataEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<{
      id: string;
      timestamp: number;
      deviceId: string;
      value: string;
      raw: string | null;
      synced: number;
    }>(
      `SELECT id, timestamp, device_id as deviceId, value, raw, synced
       FROM bluetooth_data
       ORDER BY timestamp DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return result.map((row) => ({
      id: row.id,
      timestamp: row.timestamp,
      deviceId: row.deviceId,
      value: row.value,
      raw: row.raw || undefined,
    }));
  }

  async getUnsyncedData(): Promise<BluetoothDataEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<{
      id: string;
      timestamp: number;
      deviceId: string;
      value: string;
      raw: string | null;
      synced: number;
    }>(
      `SELECT id, timestamp, device_id as deviceId, value, raw, synced
       FROM bluetooth_data
       WHERE synced = 0
       ORDER BY timestamp ASC`
    );

    return result.map((row) => ({
      id: row.id,
      timestamp: row.timestamp,
      deviceId: row.deviceId,
      value: row.value,
      raw: row.raw || undefined,
    }));
  }

  async markAsSynced(ids: string[]): Promise<void> {
    if (!this.db || ids.length === 0) return;

    const placeholders = ids.map(() => '?').join(',');
    await this.db.runAsync(
      `UPDATE bluetooth_data SET synced = 1 WHERE id IN (${placeholders})`,
      ids
    );
  }

  async deleteOldData(daysToKeep: number = 30): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;
    await this.db.runAsync(
      `DELETE FROM bluetooth_data WHERE timestamp < ?`,
      [cutoffTime]
    );
  }

  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM bluetooth_data');
  }

  async getTotalCount(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM bluetooth_data'
    );
    
    return result?.count || 0;
  }
}

export const databaseService = new DatabaseService();

