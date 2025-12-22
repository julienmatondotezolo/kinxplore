"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import React from "react";

import { SavedTrips } from "./SavedTrips";

interface SavedTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedTripsModal: React.FC<SavedTripsModalProps> = ({ isOpen, onClose }) => {
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full h-full sm:h-[90vh] sm:max-w-6xl bg-white sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between shadow-lg">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    My Saved Trips
                  </h2>
                  <p className="text-sm text-white/90 mt-1">
                    View and manage your itineraries
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-colors touch-manipulation active:scale-95"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-white sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40">
                <SavedTrips />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

