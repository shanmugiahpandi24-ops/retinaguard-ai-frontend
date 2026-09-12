import { useState, useEffect, useCallback } from 'react';
import { prediction } from '../services/prediction';
import { SystemHealth } from '../types/api';

export const useSystemHealth = (pollIntervalMs = 30000) => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = useCallback(async () => {
    try {
      const data = await prediction.getHealth();
      setHealth(data);
    } catch {
      setHealth({
        status: 'offline',
        dr_model_loaded: false,
        quality_model_loaded: false,
        database_connected: false,
        device: 'unavailable',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    if (pollIntervalMs > 0) {
      const timer = setInterval(checkHealth, pollIntervalMs);
      return () => clearInterval(timer);
    }
  }, [checkHealth, pollIntervalMs]);

  const isOnline = health?.status === 'healthy' || health?.status === 'online';

  return { health, loading, isOnline, refresh: checkHealth };
};
