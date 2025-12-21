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
        heroSearch: null,
        currentPage: 1,
        pageSize: 10,
        viewMode: "grid",
        isLoading: false,
        error: null,

        // Actions
        setDestinations: (destinations) =>
          set({ destinations }, false, "setDestinations"),

        setCategories: (categories) =>
          set({ categories }, false, "setCategories"),

        setActiveCategory: (category) =>
          set({ activeCategory: category, currentPage: 1 }, false, "setActiveCategory"),

        setSearchQuery: (query) =>
          set({ searchQuery: query, currentPage: 1 }, false, "setSearchQuery"),

        setPriceRange: (range) =>
          set({ priceRange: range, currentPage: 1 }, false, "setPriceRange"),

        setHeroSearch: (search) =>
          set({ heroSearch: search }, false, "setHeroSearch"),

        setCurrentPage: (page) =>
          set({ currentPage: page }, false, "setCurrentPage"),

        setViewMode: (mode) =>
          set({ viewMode: mode }, false, "setViewMode"),

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
            dest.categories.some(
              (cat) => cat.parent.name.toLowerCase() === category.toLowerCase()
            )
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
              currentPage: 1,
            },
            false,
            "resetFilters"
          ),
      }),
      {
        name: "destination-storage",
        partialize: (state) => ({
          // Only persist filters and view mode, not the data
          activeCategory: state.activeCategory,
          searchQuery: state.searchQuery,
          priceRange: state.priceRange,
          viewMode: state.viewMode,
          heroSearch: state.heroSearch,
        }),
      }
    )
  )
);




