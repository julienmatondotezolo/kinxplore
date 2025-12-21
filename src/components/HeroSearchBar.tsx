"use client";

import { Calendar, ChevronDown, MapPin, Search, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useDestinationStore } from "@/store/useDestinationStore";

export function HeroSearchBar() {
  const t = useTranslations("Hero");
  const tStyles = useTranslations("TripStyles");
  const tCommunes = useTranslations("Communes");
  const { heroSearch, setHeroSearch, setSearchQuery } = useDestinationStore();

  // Initialize state from heroSearch
  const [location, setLocation] = useState(() => heroSearch?.destination || "");
  const [duration, setDuration] = useState(() => heroSearch?.duration || 3);
  const [tripStyle, setTripStyle] = useState(() => heroSearch?.tripStyle || "adventure");

  // Apply hero search query on mount if it exists
  useEffect(() => {
    if (heroSearch?.destination) {
      setSearchQuery(heroSearch.destination);
    }
  }, [heroSearch, setSearchQuery]);

  const handleSearch = () => {
    // Save to store
    setHeroSearch({
      destination: location,
      duration,
      tripStyle,
    });
    // Apply search
    setSearchQuery(location);
  };

  const communes = [
    { value: "", label: t("selectLocation") },
    { value: "gombe", label: tCommunes("gombe") },
    { value: "maluku", label: tCommunes("maluku") },
    { value: "limete", label: tCommunes("limete") },
    { value: "lingwala", label: tCommunes("lingwala") },
    { value: "ngaliema", label: tCommunes("ngaliema") },
    { value: "kintambo", label: tCommunes("kintambo") },
    { value: "nsele", label: tCommunes("nsele") },
    { value: "bandalungwa", label: tCommunes("bandalungwa") },
  ];

  const tripStyles = [
    { value: "adventure", label: tStyles("adventure") },
    { value: "cultural", label: tStyles("cultural") },
    { value: "relaxation", label: tStyles("relaxation") },
    { value: "party", label: tStyles("party") },
    { value: "family", label: tStyles("family") },
    { value: "business", label: tStyles("business") },
  ];

  return (
    <div className="w-full bg-white rounded-[24px] shadow-lg border border-gray-100 p-4 md:p-5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
        {/* Location Dropdown */}
        <div className="md:col-span-3">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            {t("location")}
          </label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 z-10" />
            <select
              value={location}
              onChange={(e) => {
                const newLocation = e.target.value;
                setLocation(newLocation);
                // Update search immediately
                setHeroSearch({
                  destination: newLocation,
                  duration,
                  tripStyle,
                });
                setSearchQuery(newLocation);
              }}
              className="w-full pl-10 pr-8 py-2.5 text-sm font-medium rounded-xl border border-gray-200 hover:border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none bg-white cursor-pointer"
            >
              {communes.map((commune) => (
                <option key={commune.value} value={commune.label}>
                  {commune.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Duration */}
        <div className="md:col-span-3">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            {t("duration")}
          </label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
            <input
              type="number"
              min="1"
              max="30"
              value={duration}
              onChange={(e) => {
                const newDuration = parseInt(e.target.value) || 1;
                setDuration(newDuration);
                // Update search immediately
                setHeroSearch({
                  destination: location,
                  duration: newDuration,
                  tripStyle,
                });
                setSearchQuery(location);
              }}
              className="w-full pl-10 pr-14 py-2.5 text-sm font-medium rounded-xl border border-gray-200 hover:border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">
              {t("days")}
            </span>
          </div>
        </div>

        {/* Trip Style */}
        <div className="md:col-span-4">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            {t("tripStyle")}
          </label>
          <div className="relative">
            <Zap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 z-10" />
            <select
              value={tripStyle}
              onChange={(e) => {
                const newTripStyle = e.target.value;
                setTripStyle(newTripStyle);
                // Update search immediately
                setHeroSearch({
                  destination: location,
                  duration,
                  tripStyle: newTripStyle,
                });
                setSearchQuery(location);
              }}
              className="w-full pl-10 pr-8 py-2.5 text-sm font-medium rounded-xl border border-gray-200 hover:border-blue-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none bg-white cursor-pointer"
            >
              {tripStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="md:col-span-2 flex items-end">
          <button
            onClick={handleSearch}
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Search size={16} />
            <span className="hidden lg:inline">{t("search")}</span>
          </button>
        </div>
      </div>

      {/* Active Search Indicator */}
      {heroSearch && (heroSearch.destination || heroSearch.duration || heroSearch.tripStyle) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">{t("activeFilters")}:</span>
            {heroSearch.destination && (
              <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                <MapPin size={12} />
                {heroSearch.destination}
              </span>
            )}
            <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
              <Calendar size={12} />
              {heroSearch.duration} {t("days")}
            </span>
            <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold capitalize flex items-center gap-1.5">
              <Zap size={12} />
              {tStyles(heroSearch.tripStyle)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
