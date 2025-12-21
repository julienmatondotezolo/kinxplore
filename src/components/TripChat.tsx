"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, X, Sparkles, MapPin, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState, useEffect, useRef } from "react";

import { DestinationRecommendationCard } from "./DestinationRecommendationCard";
import { useTripChat } from "@/hooks/useTripChat";

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

  const suggestions = [t("suggestion1"), t("suggestion2"), t("suggestion3")];

  return (
    <div className="flex h-full bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/40 overflow-hidden">
      {/* Chat Section */}
      <motion.div
        initial={false}
        animate={{
          width: showRecommendations ? "50%" : "100%",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 25, mass: 0.8 }}
        className="flex flex-col h-full border-r border-gray-200 relative"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm md:text-base">KinXplore AI Assistant</h2>
              <p className="text-xs text-gray-500">Your Kinshasa trip planner</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X size={20} className="text-gray-500" />
            </button>
          )}
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
                {/* Hide FINAL_RECOMMENDATIONS section from display */}
                {currentResponse.includes("FINAL_RECOMMENDATIONS") 
                  ? currentResponse.split("FINAL_RECOMMENDATIONS:")[0].trim()
                  : currentResponse}
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
        <div className="bg-white border-t border-gray-100 px-4 md:px-6 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-blue-400 focus-within:bg-white transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="w-full bg-transparent border-none outline-none text-sm md:text-base text-gray-900 placeholder-gray-400 disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex-shrink-0"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2 text-center">Powered by Google Gemini AI</p>
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
            className="w-1/2 bg-white flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Recommendations Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <MapPin size={24} />
                <h2 className="text-xl font-bold">Your Recommendations</h2>
              </div>
              <p className="text-sm text-white/90">{recommendations.summary}</p>
              <div className="mt-4 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{recommendations.destinations.length} destinations</span>
                </div>
              </div>
            </div>

            {/* Recommendations List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoadingRecommendations ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 size={48} className="text-blue-600 animate-spin" />
                  <p className="text-gray-600 font-medium">Loading your recommendations...</p>
                </div>
              ) : (
                <>
                  {recommendations.destinations.map((destination, index) => (
                    <DestinationRecommendationCard
                      key={destination.id}
                      destination={destination}
                      index={index}
                    />
                  ))}</>
              )}

              {/* Itinerary Section */}
              {recommendations.itinerary && !recommendations.itinerary.includes("FINAL_RECOMMENDATIONS") && (
                <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                    <Calendar size={20} className="text-blue-600" />
                    Your Itinerary
                  </h3>
                  <div className="prose prose-sm text-gray-700 whitespace-pre-wrap">
                    {recommendations.itinerary}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

