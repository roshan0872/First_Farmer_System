export type Language = 'en' | 'ta' | 'hi';

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'student' | 'admin';
  preferred_language: Language;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Crop {
  id: number;
  name: string;
  scientific_name?: string;
  category: string;
  description: string;
  suitable_regions: string;
  soil_requirements: string;
  climate_requirements: string;
  season: string;
  water_requirement: string;
  difficulty_level: string;
  image_path?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CultivationGuide {
  id: number;
  crop_id: number;
  land_preparation: string;
  seed_selection: string;
  sowing_method: string;
  irrigation: string;
  nutrient_management: string;
  weed_management: string;
  growth_stages: string;
  beginner_mistakes?: string;
}

export interface PestDisease {
  id: number;
  crop_id: number;
  name: string;
  type: 'Pest' | 'Disease';
  symptoms: string;
  conditions: string;
  prevention: string;
  management: string;
  source_reference?: string;
  last_reviewed_at?: string;
}

export interface HarvestGuide {
  id: number;
  crop_id: number;
  maturity_indicators: string;
  approximate_harvest_period: string;
  harvesting_method: string;
  handling_precautions: string;
  storage_preparation: string;
}

export interface PostHarvestGuide {
  id: number;
  crop_id: number;
  cleaning_and_grading: string;
  storage_method: string;
  preservation_method: string;
  processing_method: string;
  packaging_method: string;
  food_uses: string;
  industrial_uses: string;
  by_products: string;
}

export interface CropProduct {
  id: number;
  crop_id: number;
  product_name: string;
  product_category: string;
  raw_material: string;
  processing_overview: string;
  common_uses: string;
  storage_considerations: string;
  potential_value_addition: string;
}

export interface CropDetail extends Crop {
  cultivation_guide?: CultivationGuide;
  pest_diseases: PestDisease[];
  harvest_guide?: HarvestGuide;
  post_harvest_guide?: PostHarvestGuide;
  products: CropProduct[];
}

export interface RecommendationRequest {
  region: string;
  soil_type: string;
  season: string;
  water_availability: string;
  temperature?: number;
  rainfall?: number;
  preferred_category?: string;
}

export interface RecommendationMatch {
  crop: Crop;
  match_score: number;
  match_level: string;
  matched_criteria: string[];
  unmet_or_partial_criteria: string[];
  explanation: string;
  limitations: string[];
}

export interface RecommendationResponse {
  input_summary: Record<string, any>;
  total_crops_evaluated: number;
  matches: RecommendationMatch[];
  educational_disclaimer: string;
}

export interface Bookmark {
  id: number;
  user_id: number;
  crop_id: number;
  created_at: string;
  crop?: Crop;
}

export interface LearningProgress {
  id: number;
  user_id: number;
  crop_id?: number;
  module_name: string;
  completion_status: 'in_progress' | 'completed';
  progress_percentage: number;
  last_accessed_at: string;
  crop?: Crop;
}

export interface DashboardStats {
  total_crops_in_library: number;
  saved_crops_count: number;
  completed_modules_count: number;
  in_progress_modules_count: number;
  overall_progress_percentage: number;
}

export interface WeatherForecastItem {
  time: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  rainfall_prob: number;
}

export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  precipitation: number;
  condition: string;
  icon: string;
  agricultural_advisory: string;
  provider: string;
  updated_at: string;
  is_sample_data: boolean;
  notice_message?: string;
  forecast: WeatherForecastItem[];
}

export interface RelatedLink {
  title: string;
  url: string;
}

export interface ChatResponse {
  reply: string;
  conversation_id: string;
  matched_topic?: string;
  related_links: RelatedLink[];
  is_ai_generated: boolean;
  source_attribution: string;
}

export interface ChatMessageItem {
  id?: string | number;
  role: 'user' | 'assistant';
  message_text: string;
  created_at?: string;
  related_links?: RelatedLink[];
  source_attribution?: string;
}

export interface AdminStats {
  total_users: number;
  total_crops: number;
  total_pests_diseases: number;
  total_products: number;
  total_bookmarks: number;
  total_learning_records: number;
  recent_users: Array<{
    id: number;
    full_name: string;
    email: string;
    role: string;
    preferred_language: string;
    created_at: string;
  }>;
}
