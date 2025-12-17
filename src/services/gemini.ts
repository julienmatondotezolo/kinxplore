import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserPreferences, Itinerary } from "@/types";

const getApiKey = () => {
  if (typeof window === "undefined") {
    // Server-side
    return process.env.GEMINI_API_KEY;
  }
  // Client-side
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
};

const apiKey = getApiKey();

if (!apiKey) {
  console.error("GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY environment variable is required");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const itinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tripTitle: { type: Type.STRING, description: "A catchy title for the trip" },
    summary: { type: Type.STRING, description: "A brief summary of the entire experience" },
    estimatedCost: { type: Type.STRING, description: "Estimated cost range for the trip in USD" },
    dailyItinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          theme: { type: Type.STRING, description: "The main theme of this specific day" },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, description: "e.g., 09:00 AM" },
                title: { type: Type.STRING, description: "Name of the activity or place" },
                location: { type: Type.STRING, description: "Specific location or neighborhood in Kinshasa" },
                description: { type: Type.STRING, description: "2-3 sentences describing what to do there" },
                category: { 
                  type: Type.STRING, 
                  enum: ['Food', 'Adventure', 'Culture', 'Relax', 'Nightlife'],
                  description: "Category of the activity"
                }
              },
              required: ["time", "title", "location", "description", "category"]
            }
          }
        },
        required: ["day", "theme", "activities"]
      }
    }
  },
  required: ["tripTitle", "summary", "estimatedCost", "dailyItinerary"]
};

export const generateItinerary = async (prefs: UserPreferences): Promise<Itinerary> => {
  if (!ai) {
    throw new Error("Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY environment variable.");
  }

  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Plan a detailed ${prefs.duration}-day trip to Kinshasa, Democratic Republic of the Congo.
    
    User Preferences:
    - Travel Style: ${prefs.style}
    - Group Size: ${prefs.groupSize} people
    
    The itinerary should be realistic, considering Kinshasa's traffic and geography. 
    Include specific real restaurants, landmarks (like Lola ya Bonobo, Zongo Falls if duration allows, Marche de la Liberte, Congo River views), and nightlife spots if applicable.
    Ensure a mix of activities appropriate for the "${prefs.style}" style.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        systemInstruction: "You are an expert local travel guide for Kinshasa, DRC. You know the hidden gems, the best foods (like Liboke, Fufu), and safe, enjoyable spots for tourists."
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as Itinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};