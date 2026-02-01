# Destination Map Implementation

## Overview

This document describes the implementation of the interactive map feature for destination detail pages using Leaflet and OpenStreetMap.

## Features Implemented

### 1. Address Validation & Database Update

**Location**: `/kinxplore-backend/scripts/validate-addresses.ts`

- ✅ Created a validation script that checks all destination addresses in the database
- ✅ Validates addresses based on criteria:
  - Must contain street/avenue information (not just city names)
  - Cannot be URLs or generic locations
  - Must have meaningful detail
- ✅ Cleaned and standardized valid addresses (spacing, formatting)
- ✅ Set invalid addresses to NULL (these destinations won't show a map)
- ✅ Updated database schema to allow NULL values for the `location` field

**Results**:
- Total destinations: 92
- Valid addresses: 74 (80%)
- Invalid addresses: 18 (20%) - set to NULL
- All addresses are in Congo (Democratic Republic of the Congo)

**Database Migration**:
```sql
-- Migration: allow_null_location_for_destinations
ALTER TABLE destinations 
ALTER COLUMN location DROP NOT NULL;

COMMENT ON COLUMN destinations.location IS 'Destination location/address (OPTIONAL - NULL if no valid address available)';
```

### 2. Map Component with Leaflet

**Location**: `/kinxplore/src/components/DestinationMap.tsx`

Created a reusable React component that:
- ✅ Uses React Leaflet for map rendering
- ✅ Integrates with existing geocoding utility (`/kinxplore/src/lib/geocoding.ts`)
- ✅ Geocodes addresses to coordinates using Nominatim (OpenStreetMap)
- ✅ Shows loading state while geocoding
- ✅ Displays error state if geocoding fails
- ✅ Shows interactive map with marker at destination location
- ✅ Includes popup with destination name and address
- ✅ Styled with Tailwind CSS to match the app design

**Props**:
```typescript
interface DestinationMapProps {
  address: string;           // The destination address to geocode
  destinationName: string;   // Name shown in the marker popup
  className?: string;        // Optional styling classes
}
```

**Features**:
- Interactive map with zoom controls
- Marker with custom popup
- Responsive design
- Error handling with fallback UI
- Loading state with spinner

### 3. Destination Detail Page Integration

**Location**: `/kinxplore/src/app/[locale]/(pages)/destinations/[id]/page.tsx`

- ✅ Imported the `DestinationMap` component
- ✅ Conditionally renders map only if `destination.location` is not NULL
- ✅ Displays address text alongside the map
- ✅ Integrated seamlessly into existing design

**Implementation**:
```tsx
{/* Location Section - Only shown if valid address exists */}
{destination.location && (
  <section className="space-y-8 pt-10 border-t border-gray-100">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-black text-gray-900">{t("location")}</h2>
      <div className="flex items-center gap-2 text-gray-600">
        <MapPin size={16} />
        <span className="text-sm font-medium">{destination.location}</span>
      </div>
    </div>
    <DestinationMap
      address={destination.location}
      destinationName={destination.name}
      className="h-[400px] w-full"
    />
  </section>
)}
```

## Dependencies Added

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "@types/leaflet": "^1.9.8"
}
```

## Geocoding Service

The implementation uses the existing geocoding utility at `/kinxplore/src/lib/geocoding.ts`:

- **Service**: Nominatim (OpenStreetMap's free geocoding API)
- **Rate Limit**: 1 request per second
- **Coverage**: Global, optimized for Congo addresses
- **Fallback**: Neighborhood-based coordinates for Kinshasa areas

## How It Works

1. **User visits destination detail page**
2. **System checks if `destination.location` exists**
   - If NULL → Map section is not rendered
   - If valid → Map component is rendered
3. **DestinationMap component**:
   - Receives address as prop
   - Calls `geocodeAddress()` to get coordinates
   - Renders loading state during geocoding
   - Shows map with marker once coordinates are available
   - Displays error state if geocoding fails

## Example Addresses

### Valid Addresses (Map will show):
- "119 Boulevard du 30 Juin - Gombe"
- "4 Avenue des Batetela, Pullman Kinshasa Grand Hotel, Kinshasa"
- "N°7, Avenue de la Mission, Muanda, Kongo central"

### Invalid Addresses (Map will NOT show):
- "Kinshasa" (too generic)
- "Gombe" (just neighborhood name)
- URLs or incomplete addresses

## Testing

To test the implementation:

1. **View a destination with valid address**:
   - Navigate to any destination detail page
   - Scroll to the "Location" section
   - Map should load and show the destination marker

2. **View a destination without valid address**:
   - The "Location" section should not appear at all

3. **Test geocoding**:
   - Open browser console
   - Look for geocoding requests to Nominatim
   - Check for any errors

## Running the Address Validation Script

To re-run the address validation:

```bash
cd /Users/julienmatondo/kinxplore-backend
npx ts-node scripts/validate-addresses.ts
```

This will:
- Fetch all active destinations
- Validate addresses
- Clean formatting
- Update database
- Show summary report

## Future Enhancements

Potential improvements:
- [ ] Add "Get Directions" button linking to Google Maps
- [ ] Show nearby destinations on the map
- [ ] Add street view integration
- [ ] Cache geocoding results in database
- [ ] Add custom marker icons
- [ ] Show destination photos on map popup
- [ ] Add map clustering for multiple locations

## Notes

- All destinations are in Congo (Democratic Republic of the Congo)
- Geocoding is done client-side on page load
- Map tiles are served by OpenStreetMap (free, no API key required)
- The map is responsive and works on mobile devices
- Scroll wheel zoom is disabled by default for better UX

## Related Files

- `/kinxplore-backend/scripts/validate-addresses.ts` - Address validation script
- `/kinxplore/src/components/DestinationMap.tsx` - Map component
- `/kinxplore/src/lib/geocoding.ts` - Geocoding utilities
- `/kinxplore/src/app/[locale]/(pages)/destinations/[id]/page.tsx` - Detail page
