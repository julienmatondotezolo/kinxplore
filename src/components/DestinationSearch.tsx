"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useDestinationStore } from "@/store/useDestinationStore";

export function DestinationSearch() {
  const { searchQuery, setSearchQuery } = useDestinationStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  return (
    <div className="relative group max-w-md w-full">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Search destinations..."
        className="w-full pl-12 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-black focus:ring-0 transition-all text-sm font-medium outline-none"
      />
      {localQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}



