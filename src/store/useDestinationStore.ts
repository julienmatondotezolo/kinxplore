/**
 * Zustand Store for Destinations and Categories
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  DestinationWithCategories,
  ParentCategoryWithSubcategories,
} from "@/types/api.types";

interface DestinationStore {
  // Data
  destinations: DestinationWithCategories[];
  categories: ParentCategoryWithSubcategories[];
  
  // Filters
  activeCategory: string;
  searchQuery: string;
  priceRange: { min: number; max: number };
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setDestinations: (destinations: DestinationWithCategories[]) => void;
  setCategories: (categories: ParentCategoryWithSubcategories[]) => void;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setPriceRange: (range: { min: number; max: number }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed/Helper functions
  getFilteredDestinations: () => DestinationWithCategories[];
  getCategoryList: () => string[];
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
        isLoading: false,
        error: null,

        // Actions
        setDestinations: (destinations) =>
          set({ destinations }, false, "setDestinations"),

        setCategories: (categories) =>
          set({ categories }, false, "setCategories"),

        setActiveCategory: (category) =>
          set({ activeCategory: category }, false, "setActiveCategory"),

        setSearchQuery: (query) =>
          set({ searchQuery: query }, false, "setSearchQuery"),

        setPriceRange: (range) =>
          set({ priceRange: range }, false, "setPriceRange"),

        setLoading: (loading) =>
          set({ isLoading: loading }, false, "setLoading"),

        setError: (error) =>
          set({ error }, false, "setError"),

        // Computed functions
        getFilteredDestinations: () => {
          const {
            destinations,
            activeCategory,
            searchQuery,
            priceRange,
          } = get();

          let filtered = [...destinations];

          // Filter by category
          if (activeCategory !== "all") {
            filtered = filtered.filter((dest) =>
              dest.categories.some(
                (cat) =>
                  cat.parent.name.toLowerCase() === activeCategory.toLowerCase()
              )
            );
          }

          // Filter by search query
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
              (dest) =>
                dest.name.toLowerCase().includes(query) ||
                dest.location.toLowerCase().includes(query) ||
                dest.description.toLowerCase().includes(query)
            );
          }

          // Filter by price range
          filtered = filtered.filter(
            (dest) =>
              dest.price >= priceRange.min && dest.price <= priceRange.max
          );

          return filtered;
        },

        getCategoryList: () => {
          const { categories } = get();
          if (!categories || categories.length === 0) return ["all"];
          return ["all", ...categories.map((cat) => cat.name.toLowerCase())];
        },

        resetFilters: () =>
          set(
            {
              activeCategory: "all",
              searchQuery: "",
              priceRange: { min: 0, max: 10000 },
            },
            false,
            "resetFilters"
          ),
      }),
      {
        name: "destination-storage",
        partialize: (state) => ({
          // Only persist filters, not the data
          activeCategory: state.activeCategory,
          searchQuery: state.searchQuery,
          priceRange: state.priceRange,
        }),
      }
    )
  )
);
