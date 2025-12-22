"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, X, Sparkles, MapPin, Calendar, Save, Check, LayoutList, FileText, MessageCircle, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState, useEffect, useRef } from "react";

import { ItineraryDayCard } from "./ItineraryDayCard";
import { ItineraryRenderer } from "./ItineraryRenderer";
import { MapView } from "./MapView";
import { MobileBottomNav } from "./MobileBottomNav";
import { useTripChat } from "@/hooks/useTripChat";
import { useTripStore } from "@/store/useTripStore";
import { parseItinerary } from "@/utils/itineraryParser";

interface TripChatProps {
  initialMessage?: string;
  onClose?: () => void;
}

export const TripChat: React.FC<TripChatProps> = ({ initialMessage, onClose }) => {
  const t = useTranslations("Hero");
  const [input, setInput] = useState("");
  const { messages, currentResponse, isLoading, error, recommendations, isLoadingRecommendations, sendMessage } =
    useTripChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [itineraryView, setItineraryView] = useState<"cards" | "full">("cards");
  const [mobileView, setMobileView] = useState<"chat" | "itinerary">("chat");
  const { saveTrip } = useTripStore();

  // Send initial message on mount if provided
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      sendMessage(initialMessage);
    }
  }, [initialMessage, messages.length, sendMessage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentResponse]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Show recommendations with a slight delay for better UX
  useEffect(() => {
    if (recommendations && !showRecommendations) {
      setTimeout(() => setShowRecommendations(true), 300);
    }
  }, [recommendations, showRecommendations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage(input);
    setInput("");
  };

  const handleSaveTrip = async () => {
    if (!recommendations) return;

    setIsSaving(true);
    try {
      const tripName = `Trip to Kinshasa - ${new Date().toLocaleDateString()}`;
      await saveTrip(tripName, recommendations);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Error saving trip:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const suggestions = [t("suggestion1"), t("suggestion2"), t("suggestion3")];

  // Parse itinerary into days
  const dayActivities = recommendations
    ? parseItinerary(recommendations.itinerary, recommendations.destinations)
    : [];

  // Prepare map locations with better spread
  const mapLocations = recommendations
    ? recommendations.destinations.map((dest, index) => {
        // Kinshasa center coordinates
        const centerLat = -4.3276;
        const centerLng = 15.3136;
        
        // Spread destinations in a circle pattern for better visualization
        const angle = (index / recommendations.destinations.length) * 2 * Math.PI;
        const radius = 0.05; // ~5.5 km spread
        
        return {
          id: dest.id,
          name: dest.name,
          price: dest.price || 0,
          lat: centerLat + Math.cos(angle) * radius + (Math.random() - 0.5) * 0.01,
          lng: centerLng + Math.sin(angle) * radius + (Math.random() - 0.5) * 0.01,
          address: dest.location,
        };
      })
    : [];

  return (
    <div className="flex flex-col lg:flex-row h-full bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40 overflow-hidden relative">
      {/* Chat Section */}
      <motion.div
        initial={false}
        animate={{
          width: showRecommendations ? { lg: "50%", base: "100%" } : "100%",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 25, mass: 0.8 }}
        className={`flex flex-col h-full border-r border-gray-200 relative ${
          showRecommendations && mobileView === "itinerary" ? "hidden lg:flex" : "flex"
        }`}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot size={18} className="text-white sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-extrabold text-gray-900 text-sm sm:text-base truncate">KinXplore AI</h2>
              <p className="text-[11px] sm:text-xs text-gray-500 truncate">Your Kinshasa trip planner</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {recommendations && (
              <button
                onClick={() => {
                  setShowRecommendations(true);
                  setMobileView("itinerary");
                }}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-xs shadow-md hover:shadow-lg active:scale-95 transition-all touch-manipulation"
                aria-label="View itinerary"
              >
                <MapPin size={14} />
                <span className="hidden xs:inline">Itinerary</span>
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-xl transition-colors touch-manipulation"
                aria-label="Close chat"
              >
                <X size={18} className="text-gray-500 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4">
        {messages.length === 0 && !currentResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 py-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
              <Sparkles size={32} className="text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">Start Planning Your Trip!</h3>
              <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto">
                Tell me about your dream trip to Kinshasa and I'll help you create the perfect itinerary.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 px-4">
              {suggestions.map((suggestion, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                    setInput(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="flex items-center gap-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 px-4 py-2 rounded-full text-xs font-medium text-gray-700 hover:text-blue-600 transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  <Sparkles size={12} className="text-blue-500" />
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "model" && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white text-gray-900 border border-gray-100 rounded-tl-none shadow-sm"
                }`}
              >
                <p className="text-sm md:text-base whitespace-pre-wrap">
                  {/* Don't show FINAL_RECOMMENDATIONS JSON in chat */}
                  {message.parts}
                </p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-gray-600" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming Response */}
        {currentResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="max-w-[85%] md:max-w-[75%] bg-white text-gray-900 border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
              <p className="text-sm md:text-base whitespace-pre-wrap">
                {currentResponse}
                <span className="inline-block w-1 h-4 bg-blue-600 ml-1 animate-pulse" />
              </p>
            </div>
          </motion.div>
        )}

        {/* Loading Indicator */}
        {isLoading && !currentResponse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="text-blue-600 animate-spin" />
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl px-4 py-3"
          >
            <p className="text-sm text-red-600">⚠️ {error}</p>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-100 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="w-full bg-transparent border-none outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400 disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all shadow-md sm:shadow-lg shadow-blue-500/20 active:scale-95 flex-shrink-0 touch-manipulation"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin sm:w-5 sm:h-5" />
              ) : (
                <Send size={18} className="sm:w-5 sm:h-5" />
              )}
            </button>
          </form>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-2 text-center">
            Powered by Google Gemini AI
          </p>
        </div>
      </motion.div>

      {/* Recommendations Panel */}
      <AnimatePresence mode="wait">
        {showRecommendations && recommendations && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 25, mass: 0.8 }}
            className={`w-full lg:w-1/2 bg-white flex flex-col overflow-hidden shadow-2xl relative ${
              mobileView === "chat" ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Recommendations Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-5 text-white flex-shrink-0">
              {/* Back button for mobile */}
              <button
                onClick={() => {
                  setMobileView("chat");
                }}
                className="lg:hidden mb-3 flex items-center gap-2 text-white/90 hover:text-white text-sm font-bold active:scale-95 transition-transform bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl touch-manipulation"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to chat
              </button>
              
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <MapPin size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold">Your Itinerary</h2>
                </div>
                <div className="flex items-center gap-2">
                  {/* View Toggle */}
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full p-1">
                    <button
                      onClick={() => setItineraryView("cards")}
                      className={`p-1.5 sm:p-2 rounded-full transition-all ${
                        itineraryView === "cards"
                          ? "bg-white text-blue-600"
                          : "text-white/70 hover:text-white"
                      }`}
                      title="Card view"
                    >
                      <LayoutList size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => setItineraryView("full")}
                      className={`p-1.5 sm:p-2 rounded-full transition-all ${
                        itineraryView === "full"
                          ? "bg-white text-blue-600"
                          : "text-white/70 hover:text-white"
                      }`}
                      title="Full view"
                    >
                      <FileText size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 rounded-full font-bold">
                    <Calendar size={14} className="sm:w-4 sm:h-4" />
                    <span>{dayActivities.length} {dayActivities.length === 1 ? 'day' : 'days'}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed">{recommendations.summary}</p>
            </div>

            {/* Map Section */}
            <div className="flex-shrink-0 bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4">
              <div className="h-52 sm:h-64 w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg ring-1 ring-black/5">
                {mapLocations.length > 0 ? (
                  <MapView
                    locations={mapLocations}
                    center={{ lat: -4.3276, lng: 15.3136 }}
                    zoom={12}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
                    <div className="text-center px-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg">
                        <MapPin size={24} className="text-blue-600 sm:w-8 sm:h-8" />
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 font-semibold">Loading map...</p>
                      <p className="text-xs text-gray-500 mt-1">Plotting destinations</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Itinerary List */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4 pb-24 sm:pb-28">
              {isLoadingRecommendations ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4">
                  <div className="relative">
                    <Loader2 size={40} className="text-blue-600 animate-spin sm:w-12 sm:h-12" />
                    <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping" />
                  </div>
                  <div className="text-center">
                    <p className="text-base sm:text-lg text-gray-700 font-bold mb-1">Planning your journey...</p>
                    <p className="text-xs sm:text-sm text-gray-500">Creating the perfect itinerary</p>
                  </div>
                </div>
              ) : (
                <>
                  {dayActivities.length > 0 || recommendations.itinerary ? (
                    <>
                      {itineraryView === "cards" ? (
                        <>
                          {/* Day-by-Day Cards View */}
                          {dayActivities.length > 0 && (
                            <>
                              <div className="flex items-center gap-2 mb-2 px-1">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                  Daily Plan
                                </span>
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                              </div>
                              {dayActivities.map((day, index) => (
                                <ItineraryDayCard key={day.day} day={day} index={index} />
                              ))}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Full Formatted View */}
                          <ItineraryRenderer itineraryText={recommendations.itinerary} />
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 sm:py-16">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Calendar size={32} className="text-gray-400 sm:w-10 sm:h-10" />
                      </div>
                      <p className="text-base sm:text-lg text-gray-700 font-semibold mb-1">No itinerary yet</p>
                      <p className="text-xs sm:text-sm text-gray-500">Start planning to see your schedule</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Fixed Save Button at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 shadow-2xl">
              <button
                onClick={handleSaveTrip}
                disabled={isSaving || isSaved || isLoadingRecommendations}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-extrabold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3 touch-manipulation ${
                  isSaved
                    ? "bg-green-600 hover:bg-green-700 text-white ring-2 ring-green-200"
                    : "bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={20} className="animate-spin sm:w-6 sm:h-6" />
                    <span>Saving Trip...</span>
                  </>
                ) : isSaved ? (
                  <>
                    <Check size={20} className="sm:w-6 sm:h-6" />
                    <span>Trip Saved!</span>
                  </>
                ) : (
                  <>
                    <Save size={20} className="sm:w-6 sm:h-6" />
                    <span>Save My Trip</span>
                  </>
                )}
              </button>
              <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2">
                Your trip will be saved to your collection
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons for Mobile */}
      {showRecommendations && recommendations && (
        <>
          {/* Chat FAB - Shows when viewing itinerary on mobile */}
          <AnimatePresence>
            {mobileView === "itinerary" && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setMobileView("chat")}
                className="lg:hidden fixed bottom-24 right-4 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform touch-manipulation"
                aria-label="Back to chat"
              >
                <MessageCircle size={24} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Itinerary FAB - Shows when viewing chat on mobile */}
          <AnimatePresence>
            {mobileView === "chat" && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setMobileView("itinerary")}
                className="lg:hidden fixed bottom-24 right-4 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform touch-manipulation"
                aria-label="View itinerary"
              >
                <MapPin size={24} />
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Mobile Bottom Navigation */}
      {showRecommendations && recommendations && (
        <MobileBottomNav
          currentView={mobileView}
          onViewChange={setMobileView}
          showChatToggle={true}
        />
      )}
    </div>
  );
};

