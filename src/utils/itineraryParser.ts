import type { DestinationRecommendation } from "@/types/chat.types";

export interface DayActivity {
  day: number;
  date?: string;
  title: string;
  description: string;
  destinations: DestinationRecommendation[];
  activities: string[];
}

export function parseItinerary(
  itineraryText: string,
  allDestinations: DestinationRecommendation[]
): DayActivity[] {
  const days: DayActivity[] = [];
  
  // Split by day markers (e.g., "**Jour 1:**", "Day 1:", etc.)
  const dayPattern = /\*\*(?:Jour|Day)\s+(\d+)(?:-(\d+))?[:\*]?\*\*([^\*]+)/gi;
  const matches = Array.from(itineraryText.matchAll(dayPattern));

  matches.forEach((match, index) => {
    const startDay = parseInt(match[1]);
    const endDay = match[2] ? parseInt(match[2]) : startDay;
    const content = match[3].trim();

    // Extract activities from the day's content
    const activities = extractActivities(content);
    
    // Find destinations mentioned in this day
    const dayDestinations = allDestinations.filter((dest) =>
      content.toLowerCase().includes(dest.name.toLowerCase())
    );

    // Create entries for each day in range
    for (let day = startDay; day <= endDay; day++) {
      days.push({
        day,
        title: `Day ${day}`,
        description: content.split('\n')[0].substring(0, 150) + (content.length > 150 ? '...' : ''),
        destinations: dayDestinations,
        activities: activities.slice(0, 3), // Limit to 3 activities
      });
    }
  });

  // If no days found, create a single day with all destinations
  if (days.length === 0 && allDestinations.length > 0) {
    days.push({
      day: 1,
      title: "Your Trip",
      description: "Explore these recommended destinations",
      destinations: allDestinations,
      activities: ["Visit recommended locations", "Experience local culture"],
    });
  }

  return days;
}

function extractActivities(text: string): string[] {
  const activities: string[] = [];
  
  // Look for bullet points or numbered lists
  const lines = text.split('\n');
  lines.forEach((line) => {
    const trimmed = line.trim();
    // Match patterns like "- Activity", "* Activity", "• Activity", "1. Activity"
    if (/^[-*•]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const activity = trimmed.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '').trim();
      if (activity.length > 0) {
        activities.push(activity);
      }
    }
  });

  return activities;
}

