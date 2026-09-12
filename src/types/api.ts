export interface User {
  id?: number | string;
  email: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface QualityResult {
  status: 'GOOD' | 'POOR' | string;
  score: number;
}

export interface PredictionResult {
  class_name: string;
  class_id: number;
  confidence: number;
  probabilities: Record<string, number>;
  class?: string;
}

export interface ExplainabilityResult {
  method: string;
  heatmap_url: string;
  thermal_url?: string;
  vascular_url?: string;
}

export interface ConfidenceCalibration {
  raw_confidence: number;
  calibrated_confidence: number;
  entropy_score: number;
  expected_calibration_error: number;
  reliability_tier: string;
  temperature_parameter: number;
}

export interface PixelDensityMetrics {
  dpi: number;
  micron_per_pixel: number;
  vessel_density_pct: number;
  cup_to_disc_ratio: number;
  foveal_zone_intact?: boolean;
}

export interface LLMAnalysis {
  summary: string;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | string;
  differential_observation: string;
  recommendation: string;
}

export interface KaggleBenchmark {
  dataset: string;
  validation_qwk: number;
  benchmark_sensitivity: number;
  benchmark_specificity: number;
}

export interface PredictionEvaluation {
  predicted_class: string;
  confidence: number;
  margin: number;
  entropy: number;
  probs: Record<string, number>;
  is_uncertain: boolean;
}

export interface PredictionResponse {
  success: boolean;
  assessment_id?: string;
  user_email?: string;
  user_name?: string;
  prediction_status: 'PREDICTED' | 'UNCERTAIN' | 'REJECTED' | 'ERROR' | string;
  reason?: string;
  message?: string;
  prediction?: PredictionResult;
  evaluation?: PredictionEvaluation;
  quality?: QualityResult;
  explainability?: ExplainabilityResult;
  confidence_calibration?: ConfidenceCalibration;
  pixel_density_metrics?: PixelDensityMetrics;
  llm_analysis?: LLMAnalysis;
  kaggle_benchmark?: KaggleBenchmark;
  demo_mode?: boolean;
  created_at?: string;
  processing_info?: {
    device?: string;
    inference_time_ms?: number;
  };
}

export type AssessmentResponse = PredictionResponse;
export type QualityAssessment = QualityResult;

export interface ReportSummaryItem {
  assessment_id: string;
  date: string;
  severity: string | null;
  confidence: number | null;
  quality_status: string;
  quality_score: number;
  user_email?: string;
  user_name?: string;
}

export interface ReportsListResponse {
  success: boolean;
  reports: ReportSummaryItem[];
}

export interface SystemHealth {
  status: string;
  service?: string;
  dr_model_loaded?: boolean;
  quality_model_loaded?: boolean;
  database_connected?: boolean;
  device?: string;
  model_architecture?: string;
  model_version?: string;
}

export interface ModelInfoResponse {
  architecture: string;
  classes: string[];
  num_classes: number;
  device: string;
  model_loaded: boolean;
}

export interface SupportChatRequest {
  message: string;
}

export interface SupportChatResponse {
  success: boolean;
  reply: string;
  category: string;
}

export type SupportMessageResponse = SupportChatResponse;

