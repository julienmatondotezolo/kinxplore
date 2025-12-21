"use client";

import { MapPin } from "lucide-react";
import { useEffect, useRef } from "react";

interface Location {
  id: string;
  name: string;
  price: number;
  lat: number;
  lng: number;
  address?: string;
}

interface MapViewProps {
  locations: Location[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (locationId: string) => void;
}

// Declare Leaflet type for global usage
declare global {
  interface Window {
    L: any;
  }
}

// Function to geocode addresses using Nominatim (free OpenStreetMap geocoding service)
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // Add "Kinshasa" to the address if not present to improve accuracy
    const searchAddress = address.toLowerCase().includes("kinshasa")
      ? address
      : `${address}, Kinshasa, Democratic Republic of the Congo`;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1`,
      {
        headers: {
          "User-Agent": "KinXplore/1.0", // Required by Nominatim
        },
      },
    );

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export function MapView({
  locations,
  center = { lat: -4.3276, lng: 15.3136 }, // Kinshasa coordinates
  zoom = 12,
  onMarkerClick,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined" || !mapRef.current) return;

    // Load Leaflet script if not already loaded
    if (!window.L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.onload = () => initializeMap();
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    function initializeMap() {
      const L = window.L;
      if (!L || !mapRef.current) return;

      // Initialize map only once
      if (!mapInstanceRef.current) {
        try {
          // Create map instance
          const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);

          // Add OpenStreetMap tile layer (free)
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(map);

          mapInstanceRef.current = map;
        } catch (error) {
          console.error("Error initializing map:", error);
          return;
        }
      }

      // Clear existing markers
      markersRef.current.forEach((marker) => {
        try {
          marker.remove();
        } catch (e) {
          console.error("Error removing marker:", e);
        }
      });
      markersRef.current = [];

      // Add markers for each location
      locations.forEach((location) => {
        try {
          // Create custom HTML for marker
          const markerHtml = `
            <div style="
              background: white;
              border: 2px solid #2563eb;
              border-radius: 24px;
              padding: 6px 14px;
              font-weight: 700;
              font-size: 14px;
              color: #1f2937;
              box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
              cursor: pointer;
              white-space: nowrap;
              transform: translateY(-50%);
            ">
              $${location.price}
            </div>
          `;

          const icon = L.divIcon({
            html: markerHtml,
            className: "custom-marker",
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          });

          const marker = L.marker([location.lat, location.lng], { icon }).addTo(mapInstanceRef.current).bindPopup(`
              <div style="padding: 12px; min-width: 200px;">
                <h3 style="font-weight: 700; font-size: 16px; margin-bottom: 8px; color: #1f2937;">
                  ${location.name}
                </h3>
                ${
                  location.address
                    ? `
                  <p style="color: #6b7280; font-size: 13px; margin-bottom: 8px; line-height: 1.4;">
                    📍 ${location.address}
                  </p>
                `
                    : ""
                }
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  From <strong style="color: #2563eb; font-size: 16px;">$${location.price}</strong> / night
                </p>
              </div>
            `);

          if (onMarkerClick) {
            marker.on("click", () => onMarkerClick(location.id));
          }

          markersRef.current.push(marker);
        } catch (error) {
          console.error("Error adding marker:", error);
        }
      });

      // Fit bounds to show all markers if there are any
      if (locations.length > 0 && mapInstanceRef.current) {
        try {
          // Filter out invalid coordinates
          const validLocations = locations.filter(
            (loc) =>
              !isNaN(loc.lat) &&
              !isNaN(loc.lng) &&
              loc.lat !== null &&
              loc.lng !== null &&
              loc.lat >= -90 &&
              loc.lat <= 90 &&
              loc.lng >= -180 &&
              loc.lng <= 180,
          );

          if (validLocations.length > 0) {
            const bounds = L.latLngBounds(validLocations.map((loc) => [loc.lat, loc.lng]));
            mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
          } else {
            // If no valid locations, center on Kinshasa
            mapInstanceRef.current.setView([center.lat, center.lng], zoom);
          }
        } catch (error) {
          console.error("Error fitting bounds:", error);
          // Fallback to default center
          mapInstanceRef.current.setView([center.lat, center.lng], zoom);
        }
      }
    }

    return () => {
      // Cleanup markers on unmount
      markersRef.current.forEach((marker) => {
        try {
          marker.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
      });
    };
  }, [locations, center.lat, center.lng, zoom, onMarkerClick]);

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div ref={mapRef} className="w-full h-full rounded-[32px] overflow-hidden" style={{ minHeight: "600px" }} />
    </>
  );
}

// Placeholder component for when map is not shown
export function MapPlaceholder({ destinationCount }: { destinationCount: number }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative bg-blue-50/30 rounded-[32px]">
      <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,0,0,0/800x800?access_token=pk.placeholder')] bg-cover opacity-20 grayscale contrast-[0.8]" />
      <div className="z-10 text-center px-10">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-6 transform transition-transform hover:scale-110">
          <MapPin size={40} className="text-white stroke-[1.5]" />
        </div>
        <h4 className="text-xl font-bold mb-3 text-gray-800">Map Explorer</h4>
        <p className="text-gray-500 text-[15px] max-w-xs mx-auto font-light leading-relaxed">
          Visualize all {destinationCount} destinations on an interactive map to find the perfect location.
        </p>
      </div>
    </div>
  );
}
