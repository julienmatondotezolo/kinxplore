"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useDestinationStore } from "@/store/useDestinationStore";

export function DestinationSearch() {
  const { searchQuery, setSearchQuery } = useDestinationStore();
  const [isFocused, setIsFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="relative max-w-2xl mx-auto mb-8"
    >
      <motion.div
        animate={{
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused
            ? "0 20px 60px rgba(37, 99, 235, 0.15)"
            : "0 10px 30px rgba(0, 0, 0, 0.08)",
        }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div
            animate={{
              scale: isFocused ? 1.1 : 1,
              color: isFocused ? "rgb(37, 99, 235)" : "rgb(156, 163, 175)",
            }}
            transition={{ duration: 0.2 }}
          >
            <Search size={20} />
          </motion.div>
        </div>

        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search destinations by name, location..."
          className="w-full pl-14 pr-14 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 font-medium transition-all duration-300"
        />

        <AnimatePresence>
          {localQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClear}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Search suggestions indicator */}
      <AnimatePresence>
        {localQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-center text-sm text-gray-500"
          >
            Searching for "{localQuery}"...
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
