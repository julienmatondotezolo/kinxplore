"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

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
        <Marker position={[coordinates.lat, coordinates.lng]}>
          <Popup>
            <div className="text-center">
              <p className="font-bold text-sm mb-1">{destinationName}</p>
              <p className="text-xs text-gray-600">{address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
