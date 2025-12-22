"use client";

import { motion } from "framer-motion";
import { Home, MapPin, MessageCircle, Plane, User } from "lucide-react";
import React from "react";

import { useRouter } from "@/navigation";

interface MobileBottomNavProps {
  currentView?: "chat" | "itinerary" | "home" | "trips" | "profile";
  onViewChange?: (view: "chat" | "itinerary") => void;
  showChatToggle?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView = "chat",
  onViewChange,
  showChatToggle = false,
}) => {
  const router = useRouter();

  const navItems = [
    {
      id: "home",
      icon: Home,
      label: "Home",
      action: () => router.push("/"),
    },
    {
      id: "trips",
      icon: Plane,
      label: "Trips",
      action: () => router.push("/trips"),
    },
    ...(showChatToggle
      ? [
          {
            id: "chat",
            icon: MessageCircle,
            label: "Chat",
            action: () => onViewChange?.("chat"),
          },
          {
            id: "itinerary",
            icon: MapPin,
            label: "Plan",
            action: () => onViewChange?.("itinerary"),
          },
        ]
      : []),
    {
      id: "profile",
      icon: User,
      label: "Profile",
      action: () => {},
    },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl"
    >
      <div className="grid grid-cols-4 gap-1 px-2 py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all touch-manipulation active:scale-95 ${
                isActive
                  ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={20} className={isActive ? "drop-shadow" : ""} />
              <span className={`text-[10px] font-bold ${isActive ? "text-white" : "text-gray-600"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Safe area spacer for devices with home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </motion.div>
  );
};

