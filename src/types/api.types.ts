/**
 * API Types for Kinxplore Frontend
 *
 * These types match the backend response structure
 */

export interface ParentCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: string;
  name: string;
  parent_category_id: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryInfo {
  parent: ParentCategory;
  subcategory?: Subcategory;
}

export interface Facility {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  category_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  location: string;
  latitude?: number; // Optional coordinates for map display
  longitude?: number; // Optional coordinates for map display
  category_id: string; // Legacy field - deprecated
  ratings: number;
  created_at: string;
  updated_at: string;
}

export interface DestinationWithCategories extends Destination {
  categories: CategoryInfo[];
  facilities?: Facility[];
  images?: DestinationImage[];
}

export interface ParentCategoryWithSubcategories extends ParentCategory {
  subcategories: Subcategory[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Filter types for destinations
export interface DestinationFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

// Destination Images
export interface DestinationImage {
  id: string;
  destination_id: string;
  url: string;
  sort_order: number;
  alt_text?: string;
  created_at: string;
}

// Trips / Circuits
export interface Trip {
  id: string;
  name: string;
  subtitle?: string;
  description?: string;
  duration: string;
  included_items: any[];
  program: any[];
  price_international: number;
  price_local: number;
  region: 'kinshasa' | 'kongo_central';
  image?: string;
  status: 'active' | 'inactive';
  sort_order: number;
  created_at: string;
  updated_at: string;
  destinations?: Array<{
    id: string;
    name: string;
    description?: string;
    image: string;
    location: string;
    price?: number;
    ratings?: number;
  }>;
}
