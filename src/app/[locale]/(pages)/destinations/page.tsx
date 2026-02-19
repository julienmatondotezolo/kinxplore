"use client";

import {
  Bed,
  Building2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Home,
  Hotel,
  Leaf,
  List,
  Map as MapIcon,
  Mountain,
  Palmtree,
  SlidersHorizontal,
  Star,
  Users,
  Warehouse,
  Waves,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";

import { DestinationSearch } from "@/components/DestinationSearch";
import { Footer } from "@/components/Footer";
import { MapView } from "@/components/MapView";
import { Navigation } from "@/components/Navigation";
import { useCategories } from "@/hooks/useCategories";
import { useDestinations } from "@/hooks/useDestinations";
import { generateGridCoordinates, getNeighborhoodCoordinates } from "@/lib/geocoding";
import { Link, useRouter } from "@/navigation";
import { useDestinationStore } from "@/store/useDestinationStore";

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactNode> = {
  all: <Compass size={24} />,
  resort: <Palmtree size={24} />,
  villa: <Home size={24} />,
  hotel: <Building2 size={24} />,
  cottage: <Warehouse size={24} />,
  homestay: <Users size={24} />,
  guesthouse: <Bed size={24} />,
  ecoLodge: <Leaf size={24} />,
  beach: <Waves size={24} />,
  nature: <Mountain size={24} />,
  luxury: <Hotel size={24} />,
};

export default function DestinationsPage() {
  const t = useTranslations("Destinations");
  const tRestaurants = useTranslations("Restaurants");
  const tHotels = useTranslations("Hotels");
  const tLoisirs = useTranslations("Loisirs");
  const locale = useLocale(); // Get current locale
  const [showMap, setShowMap] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);

  // Fetch data from backend using React Query
  const { data: destinations, isLoading: isLoadingDestinations, error: destinationsError } = useDestinations();
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories();

  // Zustand store
  const {
    activeCategory,
    searchQuery,
    currentPage,
    pageSize,
    priceRange,
    selectedRating,
    selectedAmenities,
    setActiveCategory,
    setDestinations,
    setCategories,
    setPriceRange,
    setSelectedRating,
    setSelectedAmenities,
    getFilteredDestinations,
    getPaginatedDestinations,
    getCategoryList,
    getTotalCount,
    getCountByCategory,
    getTotalPages,
    setCurrentPage,
    viewMode,
    setViewMode,
    resetFilters,
  } = useDestinationStore();

  const router = useRouter();

  // Sections that should hide the category bar and show a custom title
  const sectionCategories = ["restaurant", "loisirs", "hotel"];
  const isSectionView = sectionCategories.includes(activeCategory);

  // Note: We no longer reset filters on mount because the navbar
  // pre-sets the category filter before navigating here.

  // Reset to grid view when hiding map
  const handleToggleMap = () => {
    if (showMap) {
      // When going back to list view (hiding map), set to grid
      setViewMode("grid");
    }
    setShowMap(!showMap);
  };

  // Update store when data is fetched
  useEffect(() => {
    if (destinations) {
      setDestinations(destinations);
    }
  }, [destinations, setDestinations]);

  useEffect(() => {
    if (categories) {
      setCategories(categories);
    }
  }, [categories, setCategories]);

  // Get data from store
  const filteredDestinations = getFilteredDestinations();
  const paginatedDestinations = getPaginatedDestinations();
  const categoryList = getCategoryList();
  const totalCount = getTotalCount();
  const filteredCount = filteredDestinations.length;
  const totalPages = getTotalPages();

  // Memoize map locations to avoid Math.random() being called during render
  const mapLocations = useMemo(
    () =>
      paginatedDestinations.map((dest, index) => {
        // Try to get coordinates in this order:
        // 1. Use database coordinates if available
        // 2. Try to match neighborhood from address
        // 3. Fall back to grid pattern

        let lat: number, lng: number;

        if (dest.latitude && dest.longitude) {
          // Use actual coordinates from database
          lat = dest.latitude;
          lng = dest.longitude;
        } else {
          // Try to match neighborhood from address
          const neighborhoodCoords = getNeighborhoodCoordinates(dest.location);

          if (neighborhoodCoords) {
            // Add small random offset to avoid exact overlap (stable per destination)
            const seed = dest.id; // Use destination ID as seed for consistent positioning
            const hashCode = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const pseudoRandom = (hashCode % 1000) / 1000; // Generate pseudo-random value between 0-1
            lat = neighborhoodCoords.lat + (pseudoRandom - 0.5) * 0.005;
            lng = neighborhoodCoords.lng + (pseudoRandom - 0.5) * 0.005;
          } else {
            // Use grid pattern as final fallback
            const gridCoords = generateGridCoordinates(index, paginatedDestinations.length);
            lat = gridCoords.lat;
            lng = gridCoords.lng;
          }
        }

        return {
          id: dest.id,
          name: dest.name,
          price: dest.price,
          address: dest.location,
          lat,
          lng,
        };
      }),
    [paginatedDestinations],
  );

  // Loading state
  if (isLoadingDestinations || isLoadingCategories) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">{t("loading")}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (destinationsError || categoriesError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">
            {destinationsError?.message || categoriesError?.message || "Failed to load destinations"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navigation />

      <main className="pt-24 pb-24 relative z-10">
        {/* Animated Background Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-pink-400/15 to-orange-400/15 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1000ms" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-yellow-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "500ms" }}
          />

          {/* Floating decorative shapes */}
          <div className="absolute top-20 left-[10%] w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl rotate-12 animate-float" />
          <div
            className="absolute bottom-40 right-[15%] w-16 h-16 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full animate-float"
            style={{ animationDelay: "2000ms" }}
          />
        </div>

        {/* Title Section - Desktop */}
        <div className="hidden md:block max-w-[2520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 mb-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                {isSectionView
                  ? activeCategory === "restaurant"
                    ? tRestaurants("title")
                    : activeCategory === "hotel"
                      ? tHotels("title")
                      : tLoisirs("title")
                  : searchQuery.trim() !== ""
                    ? t("searchResults", { count: filteredCount, query: searchQuery })
                    : activeCategory === "all"
                      ? t("title", { count: totalCount })
                      : t("titleWithCategory", { count: getCountByCategory(activeCategory), category: activeCategory })}
              </h1>
              <p className="text-gray-500 text-lg font-light">
                {isSectionView
                  ? activeCategory === "restaurant"
                    ? tRestaurants("subtitle")
                    : activeCategory === "hotel"
                      ? tHotels("subtitle")
                      : tLoisirs("subtitle")
                  : activeCategory === "all" ? t("subtitle") : t("subtitleCategory", { category: activeCategory })}
              </p>
            </div>
            <DestinationSearch />
          </div>
        </div>

        {/* Mobile Title Section */}
        <div className="md:hidden max-w-[2520px] mx-auto px-4 mb-6 relative z-10">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
            {isSectionView
              ? activeCategory === "restaurant"
                ? tRestaurants("title")
                : activeCategory === "hotel"
                  ? tHotels("title")
                  : tLoisirs("title")
              : searchQuery.trim() !== ""
                ? t("searchResults", { count: filteredCount, query: searchQuery }).split(" pour ")[0].split(" for ")[0]
                : activeCategory === "all"
                  ? t("title", { count: totalCount }).split(" à Kinshasa")[0].split(" in Kinshasa")[0]
                  : t("titleWithCategory", { count: getCountByCategory(activeCategory), category: activeCategory })
                      .split(" à Kinshasa")[0]
                      .split(" in Kinshasa")[0]}
          </h1>
          <p className="text-gray-500 text-sm font-light">
            {isSectionView
              ? activeCategory === "restaurant"
                ? tRestaurants("subtitle")
                : activeCategory === "hotel"
                  ? tHotels("subtitle")
                  : tLoisirs("subtitle")
              : searchQuery.trim() !== ""
                ? `${t("searchPlaceholder").includes("Rechercher") ? "pour" : "for"} \u201c${searchQuery}\u201d`
                : searchQuery.trim() === ""
                  ? (t("title", { count: 0 }).includes("à Kinshasa") ? "à Kinshasa" : "in Kinshasa")
                  : null}
          </p>
        </div>


        {/* Mobile Search Bar */}
        <div className="md:hidden sticky top-[72px] z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <DestinationSearch />
              </div>
              {/* Filters Button - Hidden */}
              {/* <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 hover:border-blue-600 transition-all bg-white shrink-0"
              >
                <SlidersHorizontal size={18} className="text-blue-600" />
                <span className="text-sm font-bold">{t("filters")}</span>
              </button> */}
            </div>

            {/* Active Filters - Mobile (Inside sticky bar) */}
            {(activeCategory !== "all" || searchQuery.trim() !== "") && (
              <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                {activeCategory !== "all" && (
                  <button
                    onClick={() => setActiveCategory("all")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-600 hover:bg-blue-100 transition-all"
                  >
                    <span className="capitalize">{activeCategory}</span>
                    <X size={12} />
                  </button>
                )}

                {searchQuery.trim() !== "" && (
                  <button
                    onClick={() => useDestinationStore.getState().setSearchQuery("")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-600 hover:bg-blue-100 transition-all"
                  >
                    <span className="max-w-[120px] truncate">&ldquo;{searchQuery}&rdquo;</span>
                    <X size={12} />
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveCategory("all");
                    useDestinationStore.getState().setSearchQuery("");
                  }}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors ml-auto"
                >
                  {t("clearAll")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Header - Airbnb Style (hidden for section views) */}
        <div className={`${isSectionView ? "hidden" : "hidden md:block"} sticky top-[72px] z-50 bg-white/80 backdrop-blur-md border-b border-blue-100/50 shadow-sm mb-6`}>
          <div className="max-w-[2520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 flex items-center gap-6">
            {/* Horizontal Scrollable Categories */}
            <div className="flex-1 overflow-x-auto scrollbar-none py-4 flex items-center gap-10 md:gap-14">
              {categoryList.map((cat) => {
                const count = getCountByCategory(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex flex-col items-center gap-3 group transition-all duration-200 min-w-fit border-b-2 pb-4 pt-2 relative ${
                      activeCategory === cat
                        ? "border-blue-600 text-blue-600 opacity-100"
                        : "border-transparent text-gray-400 opacity-70 hover:opacity-100 hover:border-blue-200"
                    }`}
                  >
                    <div
                      className={`transition-transform duration-200 group-hover:scale-110 ${activeCategory === cat ? "scale-110" : ""}`}
                    >
                      {categoryIcons[cat.toLowerCase()] || <Compass size={24} />}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-semibold capitalize whitespace-nowrap">{cat}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          activeCategory === cat ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Filters Button - Hidden */}
            {/* <div className="hidden md:flex items-center shrink-0">
              <button 
                onClick={() => setShowDesktopFilters(true)}
                className="flex items-center gap-2.5 border border-blue-200 rounded-xl px-5 py-3.5 hover:border-blue-600 hover:bg-blue-50 transition-all group shadow-sm bg-white"
              >
                <SlidersHorizontal size={18} className="group-hover:scale-110 transition-transform text-blue-600" />
                <span className="text-sm font-bold text-gray-900">{t("filters")}</span>
              </button>
            </div> */}
          </div>
        </div>

        {/* Active Filters - Desktop */}
        {(activeCategory !== "all" || searchQuery.trim() !== "") && (
          <div className="hidden md:block max-w-[2520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 mb-8">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t("activeFilters")}</span>

              {activeCategory !== "all" && (
                <button
                  onClick={() => setActiveCategory("all")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-bold text-blue-600 hover:bg-blue-100 transition-all group"
                >
                  <span className="capitalize">{activeCategory}</span>
                  <X size={14} className="group-hover:scale-110 transition-transform" />
                </button>
              )}

              {searchQuery.trim() !== "" && (
                <button
                  onClick={() => useDestinationStore.getState().setSearchQuery("")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-bold text-blue-600 hover:bg-blue-100 transition-all group"
                >
                  <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                  <X size={14} className="group-hover:scale-110 transition-transform" />
                </button>
              )}

              <button
                onClick={() => {
                  setActiveCategory("all");
                  useDestinationStore.getState().setSearchQuery("");
                }}
                className="text-sm font-bold text-gray-400 hover:text-gray-600 underline underline-offset-4 transition-colors"
              >
                {t("clearAll")}
              </button>
            </div>
          </div>
        )}

        <div className={`max-w-[2520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16`}>
          <div
            className={`flex flex-col lg:flex-row gap-10 ${showMap ? "lg:h-[calc(100vh-220px)] overflow-hidden" : ""}`}
          >
            {/* List / Grid Section */}
            <div
              className={`${showMap ? "lg:w-[60%] lg:overflow-y-auto lg:pr-6 scrollbar-thin" : "w-full"} mb-32 md:mb-0`}
            >
              {/* View Mode Toggle - Only shown when map is visible */}
              {showMap && (
                <div className="flex items-center justify-end mb-6">
                  <div className="flex items-center border border-blue-200 rounded-xl p-1 bg-blue-50/50">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                        viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-400 hover:text-blue-600"
                      }`}
                    >
                      <List size={16} />
                      <span>{t("listView")}</span>
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                        viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-400 hover:text-blue-600"
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
                        <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
                        <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
                        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <span>{t("gridView")}</span>
                    </button>
                  </div>
                </div>
              )}

              {paginatedDestinations.length === 0 ? (
                <div className="text-center py-32 bg-blue-50/50 rounded-3xl border-2 border-dashed border-blue-200">
                  <Compass size={64} className="mx-auto text-blue-300 mb-6 stroke-[1.5]" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{t("noResults")}</h3>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto">{t("noResultsDesc")}</p>
                  <button
                    onClick={() => setActiveCategory("all")}
                    className="bg-blue-600 text-white px-10 py-3.5 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl active:scale-95"
                  >
                    {t("showAllDestinations")}
                  </button>
                </div>
              ) : (
                <div className="space-y-12">
                  <div
                    className={
                      viewMode === "grid"
                        ? `grid grid-cols-1 sm:grid-cols-2 ${showMap ? "xl:grid-cols-2" : "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"} gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10`
                        : "flex flex-col gap-8"
                    }
                  >
                    {paginatedDestinations.map((dest) => (
                      <Link
                        key={dest.id}
                        href={`/destinations/${dest.id}`}
                        className={`group cursor-pointer flex ${viewMode === "grid" ? "flex-col gap-4" : "flex-row gap-6 border-b border-gray-100 pb-8"}`}
                      >
                        <div
                          className={`relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm shrink-0 ${viewMode === "grid" ? "aspect-square w-full" : "w-48 h-48 md:w-64 md:h-64"}`}
                        >
                          <img
                            src={dest.image || `https://picsum.photos/800/800?random=${dest.id}`}
                            alt={dest.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />

                          {/* Heart Icon */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Toggle favorite logic here
                            }}
                            className="absolute top-4 right-4 p-2.5 text-white/90 hover:text-red-500 transition-colors drop-shadow-md z-10"
                          >
                            <svg viewBox="0 0 32 32" className="w-6 h-6 fill-black/30 stroke-white stroke-[2.5px]">
                              <path d="M16 28c7-4.73 14-10 14-17.08 0-3.17-2.5-6.92-7-6.92-2.38 0-4.7 1.55-7 3.75-2.3-2.2-4.62-3.75-7-3.75-4.5 0-7 3.75-7 6.92 0 7.08 7 12.35 14 17.08z" />
                            </svg>
                          </button>

                          {/* Tag */}
                          <div className="absolute top-4 left-4 bg-blue-600 backdrop-blur-sm px-3.5 py-1.5 rounded-lg shadow-sm">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                              {dest.categories?.[0]?.parent?.name || "Featured"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col flex-1 gap-1.5 justify-between py-1">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <h3
                                className={`font-bold truncate leading-tight ${viewMode === "grid" ? "text-[16px]" : "text-lg md:text-xl"}`}
                              >
                                {dest.name}
                              </h3>
                              <div className="flex items-center gap-1 shrink-0">
                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{dest.ratings.toFixed(1)}</span>
                              </div>
                            </div>
                            <p
                              className={`text-gray-500 font-light leading-tight ${viewMode === "grid" ? "text-sm line-clamp-2" : "text-base line-clamp-2"}`}
                            >
                              {dest.description}
                            </p>

                            {viewMode === "list" && (
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1 text-gray-400 text-xs">
                                  <Users size={14} />
                                  <span>2 guests</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400 text-xs">
                                  <Home size={14} />
                                  <span>1 bedroom</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400 text-xs">
                                  <Bed size={14} />
                                  <span>1 bed</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-2 flex items-baseline justify-between">
                            <div className="flex items-baseline gap-1.5">
                              <span
                                className={`font-bold text-gray-900 ${viewMode === "grid" ? "text-[17px]" : "text-xl"}`}
                              >
                                ${dest.price}
                              </span>
                              <span className="text-gray-500 text-sm font-light">{t("totalBeforeTaxes")}</span>
                            </div>

                            {viewMode === "list" && (
                              <div className="hidden md:flex items-center gap-1 text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 px-3 py-1.5 rounded-full">
                                <Star size={12} className="fill-orange-400 text-orange-400" />
                                <span>{t("guestFavorite")}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Spacer for fixed pagination */}
                  {totalPages > 1 && <div className="h-32" />}
                </div>
              )}
            </div>

            {/* Map Section */}
            {showMap && (
              <div className="hidden lg:block lg:w-[40%] h-full min-h-[600px] rounded-3xl overflow-hidden sticky top-[180px] border border-blue-100 shadow-lg">
                <MapView
                  locations={mapLocations}
                  locale={locale}
                  onMarkerClick={(locationId) => {
                    // Marker clicked - no navigation, just show info
                    console.log("Destination clicked:", locationId);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Pagination Section - Fixed at bottom center */}
        {totalPages > 1 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-white/95 backdrop-blur-md rounded-full shadow-2xl border border-gray-100 px-6 py-4">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentPage(Math.max(1, currentPage - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-110"
                          : "text-gray-500 hover:bg-blue-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage(Math.min(totalPages, currentPage + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-400 font-medium">
                {t("showing", {
                  start: (currentPage - 1) * pageSize + 1,
                  end: Math.min(currentPage * pageSize, filteredCount),
                  total: filteredCount,
                })}
              </p>
            </div>
          </div>
        )}

        {/* Floating Toggle Button - Hidden on mobile */}
        <div className="hidden md:block fixed bottom-6 right-6 z-[100]">
          <button
            onClick={handleToggleMap}
            className="bg-blue-600 hover:bg-blue-700 text-white px-[19px] py-[14px] rounded-full shadow-2xl shadow-blue-500/40 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
          >
            {showMap ? (
              <>
                <List size={16} strokeWidth={2.5} />
                <span className="text-[14px] font-bold">{t("showList")}</span>
              </>
            ) : (
              <>
                <MapIcon size={16} strokeWidth={2.5} />
                <span className="text-[14px] font-bold">{t("showMap")}</span>
              </>
            )}
          </button>
        </div>

        {/* Desktop Filter Modal */}
        {showDesktopFilters && (
          <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 flex items-center justify-center">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 m-4">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">{t("filters")}</h2>
                <button
                  onClick={() => setShowDesktopFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="space-y-8">
                  {/* Price Range Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Price Range</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-600 mb-2">Min Price</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                            <input
                              type="number"
                              value={priceRange.min}
                              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="pt-8 text-gray-400">—</div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-600 mb-2">Max Price</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                            <input
                              type="number"
                              value={priceRange.max}
                              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                              placeholder="500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Price Range Slider */}
                      <div className="relative pt-2">
                        <input
                          type="range"
                          min="0"
                          max="500"
                          value={priceRange.min}
                          onChange={(e) => {
                            const newMin = Number(e.target.value);
                            if (newMin <= priceRange.max) {
                              setPriceRange({ ...priceRange, min: newMin });
                            }
                          }}
                          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto cursor-pointer z-20"
                          style={{
                            background: 'transparent',
                          }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="500"
                          value={priceRange.max}
                          onChange={(e) => {
                            const newMax = Number(e.target.value);
                            if (newMax >= priceRange.min) {
                              setPriceRange({ ...priceRange, max: newMax });
                            }
                          }}
                          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto cursor-pointer z-20"
                          style={{
                            background: 'transparent',
                          }}
                        />
                        <div className="h-2 bg-gray-100 rounded-full relative">
                          <div 
                            className="h-full bg-blue-600 rounded-full absolute"
                            style={{
                              left: `${(priceRange.min / 500) * 100}%`,
                              right: `${100 - (priceRange.max / 500) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating Section */}
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Rating</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            selectedRating === rating
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-100 bg-white hover:border-blue-200"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <Star size={16} className={selectedRating === rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"} />
                            <span className={`text-sm font-bold ${selectedRating === rating ? "text-blue-600" : "text-gray-900"}`}>
                              {rating}+
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Categories Section */}
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {categoryList.slice(1).map((cat) => {
                        const count = getCountByCategory(cat);
                        const isActive = activeCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                              isActive
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-100 bg-white hover:border-blue-200"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                isActive ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-400"
                              }`}
                            >
                              {categoryIcons[cat.toLowerCase()] || <Compass size={20} />}
                            </div>
                            <div className="text-center">
                              <span
                                className={`text-xs font-bold block capitalize ${
                                  isActive ? "text-blue-600" : "text-gray-900"
                                }`}
                              >
                                {cat}
                              </span>
                              <span className="text-[10px] text-gray-400">{count}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Amenities Section */}
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {["WiFi", "Parking", "Pool", "Restaurant", "Bar", "Gym", "Spa", "Air Conditioning"].map((amenity) => (
                        <button
                          key={amenity}
                          onClick={() => {
                            const currentAmenities = Array.isArray(selectedAmenities) ? selectedAmenities : [];
                            setSelectedAmenities(
                              currentAmenities.includes(amenity) 
                                ? currentAmenities.filter(a => a !== amenity)
                                : [...currentAmenities, amenity]
                            );
                          }}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                            Array.isArray(selectedAmenities) && selectedAmenities.includes(amenity)
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-100 bg-white hover:border-blue-200"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            Array.isArray(selectedAmenities) && selectedAmenities.includes(amenity)
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300"
                          }`}>
                            {selectedAmenities.includes(amenity) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm font-medium ${
                            selectedAmenities.includes(amenity) ? "text-blue-600" : "text-gray-900"
                          }`}>
                            {amenity}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Results Count */}
                  <div className="pt-6 border-t border-gray-100">
                    <p className="text-center text-gray-500 text-sm">
                      <span className="font-bold text-gray-900">{filteredCount}</span> destinations match your filters
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 border-t border-gray-100 bg-white flex items-center gap-4">
                <button
                  onClick={() => {
                    resetFilters();
                  }}
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-200 font-bold text-gray-900 hover:bg-gray-50 transition-all"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowDesktopFilters(false)}
                  className="flex-1 px-6 py-4 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
                >
                  Show {filteredCount} Results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Filter Modal */}
        {showMobileFilters && (
          <div className="md:hidden fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-[32px] max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">{t("filters")}</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-8">
                  {/* Price Range Section */}
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-gray-900">Price Range</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 mb-2">Min</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <input
                              type="number"
                              value={priceRange.min}
                              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                              className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="pt-6 text-gray-400">—</div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 mb-2">Max</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <input
                              type="number"
                              value={priceRange.max}
                              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                              className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                              placeholder="500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Price Range Slider - Mobile */}
                      <div className="relative pt-2">
                        <input
                          type="range"
                          min="0"
                          max="500"
                          value={priceRange.min}
                          onChange={(e) => {
                            const newMin = Number(e.target.value);
                            if (newMin <= priceRange.max) {
                              setPriceRange({ ...priceRange, min: newMin });
                            }
                          }}
                          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto cursor-pointer z-20"
                          style={{
                            background: 'transparent',
                          }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="500"
                          value={priceRange.max}
                          onChange={(e) => {
                            const newMax = Number(e.target.value);
                            if (newMax >= priceRange.min) {
                              setPriceRange({ ...priceRange, max: newMax });
                            }
                          }}
                          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto cursor-pointer z-20"
                          style={{
                            background: 'transparent',
                          }}
                        />
                        <div className="h-2 bg-gray-100 rounded-full relative">
                          <div 
                            className="h-full bg-blue-600 rounded-full absolute"
                            style={{
                              left: `${(priceRange.min / 500) * 100}%`,
                              right: `${100 - (priceRange.max / 500) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating Section */}
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <h3 className="text-base font-bold text-gray-900">Rating</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                            selectedRating === rating
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-100 bg-white hover:border-blue-200"
                          }`}
                        >
                          <Star size={14} className={selectedRating === rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"} />
                          <span className={`text-xs font-bold ${selectedRating === rating ? "text-blue-600" : "text-gray-900"}`}>
                            {rating}+
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Categories Section */}
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <h3 className="text-base font-bold text-gray-900">Categories</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {categoryList.map((cat) => {
                        const count = getCountByCategory(cat);
                        return (
                          <button
                            key={cat}
                            onClick={() => {
                              setActiveCategory(cat);
                            }}
                            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                              activeCategory === cat
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-100 bg-white hover:border-blue-200"
                            }`}
                          >
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                                activeCategory === cat ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-400"
                              }`}
                            >
                              {categoryIcons[cat.toLowerCase()] || <Compass size={24} />}
                            </div>
                            <div className="text-center">
                              <span
                                className={`text-sm font-bold block ${
                                  activeCategory === cat ? "text-blue-600" : "text-gray-900"
                                }`}
                              >
                                {cat}
                              </span>
                              <span className="text-xs text-gray-400">{count} places</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Amenities Section */}
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <h3 className="text-base font-bold text-gray-900">Amenities</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {["WiFi", "Parking", "Pool", "Restaurant", "Bar", "Gym", "Spa", "Air Conditioning"].map((amenity) => (
                        <button
                          key={amenity}
                          onClick={() => {
                            const currentAmenities = Array.isArray(selectedAmenities) ? selectedAmenities : [];
                            setSelectedAmenities(
                              currentAmenities.includes(amenity) 
                                ? currentAmenities.filter(a => a !== amenity)
                                : [...currentAmenities, amenity]
                            );
                          }}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                            Array.isArray(selectedAmenities) && selectedAmenities.includes(amenity)
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-100 bg-white hover:border-blue-200"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                            Array.isArray(selectedAmenities) && selectedAmenities.includes(amenity)
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300"
                          }`}>
                            {Array.isArray(selectedAmenities) && selectedAmenities.includes(amenity) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm font-medium ${
                            Array.isArray(selectedAmenities) && selectedAmenities.includes(amenity) ? "text-blue-600" : "text-gray-900"
                          }`}>
                            {amenity}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Results Count */}
                  <div className="pt-6 border-t border-gray-100">
                    <p className="text-center text-gray-500 text-sm">
                      <span className="font-bold text-gray-900">{filteredCount}</span> destinations match your filters
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-5 border-t border-gray-100 bg-white flex items-center gap-3">
                <button
                  onClick={() => {
                    resetFilters();
                  }}
                  className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 font-bold text-gray-900 hover:bg-gray-50 transition-all"
                >
                  {t("clearAll")}
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 px-6 py-4 rounded-2xl bg-blue-600 font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
                >
                  {t("showResults", { count: filteredCount })}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {!showMap && <Footer />}
    </div>
  );
}
