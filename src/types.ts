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
