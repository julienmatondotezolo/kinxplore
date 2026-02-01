# Map Component - Hide on Geocoding Failure

## Update Summary

Updated the `DestinationMap` component and destination detail page to completely hide the location section when geocoding fails, instead of showing an error message.

## Changes Made

### 1. DestinationMap Component

**File**: `/kinxplore/src/components/DestinationMap.tsx`

**Changes**:
- Added `onLoadError` callback prop to notify parent when geocoding fails
- Component returns `null` when geocoding fails (instead of showing error UI)
- Callback is triggered in all error scenarios:
  - Invalid/empty address
  - Geocoding API failure
  - No results found

```typescript
interface DestinationMapProps {
  address: string | null | undefined;
  destinationName: string;
  className?: string;
  onLoadError?: () => void; // ✅ New callback prop
}

// When geocoding fails:
if (error || !coordinates) {
  return null; // ✅ Hide component completely
}
```

### 2. Destination Detail Page

**File**: `/kinxplore/src/app/[locale]/(pages)/destinations/[id]/page.tsx`

**Changes**:
- Added `showLocationSection` state to track if location should be displayed
- Pass `onLoadError` callback to hide the entire location section when map fails
- Section includes both the heading and the map, so everything is hidden together

```typescript
// Track if map loaded successfully
const [showLocationSection, setShowLocationSection] = useState(true);

// In the render:
{destination.location && showLocationSection && (
  <section className="space-y-8 pt-10 border-t border-gray-100">
    <div className="flex items-center justify-between">
      <h2>{t("location")}</h2>
      <div>
        <MapPin />
        <span>{destination.location}</span>
      </div>
    </div>
    <DestinationMap
      address={destination.location}
      destinationName={destination.name}
      className="h-[400px] w-full"
      onLoadError={() => setShowLocationSection(false)} // ✅ Hide section on error
    />
  </section>
)}
```

## Behavior

### Before
1. User visits destination with address "Galleria Mall, 3e étage, Avenue du Mall, croisement Colonel Lukusa, Kinshasa"
2. Geocoding fails (can't find coordinates)
3. Shows error UI: "Unable to locate this address on the map" with a gray placeholder

### After
1. User visits destination with address "Galleria Mall, 3e étage, Avenue du Mall, croisement Colonel Lukusa, Kinshasa"
2. Geocoding fails (can't find coordinates)
3. **Entire location section is hidden** - no error message, no placeholder, clean UI

## User Experience

✅ **Cleaner UI** - No error messages or placeholders  
✅ **Less confusion** - Users don't see "Unable to locate" errors  
✅ **Seamless** - Page looks complete even without map  
✅ **No broken elements** - Failed maps don't leave visual artifacts  

## Technical Details

### Loading States

1. **Initial Load**: Shows loading spinner
2. **Geocoding Success**: Shows interactive map
3. **Geocoding Failure**: Component returns `null`, parent hides section

### Callback Flow

```
DestinationDetailPage
  └─> showLocationSection = true (initial)
  └─> renders <DestinationMap onLoadError={...} />
       └─> geocoding fails
       └─> calls onLoadError()
            └─> setShowLocationSection(false)
                 └─> section is hidden via conditional rendering
```

### Edge Cases Handled

✅ Address is NULL in database → Section never renders  
✅ Address exists but geocoding fails → Section hides after loading  
✅ Address is empty string → Section hides immediately  
✅ Network error during geocoding → Section hides after error  
✅ No results from Nominatim → Section hides after no results  

## Testing

To test the behavior:

1. **Destination with valid geocodable address**:
   - Location section shows with working map
   - Example: "119 Boulevard du 30 Juin - Gombe"

2. **Destination with non-geocodable address**:
   - Location section briefly shows loading
   - Then entire section disappears
   - Example: "Galleria Mall, 3e étage, Avenue du Mall, croisement Colonel Lukusa, Kinshasa"

3. **Destination with NULL address**:
   - Location section never appears
   - No loading state shown

## Files Modified

1. `/kinxplore/src/components/DestinationMap.tsx`
   - Added `onLoadError` callback prop
   - Returns `null` on error instead of error UI

2. `/kinxplore/src/app/[locale]/(pages)/destinations/[id]/page.tsx`
   - Added `showLocationSection` state
   - Conditional rendering based on state
   - Passes callback to hide section

## Related Documentation

- `DESTINATION_MAP_IMPLEMENTATION.md` - Original map implementation
- `MAP_QUICK_REFERENCE.md` - Usage guide
- `BUGFIX_NULL_ADDRESS.md` - Null address handling fix
