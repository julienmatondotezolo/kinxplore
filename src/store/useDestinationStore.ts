/**
 * Zustand Store for Destinations and Categories
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { DestinationWithCategories, ParentCategoryWithSubcategories } from "@/types/api.types";

interface DestinationStore {
  // Data
  destinations: DestinationWithCategories[];
  categories: ParentCategoryWithSubcategories[];

  // Filters
  activeCategory: string;
  searchQuery: string;
  priceRange: { min: number; max: number };
  selectedRating: number | null;
  selectedAmenities: string[];

  // Hero Search Criteria
  heroSearch: {
    destination: string;
    duration: number;
    tripStyle: string;
  } | null;

  // Pagination
  currentPage: number;
  pageSize: number;

  // View Mode
  viewMode: "grid" | "list";

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  setDestinations: (destinations: DestinationWithCategories[]) => void;
  setCategories: (categories: ParentCategoryWithSubcategories[]) => void;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setPriceRange: (range: { min: number; max: number }) => void;
  setSelectedRating: (rating: number | null) => void;
  setSelectedAmenities: (amenities: string[]) => void;
  setHeroSearch: (search: { destination: string; duration: number; tripStyle: string } | null) => void;
  setCurrentPage: (page: number) => void;
  setViewMode: (mode: "grid" | "list") => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed/Helper functions
  getFilteredDestinations: () => DestinationWithCategories[];
  getPaginatedDestinations: () => DestinationWithCategories[];
  getCategoryList: () => string[];
  getTotalCount: () => number;
  getCountByCategory: (category: string) => number;
  getTotalPages: () => number;
  resetFilters: () => void;
}

export const useDestinationStore = create<DestinationStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        destinations: [],
        categories: [],
        activeCategory: "all",
        searchQuery: "",
        priceRange: { min: 0, max: 10000 },
        selectedRating: null,
        selectedAmenities: [],
        heroSearch: null,
        currentPage: 1,
        pageSize: 10,
        viewMode: "grid",
        isLoading: false,
        error: null,

        // Actions
        setDestinations: (destinations) => set({ destinations }, false, "setDestinations"),

        setCategories: (categories) => set({ categories }, false, "setCategories"),

        setActiveCategory: (category) => set({ activeCategory: category, currentPage: 1 }, false, "setActiveCategory"),

        setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }, false, "setSearchQuery"),

        setPriceRange: (range) => set({ priceRange: range, currentPage: 1 }, false, "setPriceRange"),

        setSelectedRating: (rating) => set({ selectedRating: rating, currentPage: 1 }, false, "setSelectedRating"),

        setSelectedAmenities: (amenities) => set({ selectedAmenities: amenities, currentPage: 1 }, false, "setSelectedAmenities"),

        setHeroSearch: (search) => set({ heroSearch: search }, false, "setHeroSearch"),

        setCurrentPage: (page) => set({ currentPage: page }, false, "setCurrentPage"),

        setViewMode: (mode) => set({ viewMode: mode }, false, "setViewMode"),

        setLoading: (loading) => set({ isLoading: loading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),

        // Computed functions
        getFilteredDestinations: () => {
          const { destinations, activeCategory, searchQuery, priceRange, selectedRating, selectedAmenities } = get();

          // Leisure is a virtual category grouping multiple parent categories
          const leisureCategories = ["bar", "café", "lounge", "parc", "nature", "musée", "centre culturel"];

          let filtered = [...destinations];

          // Filter by category
          if (activeCategory === "loisirs") {
            filtered = filtered.filter((dest) =>
              dest.categories.some((cat) =>
                leisureCategories.includes(cat.parent.name.toLowerCase()),
              ),
            );
          } else if (activeCategory !== "all") {
            filtered = filtered.filter((dest) =>
              dest.categories.some((cat) => cat.parent.name.toLowerCase() === activeCategory.toLowerCase()),
            );
          }

          // Filter by search query
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
              (dest) =>
                dest.name.toLowerCase().includes(query) ||
                (dest.location && dest.location.toLowerCase().includes(query)) ||
                dest.description.toLowerCase().includes(query),
            );
          }

          // Filter by price range
          filtered = filtered.filter((dest) => dest.price >= priceRange.min && dest.price <= priceRange.max);

          // Filter by rating
          if (selectedRating !== null) {
            filtered = filtered.filter((dest) => dest.ratings >= selectedRating);
          }

          // Filter by amenities (if destination has amenities field)
          // Note: This assumes destinations have an amenities array field
          // If not present in your data model, this filter will be skipped
          if (selectedAmenities.length > 0) {
            filtered = filtered.filter((dest) => {
              // Check if destination has amenities field
              const destAmenities = (dest as any).amenities;
              if (!destAmenities || !Array.isArray(destAmenities)) {
                return false; // Skip destinations without amenities
              }
              // Check if destination has all selected amenities
              return selectedAmenities.every((amenity) =>
                destAmenities.some((a: string) => a.toLowerCase() === amenity.toLowerCase())
              );
            });
          }

          return filtered;
        },

        getPaginatedDestinations: () => {
          const filtered = get().getFilteredDestinations();
          const { currentPage, pageSize } = get();
          const start = (currentPage - 1) * pageSize;
          const end = start + pageSize;
          return filtered.slice(start, end);
        },

        getCategoryList: () => {
          const { categories } = get();
          if (!categories || categories.length === 0) return ["all"];
          return ["all", ...categories.map((cat) => cat.name.toLowerCase())];
        },

        getTotalCount: () => get().destinations.length,

        getCountByCategory: (category) => {
          const { destinations } = get();
          if (category === "all") return destinations.length;
          return destinations.filter((dest) =>
            dest.categories.some((cat) => cat.parent.name.toLowerCase() === category.toLowerCase()),
          ).length;
        },

        getTotalPages: () => {
          const filtered = get().getFilteredDestinations();
          return Math.ceil(filtered.length / get().pageSize);
        },

        resetFilters: () =>
          set(
            {
              activeCategory: "all",
              searchQuery: "",
              priceRange: { min: 0, max: 10000 },
              selectedRating: null,
              selectedAmenities: [],
              currentPage: 1,
              heroSearch: null,
            },
            false,
            "resetFilters",
          ),
      }),
      {
        name: "destination-storage",
        partialize: (state) => ({
          // Only persist filters and view mode, not the data
          activeCategory: state.activeCategory,
          searchQuery: state.searchQuery,
          priceRange: state.priceRange,
          selectedRating: state.selectedRating,
          selectedAmenities: state.selectedAmenities,
          viewMode: state.viewMode,
          heroSearch: state.heroSearch,
        }),
      },
    ),
  ),
);
