# Destination Filtering System Guide

## Quick Start

The destinations page now features an advanced filtering system with smooth animations powered by Zustand state management.

## Features

### 1. Category Filtering
- Click any category button to filter destinations
- Active category is highlighted with a blue background
- Smooth sliding animation shows which category is active
- Number badge shows how many destinations match the filter

### 2. Search Functionality
- Type in the search box to filter by name, location, or description
- Search is debounced (300ms) for better performance
- Clear button (X) appears when typing
- Results update automatically as you type

### 3. Results Counter
- Shows the number of filtered destinations
- Animated number counter
- Displays "of total" when filters are active

### 4. Visual Animations

#### Category Buttons
- **Hover**: Buttons scale up slightly
- **Click**: Button scales down (tap effect)
- **Active**: Blue background slides smoothly
- **Badge**: Shows result count with spring animation

#### Destination Cards
- **Entrance**: Cards fade in and slide up with stagger effect
- **Hover**: Card lifts up, image zooms, arrow button appears
- **Exit**: Cards fade out and scale down when filtered out
- **Layout**: Cards reposition smoothly when filtering

#### Empty State
- Animated compass icon
- Fade in text
- "Show All" button with hover effect

## Using the Store Programmatically

### Import the Store

```typescript
import { useDestinationStore } from "@/store/useDestinationStore";
```

### Available Actions

```typescript
// Get store values and actions
const {
  // Data
  destinations,
  categories,
  
  // Filters
  activeCategory,
  searchQuery,
  priceRange,
  
  // Actions
  setActiveCategory,
  setSearchQuery,
  setPriceRange,
  
  // Computed
  getFilteredDestinations,
  getCategoryList,
  resetFilters,
} = useDestinationStore();
```

### Examples

#### Filter by Category
```typescript
// Set active category
setActiveCategory("hotel");

// Reset to show all
setActiveCategory("all");
```

#### Search Destinations
```typescript
// Set search query
setSearchQuery("kinshasa");

// Clear search
setSearchQuery("");
```

#### Get Filtered Results
```typescript
// Get destinations matching all active filters
const filtered = getFilteredDestinations();

console.log(`Found ${filtered.length} destinations`);
```

#### Reset All Filters
```typescript
// Reset to default state
resetFilters();
```

#### Set Price Range
```typescript
// Filter by price range
setPriceRange({ min: 100, max: 500 });
```

## Animation Customization

### Timing
You can adjust animation timing in the page component:

```typescript
// Stagger delay between cards
staggerChildren: 0.08  // seconds

// Card entrance duration
duration: 0.5  // seconds

// Hover transition
duration: 0.3  // seconds
```

### Spring Physics
Category button animations use spring physics:

```typescript
transition: {
  type: "spring",
  stiffness: 400,  // Higher = snappier
  damping: 17,     // Higher = less bounce
}
```

### Easing Functions
Card animations use custom easing:

```typescript
ease: [0.25, 0.46, 0.45, 0.94]  // Cubic bezier
```

## Store Persistence

### What's Persisted
The following filter states are saved to localStorage:
- Active category
- Search query
- Price range

### What's NOT Persisted
- Destinations data (fetched fresh)
- Categories data (fetched fresh)
- Loading states

### Clear Persisted Data
```typescript
// Manually clear from localStorage
localStorage.removeItem('destination-storage');

// Or reset filters
resetFilters();
```

## Performance Tips

1. **Debounced Search**: Search input is debounced by 300ms to reduce re-renders
2. **Layout Animations**: Use `layout` prop for smooth repositioning without recalculation
3. **AnimatePresence**: Handles exit animations efficiently
4. **Computed Filters**: Filters are computed on-demand, not stored

## Keyboard Shortcuts

While no keyboard shortcuts are implemented yet, you can add them:

```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Escape to reset filters
    if (e.key === 'Escape') {
      resetFilters();
    }
    
    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      // Focus search input
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

## Accessibility

### ARIA Labels
Add ARIA labels for better accessibility:

```typescript
<button
  aria-label={`Filter by ${category}`}
  aria-pressed={activeCategory === category}
>
  {category}
</button>
```

### Keyboard Navigation
Ensure all interactive elements are keyboard accessible:
- Tab through category buttons
- Enter/Space to activate
- Focus visible indicators

### Screen Readers
Announce filter changes:

```typescript
<div role="status" aria-live="polite" className="sr-only">
  {filteredDestinations.length} destinations found
</div>
```

## Troubleshooting

### Filters Not Working
1. Check browser console for errors
2. Verify backend is running and returning data
3. Check Redux DevTools (Zustand DevTools extension)

### Animations Stuttering
1. Reduce `staggerChildren` delay
2. Disable animations for large datasets
3. Use `will-change` CSS property sparingly

### Store Not Updating
1. Verify you're using the store hook correctly
2. Check that data is being set: `setDestinations(data)`
3. Look for TypeScript errors

### Search Not Working
1. Check that search query is being set
2. Verify `getFilteredDestinations()` logic
3. Test with simple queries first

## API Integration

The store integrates with React Query hooks:

```typescript
// Fetch data
const { data: destinations } = useDestinations();
const { data: categories } = useCategories();

// Sync with store
useEffect(() => {
  if (destinations) setDestinations(destinations);
}, [destinations]);

useEffect(() => {
  if (categories) setCategories(categories);
}, [categories]);
```

## Future Enhancements

Planned features:
- [ ] Price range slider with animation
- [ ] Rating filter
- [ ] Sort options (price, rating, name)
- [ ] View mode toggle (grid/list)
- [ ] Favorite destinations
- [ ] Share filtered results via URL
- [ ] Advanced search with multiple criteria
- [ ] Filter presets (e.g., "Budget Friendly", "Luxury")

## Contributing

To add new filters:

1. Add state to store:
```typescript
newFilter: string;
setNewFilter: (value: string) => void;
```

2. Update `getFilteredDestinations()`:
```typescript
if (newFilter) {
  filtered = filtered.filter(/* your logic */);
}
```

3. Add UI component for the filter
4. Add animations for smooth transitions

