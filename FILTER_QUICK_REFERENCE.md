# Filter Modal - Quick Reference Guide

## How to Use the Filter Modal

### Opening the Modal
- **Desktop**: Click the "Filters" button in the sticky category header
- **Mobile**: Click the "Filters" button in the mobile search bar

### Filter Options

#### 1. Price Range
- Set minimum price (default: $0)
- Set maximum price (default: $500)
- Visual slider shows selected range

#### 2. Rating
- Select minimum rating: 5★, 4★, 3★, 2★, or 1★
- Click again to deselect
- Only one rating can be selected at a time

#### 3. Categories
- Choose from available categories (Bar, Café, Hotel, etc.)
- Shows count of destinations per category
- Syncs with the main category filter

#### 4. Amenities
- Select multiple amenities:
  - WiFi
  - Parking
  - Pool
  - Restaurant
  - Bar
  - Gym
  - Spa
  - Air Conditioning

### Actions

#### Clear All
- Resets all filters to default values
- Returns to showing all destinations

#### Show X Results
- Applies selected filters
- Closes the modal
- Shows filtered destinations

#### Close (X button)
- Closes modal without clearing filters
- Keeps current filter selections

## Keyboard Shortcuts (Future Enhancement)
- `Esc` - Close modal
- `Enter` - Apply filters

## Filter State Persistence
Currently, filters persist when:
- Reopening the modal
- Switching between mobile and desktop views
- Navigating within the page

Filters reset when:
- Clicking "Clear All"
- Refreshing the page (future: add localStorage)

## Visual Indicators

### Active Filters
- **Blue border** and **blue background** indicate selected items
- **Checkmarks** appear on selected amenities
- **Star icons** fill yellow for selected rating

### Results Count
- Bottom of modal shows: "X destinations match your filters"
- Button shows: "Show X Results"

## Tips
1. Use price range to find destinations within your budget
2. Combine filters for more specific results
3. Clear individual filters by clicking them again
4. Use "Clear All" for a fresh start

## Mobile Optimizations
- Bottom sheet design for easy thumb access
- Larger touch targets
- Scrollable content area
- Fixed header and footer for context

## Troubleshooting

### Modal not opening?
- Check that JavaScript is enabled
- Verify no console errors
- Try refreshing the page

### Filters not working?
- Currently filters are UI-only
- Backend integration needed for actual filtering
- See FILTER_MODAL_IMPLEMENTATION.md for integration guide

### Results count not updating?
- This will work once filters are connected to the store
- See implementation guide for Zustand integration

## Next Steps for Developers

To make filters functional:

1. **Update Zustand Store** (`useDestinationStore.ts`):
```typescript
// Add to store state
priceRange: { min: 0, max: 500 },
selectedRating: null,
selectedAmenities: [],

// Add setters
setPriceRange: (range) => set({ priceRange: range }),
setSelectedRating: (rating) => set({ selectedRating: rating }),
setSelectedAmenities: (amenities) => set({ selectedAmenities: amenities }),
```

2. **Update Filter Logic**:
```typescript
// Modify getFilteredDestinations() to include new filters
```

3. **Connect Modal to Store**:
```typescript
// Replace local state with store state in destinations page
const { priceRange, setPriceRange } = useDestinationStore();
```

4. **Test All Scenarios**:
- Single filter
- Multiple filters combined
- Clear all functionality
- Edge cases (no results)

## Support
For questions or issues, refer to:
- FILTER_MODAL_IMPLEMENTATION.md (detailed documentation)
- Component code: `/src/app/[locale]/(pages)/destinations/page.tsx`
- Store code: `/src/store/useDestinationStore.ts`
