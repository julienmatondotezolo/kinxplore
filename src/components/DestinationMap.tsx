"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";

import { geocodeAddress, GeocodingResult } from "@/lib/geocoding";

// Fix for default marker icon in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface DestinationMapProps {
  address: string | null | undefined;
  destinationName: string;
  className?: string;
  onLoadError?: () => void; // Callback when geocoding fails
}

export function DestinationMap({ address, destinationName, className = "", onLoadError }: DestinationMapProps) {
  const [coordinates, setCoordinates] = useState<GeocodingResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    async function fetchCoordinates() {
      // Check if address is valid
      if (!address || address.trim() === "") {
        setError("No address available");
        setIsLoading(false);
        onLoadError?.();
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Geocode the address
        const result = await geocodeAddress(address);

        if (result) {
          setCoordinates(result);
        } else {
          setError("Unable to locate this address on the map");
          onLoadError?.();
        }
      } catch (err) {
        console.error("Error geocoding address:", err);
        setError("Failed to load map");
        onLoadError?.();
      } finally {
        setIsLoading(false);
      }
    }

    fetchCoordinates();
  }, [address, onLoadError]);

  if (isLoading) {
    return (
      <div className={`bg-gray-100 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  // If geocoding failed or no coordinates, don't render anything
  if (error || !coordinates) {
    return null;
  }

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg border border-gray-200 ${className}`}>
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", minHeight: "300px" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={[coordinates.lat, coordinates.lng]}
          ref={markerRef}
          eventHandlers={{
            mouseover: () => {
              // Open tooltip on hover
              markerRef.current?.openTooltip();
            },
            click: () => {
              // Open popup on click
              markerRef.current?.openPopup();
            },
          }}
        >
          {/* Tooltip shows on hover */}
          <Tooltip 
            direction="top" 
            offset={[0, -40]} 
            opacity={0.9}
            permanent={false}
          >
            <div className="text-center py-1">
              <p className="font-bold text-xs">{destinationName}</p>
            </div>
          </Tooltip>
          
          {/* Popup shows on click */}
          <Popup
            closeButton={true}
            autoClose={false}
            closeOnClick={false}
          >
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-base mb-2 text-gray-900">{destinationName}</h3>
              <div className="flex items-start gap-2 mb-3">
                <svg 
                  className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
                <p className="text-xs text-gray-600 leading-relaxed">{address}</p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                <svg 
                  className="w-3 h-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                  />
                </svg>
                Open in Google Maps
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
