/**
 * Geocoding utilities for converting addresses to coordinates
 * Uses Nominatim (OpenStreetMap's free geocoding service)
 */

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName?: string;
}

/**
 * Geocode an address to coordinates using Nominatim
 * Free service with usage policy: https://operations.osmfoundation.org/policies/nominatim/
 */
export async function geocodeAddress(
  address: string,
  city: string = 'Kinshasa',
  country: string = 'Democratic Republic of the Congo'
): Promise<GeocodingResult | null> {
  try {
    // Build search query
    const searchQuery = `${address}, ${city}, ${country}`;
    
    // Call Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'KinXplore/1.0 (Travel Platform)', // Required by Nominatim
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
    }
    
    console.warn(`No geocoding results for: ${searchQuery}`);
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Batch geocode multiple addresses with rate limiting
 * Nominatim has a rate limit of 1 request per second
 */
export async function geocodeAddresses(
  addresses: Array<{ id: string; address: string }>,
  onProgress?: (completed: number, total: number) => void
): Promise<Map<string, GeocodingResult>> {
  const results = new Map<string, GeocodingResult>();
  
  for (let i = 0; i < addresses.length; i++) {
    const { id, address } = addresses[i];
    
    // Geocode the address
    const result = await geocodeAddress(address);
    
    if (result) {
      results.set(id, result);
    }
    
    // Report progress
    if (onProgress) {
      onProgress(i + 1, addresses.length);
    }
    
    // Rate limiting: Wait 1 second between requests (Nominatim requirement)
    if (i < addresses.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

/**
 * Get default coordinates for Kinshasa neighborhoods
 * Useful for fallback when geocoding fails or for demo purposes
 */
export const KINSHASA_NEIGHBORHOODS = {
  gombe: { lat: -4.3147, lng: 15.3136, name: 'Gombe' },
  limete: { lat: -4.3736, lng: 15.3317, name: 'Limete' },
  kintambo: { lat: -4.3333, lng: 15.2833, name: 'Kintambo' },
  ngaliema: { lat: -4.3700, lng: 15.2600, name: 'Ngaliema' },
  kalamu: { lat: -4.3400, lng: 15.3100, name: 'Kalamu' },
  lemba: { lat: -4.3900, lng: 15.3300, name: 'Lemba' },
  matete: { lat: -4.3800, lng: 15.2900, name: 'Matete' },
  ngiri_ngiri: { lat: -4.3500, lng: 15.2900, name: 'Ngiri-Ngiri' },
  kinshasa_center: { lat: -4.3276, lng: 15.3136, name: 'Kinshasa Center' },
  masina: { lat: -4.3850, lng: 15.3900, name: 'Masina' },
  ndjili: { lat: -4.3950, lng: 15.4200, name: 'Ndjili' },
  kimbanseke: { lat: -4.4200, lng: 15.3400, name: 'Kimbanseke' },
};

/**
 * Find the closest neighborhood to a given address string
 * Useful for generating approximate coordinates
 */
export function getNeighborhoodCoordinates(address: string): GeocodingResult | null {
  const addressLower = address.toLowerCase();
  
  for (const [key, value] of Object.entries(KINSHASA_NEIGHBORHOODS)) {
    if (addressLower.includes(key.replace('_', ' ')) || addressLower.includes(value.name.toLowerCase())) {
      return {
        lat: value.lat,
        lng: value.lng,
        displayName: value.name,
      };
    }
  }
  
  // Default to city center if no match
  return {
    lat: KINSHASA_NEIGHBORHOODS.kinshasa_center.lat,
    lng: KINSHASA_NEIGHBORHOODS.kinshasa_center.lng,
    displayName: 'Kinshasa Center',
  };
}

/**
 * Generate grid-based coordinates for demo purposes
 * Distributes locations evenly across Kinshasa
 */
export function generateGridCoordinates(
  index: number,
  total: number,
  center: { lat: number; lng: number } = { lat: -4.3276, lng: 15.3136 }
): GeocodingResult {
  const gridSize = Math.ceil(Math.sqrt(total));
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;
  
  // Spread across ~0.15 degrees (about 15km)
  const latOffset = (row - gridSize / 2) * 0.015;
  const lngOffset = (col - gridSize / 2) * 0.015;
  
  return {
    lat: center.lat + latOffset,
    lng: center.lng + lngOffset,
  };
}

/**
 * Validate coordinates
 */
export function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat !== null &&
    lng !== null &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}
