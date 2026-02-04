/**
 * PregAI API Service
 * Connects React frontend to Python Flask backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('pregai_token', token);
  } else {
    localStorage.removeItem('pregai_token');
  }
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('pregai_token');
  }
  return authToken;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type for JSON requests (not FormData)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }

  return data;
}

// ============ AUTH ENDPOINTS ============

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    avatar_url?: string;
  };
}

export interface SignupResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const data = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAuthToken(data.access_token);
  return data;
}

export async function signup(email: string, password: string, name: string): Promise<SignupResponse> {
  const data = await apiRequest<SignupResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  setAuthToken(data.access_token);
  return data;
}

export async function getCurrentUser() {
  return apiRequest<{ user: LoginResponse['user'] }>('/auth/me');
}

export async function updateProfile(data: { name?: string; avatar_url?: string }) {
  return apiRequest<{ user: LoginResponse['user'] }>('/auth/update-profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function logout() {
  setAuthToken(null);
}

// ============ BRAIN TUMOR PREDICTION ============

export interface BrainTumorInput {
  age: number;
  gestationalWeek: number;
  symptoms: string;
  medicalHistory: string;
  image?: File;
}

export interface BrainTumorResult {
  prediction: string;
  confidence: number;
  has_tumor: boolean;
  tumor_type: string | null;
  pregnancy_risk_level: string;
  pregnancy_risk_factors: string[];
  recommendations: string[];
  disclaimer: string;
}

export async function predictBrainTumor(input: BrainTumorInput): Promise<BrainTumorResult> {
  const formData = new FormData();
  
  if (input.image) {
    formData.append('image', input.image);
  }
  formData.append('age', input.age.toString());
  formData.append('gestationalWeek', input.gestationalWeek.toString());
  formData.append('symptoms', input.symptoms);
  formData.append('medicalHistory', input.medicalHistory);

  return apiRequest<BrainTumorResult>('/predict/brain-tumor', {
    method: 'POST',
    body: formData,
  });
}

// ============ FETAL HEALTH PREDICTION ============

export interface FetalHealthInput {
  baseline_value: number;
  accelerations: number;
  fetal_movement: number;
  uterine_contractions: number;
  light_decelerations: number;
  severe_decelerations: number;
  prolongued_decelerations: number;
  abnormal_short_term_variability: number;
  mean_value_of_short_term_variability: number;
  percentage_of_time_with_abnormal_long_term_variability: number;
  mean_value_of_long_term_variability: number;
  histogram_width: number;
  histogram_min: number;
  histogram_max: number;
  histogram_number_of_peaks: number;
  histogram_number_of_zeroes: number;
  histogram_mode: number;
  histogram_mean: number;
  histogram_median: number;
  histogram_variance: number;
  histogram_tendency: number;
}

export interface FetalHealthResult {
  prediction: 'Normal' | 'Suspect' | 'Pathological';
  confidence: number;
  risk_level: string;
  analysis: {
    heart_rate_assessment: string;
    variability_assessment: string;
    deceleration_assessment: string;
    overall_assessment: string;
  };
  recommendations: string[];
  disclaimer: string;
}

export async function predictFetalHealth(input: FetalHealthInput): Promise<FetalHealthResult> {
  return apiRequest<FetalHealthResult>('/predict/fetal-health', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// ============ PREGNANCY RISK PREDICTION ============

export interface PregnancyRiskInput {
  age: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  blood_sugar: number;
  body_temperature: number;
  heart_rate: number;
}

export interface PregnancyRiskResult {
  prediction: 'Low Risk' | 'Mid Risk' | 'High Risk';
  confidence: number;
  risk_score: number;
  risk_factors: Array<{ factor: string; status: string; contribution: string }>;
  vital_signs_analysis: {
    blood_pressure: string;
    blood_sugar: string;
    heart_rate: string;
    temperature: string;
  };
  recommendations: string[];
  disclaimer: string;
}

export async function predictPregnancyRisk(input: PregnancyRiskInput): Promise<PregnancyRiskResult> {
  return apiRequest<PregnancyRiskResult>('/predict/pregnancy-risk', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// ============ CHATBOT ============

export interface ChatMessage {
  message: string;
  context?: string;
}

export interface ChatResponse {
  response: string;
  category: string;
  confidence: number;
  related_topics: string[];
  disclaimer: string;
}

export async function sendChatMessage(message: string, context?: string): Promise<ChatResponse> {
  return apiRequest<ChatResponse>('/chatbot/message', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  });
}

export interface ChatSuggestion {
  text: string;
  category: string;
}

export async function getChatSuggestions(): Promise<{ suggestions: ChatSuggestion[] }> {
  return apiRequest<{ suggestions: ChatSuggestion[] }>('/chatbot/suggestions');
}

// ============ PREDICTION HISTORY ============

export interface PredictionHistoryItem {
  id: number;
  prediction_type: string;
  input_data: Record<string, unknown>;
  result: Record<string, unknown>;
  confidence: number;
  created_at: string;
}

export async function getPredictionHistory(type?: string): Promise<{ history: PredictionHistoryItem[] }> {
  const endpoint = type ? `/predict/history?type=${type}` : '/predict/history';
  return apiRequest<{ history: PredictionHistoryItem[] }>(endpoint);
}
