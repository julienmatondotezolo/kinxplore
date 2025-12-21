"use client";

import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

import { TripChat } from "@/components/TripChat";
import { useRouter } from "@/navigation";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialMessage = searchParams.get("q") || undefined;

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <TripChat initialMessage={initialMessage} onClose={handleClose} />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading chat...</p>
          </div>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}

