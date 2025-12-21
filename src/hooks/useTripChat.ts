"use client";

import { useState, useCallback } from "react";

import type { ChatMessage, StreamChunk, ChatRecommendation } from "@/types/chat.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export function useTripChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<ChatRecommendation | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim()) return;

      const newMessages: ChatMessage[] = [...messages, { role: "user", parts: userMessage }];
      setMessages(newMessages);
      setIsLoading(true);
      setCurrentResponse("");
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/tripchat/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: newMessages }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No reader available");
        }

        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data: StreamChunk = JSON.parse(line.slice(6));
                if (data.done) {
                  // Always hide FINAL_RECOMMENDATIONS from chat
                  const displayResponse = fullResponse.includes("FINAL_RECOMMENDATIONS")
                    ? fullResponse.split("FINAL_RECOMMENDATIONS:")[0].trim()
                    : fullResponse;
                  
                  // Save the display message
                  setMessages([...newMessages, { role: "model", parts: displayResponse }]);
                  setCurrentResponse("");
                  
                  // Check if response contains recommendations and fetch them separately
                  if (fullResponse.includes("FINAL_RECOMMENDATIONS")) {
                    console.log("🎯 FINAL_RECOMMENDATIONS detected!");
                    setIsLoadingRecommendations(true);
                    
                    try {
                      // Make separate API call to get recommendations
                      const recommendations = await fetchRecommendations(fullResponse);
                      console.log("📦 Fetched recommendations:", recommendations);
                      
                      if (recommendations) {
                        setRecommendations(recommendations);
                      }
                    } catch (error) {
                      console.error("💥 Error fetching recommendations:", error);
                    } finally {
                      setIsLoadingRecommendations(false);
                    }
                  }
                } else if (data.text) {
                  fullResponse += data.text;
                  
                  // Hide FINAL_RECOMMENDATIONS from streaming display
                  const displayText = fullResponse.includes("FINAL_RECOMMENDATIONS")
                    ? fullResponse.split("FINAL_RECOMMENDATIONS:")[0].trim()
                    : fullResponse;
                  
                  setCurrentResponse(displayText);
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error sending message:", err);
        setError(err instanceof Error ? err.message : "Failed to send message");
        // Remove the failed user message
        setMessages(messages);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const resetChat = useCallback(() => {
    setMessages([]);
    setCurrentResponse("");
    setError(null);
    setRecommendations(null);
  }, []);

  return {
    messages,
    currentResponse,
    isLoading,
    error,
    recommendations,
    isLoadingRecommendations,
    sendMessage,
    resetChat,
  };
}

// Fetch recommendations from backend by sending the full response
async function fetchRecommendations(fullResponse: string): Promise<ChatRecommendation | null> {
  try {
    console.log("🌐 Calling /api/tripchat/recommendations endpoint...");
    
    const response = await fetch(`${API_BASE_URL}/api/tripchat/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullResponse }),
    });

    if (!response.ok) {
      console.error(`❌ Failed to fetch recommendations: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log("📦 Received recommendations from backend:", data);

    if (data.error) {
      console.error("❌ Backend error:", data.error);
      return null;
    }

    if (!data.recommendations) {
      console.log("⚠️ No recommendations in response");
      return null;
    }

    const recommendations = data.recommendations;
    console.log(`✨ Successfully received ${recommendations.destinations.length} destinations`);

    return {
      destinations: recommendations.destinations,
      itinerary: recommendations.itinerary || "",
      summary: recommendations.summary || `Found ${recommendations.destinations.length} destinations`,
    };
  } catch (error) {
    console.error("💥 Error fetching recommendations:", error);
    return null;
  }
}

