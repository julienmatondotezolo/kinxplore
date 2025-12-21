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
                  let displayResponse = fullResponse;
                  
                  // Check if response contains recommendations
                  if (fullResponse.includes("FINAL_RECOMMENDATIONS")) {
                    console.log("🎯 FINAL_RECOMMENDATIONS detected!");
                    setIsLoadingRecommendations(true);
                    
                    const parsedRecommendations = await parseRecommendations(fullResponse);
                    console.log("📦 Parsed recommendations:", parsedRecommendations);
                    
                    if (parsedRecommendations) {
                      setRecommendations(parsedRecommendations);
                      // Remove the JSON section from chat display but keep the intro text
                      displayResponse = fullResponse.split("FINAL_RECOMMENDATIONS:")[0].trim();
                    }
                    setIsLoadingRecommendations(false);
                  }
                  
                  setMessages([...newMessages, { role: "model", parts: displayResponse }]);
                  setCurrentResponse("");
                } else if (data.text) {
                  fullResponse += data.text;
                  setCurrentResponse(fullResponse);
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

// Helper function to parse recommendations from AI response and fetch full destination data
async function parseRecommendations(response: string): Promise<ChatRecommendation | null> {
  try {
    // Check if response contains FINAL_RECOMMENDATIONS
    if (!response.includes("FINAL_RECOMMENDATIONS")) {
      console.log("❌ No FINAL_RECOMMENDATIONS found in response");
      return null;
    }

    console.log("🔍 Extracting JSON from response...");

    // Extract JSON from the response - try multiple patterns
    let jsonMatch = response.match(/```json\s*(\{[\s\S]*?\})\s*```/);
    
    if (!jsonMatch) {
      // Try without json tag
      jsonMatch = response.match(/```\s*(\{[\s\S]*?\})\s*```/);
    }
    
    if (!jsonMatch) {
      console.error("❌ No JSON found in response");
      console.log("Response content:", response);
      return null;
    }

    console.log("📄 Raw JSON found:", jsonMatch[1]);

    const data = JSON.parse(jsonMatch[1]);
    console.log("✅ JSON parsed successfully:", data);
    
    if (data.destinations && Array.isArray(data.destinations)) {
      console.log(`📍 Found ${data.destinations.length} destinations, fetching details...`);
      
      // Fetch complete destination data from backend
      const destinationIds = data.destinations.map((d: any) => d.id);
      const enrichedDestinations = await fetchDestinationDetails(destinationIds, data.destinations);
      
      console.log(`✨ Enriched ${enrichedDestinations.length} destinations`);
      
      return {
        destinations: enrichedDestinations,
        itinerary: data.itinerary || "",
        summary: `Found ${enrichedDestinations.length} destinations for your trip`,
      };
    }

    console.log("⚠️ No destinations array found in data");
    return null;
  } catch (error) {
    console.error("💥 Error parsing recommendations:", error);
    return null;
  }
}

// Fetch complete destination details from backend
async function fetchDestinationDetails(
  destinationIds: string[],
  reasonsData: Array<{ id: string; reason: string }>
): Promise<any[]> {
  try {
    console.log(`🌐 Fetching destination details from ${API_BASE_URL}/api/tripchat/destinations`);
    
    const response = await fetch(`${API_BASE_URL}/api/tripchat/destinations`);
    
    if (!response.ok) {
      console.error(`❌ Failed to fetch destinations: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    console.log(`📦 Received ${data.destinations?.length || 0} destinations from backend`);
    
    // Match destinations with reasons
    const enriched = destinationIds
      .map((id) => {
        const destination = data.destinations.find((d: any) => d.id === id);
        const reasonInfo = reasonsData.find((r) => r.id === id);
        
        if (destination && reasonInfo) {
          console.log(`✅ Matched destination: ${destination.name}`);
          return {
            ...destination,
            reason: reasonInfo.reason,
          };
        } else {
          console.log(`⚠️ Could not match destination ID: ${id}`);
        }
        return null;
      })
      .filter((d): d is any => d !== null);
    
    console.log(`🎉 Successfully enriched ${enriched.length} destinations`);
    return enriched;
  } catch (error) {
    console.error("💥 Error fetching destination details:", error);
    return [];
  }
}

