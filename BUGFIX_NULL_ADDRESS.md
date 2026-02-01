# Bug Fix: Null Address Handling

## Issue

**Error**: `Runtime TypeError: Cannot read properties of null (reading 'toLowerCase')`

**Location**: `src/lib/geocoding.ts` (line 116)

**Root Cause**: After updating the database to allow NULL values for the `location` field, the geocoding functions were not handling null/undefined addresses properly.

## What Happened

1. We ran the address validation script that set invalid addresses to NULL in the database
2. The destinations page (`/destinations`) calls `getNeighborhoodCoordinates(dest.location)` for each destination
3. For destinations with NULL location, the function tried to call `.toLowerCase()` on null, causing a TypeError

## Fix Applied

### 1. Updated `geocodeAddress()` function

**File**: `/kinxplore/src/lib/geocoding.ts`

```typescript
export async function geocodeAddress(
  address: string | null | undefined,  // ✅ Now accepts null/undefined
  city: string = "Kinshasa",
  country: string = "Democratic Republic of the Congo",
): Promise<GeocodingResult | null> {
  // ✅ Added null check at the start
  if (!address || address.trim() === "") {
    console.warn("No address provided for geocoding");
    return null;
  }
  
  // ... rest of the function
}
```

### 2. Updated `getNeighborhoodCoordinates()` function

**File**: `/kinxplore/src/lib/geocoding.ts`

```typescript
export function getNeighborhoodCoordinates(
  address: string | null | undefined  // ✅ Now accepts null/undefined
): GeocodingResult | null {
  // ✅ Added null check before calling toLowerCase()
  if (!address) {
    return null;
  }

  const addressLower = address.toLowerCase();
  // ... rest of the function
}
```

### 3. Updated `DestinationMap` component

**File**: `/kinxplore/src/components/DestinationMap.tsx`

```typescript
interface DestinationMapProps {
  address: string | null | undefined;  // ✅ Now accepts null/undefined
  destinationName: string;
  className?: string;
}

export function DestinationMap({ address, destinationName, className = "" }: DestinationMapProps) {
  // ... 
  
  useEffect(() => {
    async function fetchCoordinates() {
      // ✅ Added validation at the start
      if (!address || address.trim() === "") {
        setError("No address available");
        setIsLoading(false);
        return;
      }
      
      // ... rest of the function
    }

    fetchCoordinates();
  }, [address]);
}
```

## How It Works Now

### Destinations Page (`/destinations`)

When rendering the map view:
1. For destinations **with valid addresses**: Uses `getNeighborhoodCoordinates()` to get approximate coordinates
2. For destinations **with NULL addresses**: Function returns `null`, and grid coordinates are used as fallback
3. **No errors thrown** - graceful handling of null values

### Destination Detail Page (`/destinations/[id]`)

When showing individual destination:
1. **If `destination.location` is NULL**: Map section is not rendered at all (conditional rendering)
2. **If `destination.location` has a value**: Map component loads and geocodes the address
3. **If geocoding fails**: Shows error state with message "No address available"

## Testing

The fix handles these scenarios:

✅ **Destination with valid address**: Map shows correctly  
✅ **Destination with NULL address**: No error, uses fallback coordinates (list view) or hides map (detail view)  
✅ **Destination with empty string**: Treated as invalid, same as NULL  
✅ **Destination with whitespace only**: Treated as invalid, same as NULL  

## Files Modified

1. `/kinxplore/src/lib/geocoding.ts` - Added null checks to both functions
2. `/kinxplore/src/components/DestinationMap.tsx` - Added null handling in component
3. This fix document

## Prevention

To prevent similar issues in the future:

1. ✅ Always check for null/undefined before calling string methods
2. ✅ Use TypeScript union types (`string | null | undefined`) for optional fields
3. ✅ Add validation at the start of functions that process user data
4. ✅ Use conditional rendering for components that depend on optional data

## Related

- **Address Validation**: See `DESTINATION_MAP_IMPLEMENTATION.md`
- **Map Implementation**: See `MAP_QUICK_REFERENCE.md`
- **Database Migration**: `allow_null_location_for_destinations`
