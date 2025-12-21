export interface ChatMessage {
  role: "user" | "model";
  parts: string;
}

export interface StreamChunk {
  text?: string;
  done?: boolean;
}

export interface ChatRecommendation {
  destinations: Array<{
    id: string;
    name: string;
    location: string;
    categories: any[];
    description: string;
    price: number;
    ratings: number;
  }>;
  itinerary: string;
  summary: string;
}

export interface ChatResponse {
  response: string;
  recommendations?: ChatRecommendation;
  timestamp: string;
}

