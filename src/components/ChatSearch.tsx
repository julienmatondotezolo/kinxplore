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
    <div className="w-full max-w-2xl space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="flex items-center bg-white rounded-[2rem] p-1.5 md:p-2 pl-6 md:pl-8 shadow-2xl shadow-blue-500/10 border border-gray-100 transition-all duration-300">
          <input
            type="text"
            placeholder={t("chatSearchPlaceholder")}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-gray-700 placeholder-gray-400 font-medium py-3 px-2 text-xs md:text-sm placeholder:text-xs md:placeholder:text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 md:p-4 rounded-full transition-all shadow-lg shadow-blue-500/30 active:scale-95 group flex-shrink-0"
          >
            <ArrowRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 px-1">
        {suggestions.map((suggestion, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleSuggestionClick(suggestion)}
            className="flex items-center gap-2 bg-white/80 hover:bg-white border border-gray-100 hover:border-blue-200 px-4 py-2 rounded-full text-[10px] md:text-xs font-bold text-gray-600 hover:text-blue-600 transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
          >
            <Sparkles size={14} className="text-blue-500" />
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
