"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { useRouter } from "@/navigation";

export const ChatSearch: React.FC = () => {
  const t = useTranslations("Hero");
  const router = useRouter();
  const [query, setQuery] = useState("");

  const suggestions = [t("suggestion1"), t("suggestion2"), t("suggestion3")];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Navigate to chat page with query parameter
    router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Navigate to chat with suggestion as initial message
    router.push(`/chat?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="w-full max-w-2xl space-y-3 sm:space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="flex items-center bg-white rounded-[1.75rem] sm:rounded-[2rem] p-1.5 sm:p-2 pl-5 sm:pl-6 md:pl-8 shadow-lg sm:shadow-2xl shadow-blue-500/10 border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
          <input
            type="text"
            placeholder={t("chatSearchPlaceholder")}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-gray-700 placeholder-gray-400 font-medium py-3 sm:py-3.5 px-1 sm:px-2 text-[13px] sm:text-xs md:text-sm placeholder:text-[12px] sm:placeholder:text-xs md:placeholder:text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white p-3 sm:p-3.5 md:p-4 rounded-full transition-all shadow-lg shadow-blue-500/30 active:scale-95 group flex-shrink-0 touch-manipulation"
          >
            <ArrowRight
              size={20}
              className="group-hover:translate-x-0.5 transition-transform sm:w-5 sm:h-5 md:w-6 md:h-6"
            />
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-1.5 sm:gap-2 px-0.5 sm:px-1">
        {suggestions.map((suggestion, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleSuggestionClick(suggestion)}
            className="flex items-center gap-1.5 sm:gap-2 bg-white/80 hover:bg-white active:bg-gray-50 border border-gray-100 hover:border-blue-200 active:border-blue-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] md:text-xs font-bold text-gray-600 hover:text-blue-600 transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap touch-manipulation"
          >
            <Sparkles size={12} className="text-blue-500 sm:w-3.5 sm:h-3.5" />
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
