export enum TripStyle {
  Adventure = 'Adventure',
  Relaxation = 'Relaxation',
  Cultural = 'Cultural',
  Party = 'Party',
  Family = 'Family',
  Business = 'Business'
}

export interface UserPreferences {
  style: TripStyle;
  groupSize: number;
  duration: number;
}

export interface Activity {
  time: string;
  title: string;
  location: string;
  description: string;
  category: 'Food' | 'Adventure' | 'Culture' | 'Relax' | 'Nightlife';
}

export interface DayPlan {
  day: number;
  theme: string;
  activities: Activity[];
}

export interface Itinerary {
  tripTitle: string;
  summary: string;
  estimatedCost: string;
  dailyItinerary: DayPlan[];
}
