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
