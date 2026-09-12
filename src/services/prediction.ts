import { api } from './api';
import { PredictionResponse, SystemHealth, ModelInfoResponse } from '../types/api';

export const predictionService = {
  async predict(file: File): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getHealth(): Promise<SystemHealth> {
    try {
      const res = await api.get('/health');
      return res.data;
    } catch {
      return {
        status: 'offline',
        dr_model_loaded: false,
        quality_model_loaded: false,
        database_connected: false,
        device: 'unavailable',
      };
    }
  },

  async getModelInfo(): Promise<ModelInfoResponse | null> {
    try {
      const res = await api.get('/model-info');
      return res.data;
    } catch {
      return null;
    }
  },
};

export const prediction = predictionService;
