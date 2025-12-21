"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface ResultsCounterProps {
  count: number;
  total: number;
  isFiltered: boolean;
}

export function ResultsCounter({ count, total, isFiltered }: ResultsCounterProps) {
  const [displayCount, setDisplayCount] = useState(0);

  // Animate counter
  useEffect(() => {
    let start = 0;
    const end = count;
    const duration = 500; // ms
    const increment = Math.ceil(end / (duration / 16)); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayCount(end);
        clearInterval(timer);
      } else {
        setDisplayCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="text-center mb-8"
    >
      <motion.div
        key={count}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full px-6 py-3"
      >
        <MapPin size={18} className="text-blue-600" />
        <div className="flex items-baseline gap-2">
          <motion.span
            key={displayCount}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-black text-blue-600"
          >
            {displayCount}
          </motion.span>
          <span className="text-sm font-semibold text-gray-600">
            {isFiltered ? "filtered" : "total"} destination{count !== 1 ? "s" : ""}
          </span>
        </div>
        
        <AnimatePresence>
          {isFiltered && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="text-xs font-medium text-gray-500"
            >
              of {total}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}




