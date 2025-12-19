# Zustand State Management Implementation

## Overview

This document describes the implementation of Zustand state management for the KinXplore destinations filtering system with smooth animations.

## Features Implemented

### 1. Zustand Store (`src/store/useDestinationStore.ts`)

A centralized state management solution for:
- **Destinations data**: Stores all destinations fetched from the backend
- **Categories data**: Stores all categories with subcategories
- **Active filters**: Category selection, search query, price range
- **Loading states**: Tracks loading and error states
- **Computed functions**: Filters destinations based on active filters

#### Key Functions:
- `setDestinations()` - Update destinations in store
- `setCategories()` - Update categories in store
- `setActiveCategory()` - Set active category filter
- `setSearchQuery()` - Set search query filter
- `getFilteredDestinations()` - Get filtered destinations based on all active filters
- `getCategoryList()` - Get list of available categories
- `resetFilters()` - Reset all filters to default

#### Persistence:
- Filters are persisted to localStorage
- Data is not persisted (fetched fresh on page load)

### 2. Animated Components

#### DestinationSearch Component (`src/components/DestinationSearch.tsx`)
- Search input with focus animations
- Debounced search (300ms delay)
- Clear button with rotation animation
- Scale and shadow effects on focus

#### ResultsCounter Component (`src/components/ResultsCounter.tsx`)
- Animated counter with number transitions
- Shows filtered vs total destinations
- Spring animations for smooth appearance

### 3. Enhanced Destinations Page

#### Category Filtering Animations:
- **Layout animations**: Smooth transitions when switching categories
- **Active indicator**: Animated background that slides between active categories
- **Count badges**: Display number of results for active category
- **Filter chips**: Show active filters with remove buttons

#### Card Animations:
- **Staggered entrance**: Cards appear one by one with delay
- **Hover effects**: Cards lift and scale on hover
- **Image zoom**: Images zoom smoothly on hover
- **Badge animations**: Tags and ratings animate on load
- **Star rotation**: Rating stars have subtle rotation animation
- **Arrow button**: Appears with slide animation on hover

#### Grid Animations:
- **AnimatePresence**: Smooth transitions when cards are added/removed
- **Layout animations**: Cards reposition smoothly when filtering
- **Empty state**: Animated empty state with call-to-action

### 4. Animation Variants

```typescript
// Card entrance animation
itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.9, y: -20 }
}

// Category button animation
categoryButtonVariants = {
  inactive: { scale: 1, backgroundColor: "white" },
  active: { scale: 1.05, backgroundColor: "blue" },
  hover: { scale: 1.08 },
  tap: { scale: 0.95 }
}

// Filter count badge animation
filterCountVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 }
}
```

## Usage

### Accessing the Store

```typescript
import { useDestinationStore } from "@/store/useDestinationStore";

function MyComponent() {
  const {
    destinations,
    activeCategory,
    setActiveCategory,
    getFilteredDestinations,
  } = useDestinationStore();

  const filtered = getFilteredDestinations();
  
  return (
    <div>
      <button onClick={() => setActiveCategory("hotel")}>
        Show Hotels
      </button>
      {filtered.map(dest => <div key={dest.id}>{dest.name}</div>)}
    </div>
  );
}
```

### Syncing with React Query

The store automatically syncs with React Query data:

```typescript
const { data: destinations } = useDestinations();
const { setDestinations } = useDestinationStore();

useEffect(() => {
  if (destinations) {
    setDestinations(destinations);
  }
}, [destinations, setDestinations]);
```

## File Structure

```
src/
├── store/
│   └── useDestinationStore.ts       # Zustand store
├── components/
│   ├── DestinationSearch.tsx        # Search component with animations
│   └── ResultsCounter.tsx           # Animated results counter
└── app/
    └── [locale]/
        └── (pages)/
            └── destinations/
                └── page.tsx          # Updated destinations page
```

## Animation Details

### Timing Functions
- **Entrance**: Cubic bezier [0.25, 0.46, 0.45, 0.94] for smooth entry
- **Hover**: Spring with stiffness 400, damping 17
- **Exit**: 0.3s duration for quick removal

### Stagger Delays
- Category buttons: 0.05s per item
- Destination cards: 0.08s per item
- Badge animations: 0.1s per badge

### Performance Optimizations
- `layout` prop for smooth repositioning
- `AnimatePresence` with `mode="popLayout"` for better grid animations
- Debounced search to reduce re-renders
- Memoized filter functions in store

## Browser Support

All animations use Framer Motion which supports:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

1. **Advanced Filters**:
   - Price range slider with animation
   - Rating filter
   - Location-based filtering

2. **Sort Options**:
   - Sort by price, rating, name
   - Animated sort transitions

3. **View Modes**:
   - Grid/List toggle with layout animations
   - Different card sizes

4. **Favorites**:
   - Save favorite destinations
   - Animated heart icon

5. **Share Filters**:
   - URL-based filter state
   - Share filtered results

## Testing

To test the implementation:

1. Start the backend: `cd kinxplore-backend && npm run start:dev`
2. Start the frontend: `cd kinxplore && npm run dev`
3. Navigate to `/destinations`
4. Try:
   - Clicking different category buttons
   - Searching for destinations
   - Hovering over cards
   - Switching between filters quickly

## Troubleshooting

### Animations not working
- Check that Framer Motion is installed: `npm list framer-motion`
- Verify `"use client"` directive is at the top of components

### Store not persisting
- Check localStorage in browser DevTools
- Look for `destination-storage` key

### Filters not applying
- Check Redux DevTools (Zustand DevTools)
- Verify `getFilteredDestinations()` logic
- Check console for errors

## Performance Notes

- Store updates are batched for better performance
- Filters are computed on-demand, not stored
- Persistence only saves filters, not large data arrays
- Animations use GPU acceleration via `transform` and `opacity`


