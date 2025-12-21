export interface ChatMessage {
  role: "user" | "model";
  parts: string;
}

export interface StreamChunk {
  text?: string;
  done?: boolean;
}

export interface CategoryInfo {
  parent: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
}

export interface DestinationRecommendation {
  id: string;
  name: string;
  location: string;
  categories: CategoryInfo[];
  description: string;
  price: number;
  ratings: number;
  reason: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChatRecommendation {
  destinations: DestinationRecommendation[];
  itinerary: string;
  summary: string;
}

export interface ChatResponse {
  response: string;
  recommendations?: ChatRecommendation;
  timestamp: string;
}

