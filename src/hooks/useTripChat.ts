"use client";

import { useState, useCallback } from "react";

import type { ChatMessage, StreamChunk } from "@/types/chat.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export function useTripChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
                  setMessages([...newMessages, { role: "model", parts: fullResponse }]);
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
  }, []);

  return {
    messages,
    currentResponse,
    isLoading,
    error,
    sendMessage,
    resetChat,
  };
}

