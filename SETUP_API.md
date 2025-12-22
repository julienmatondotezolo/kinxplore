# API Setup Guide

This guide explains how to set up the frontend to connect to the backend API.

## Prerequisites

- Backend server running at `http://localhost:2431`
- Node.js and npm installed

## Environment Variables

Create a `.env.local` file in the root of the frontend project with the following content:

```env
NEXT_PUBLIC_API_URL=http://localhost:2431/api
```

## API Integration

The frontend uses TanStack Query (React Query) to fetch data from the backend API.

### Available Hooks

#### Destinations

- `useDestinations()` - Fetch all destinations
- `useDestination(id)` - Fetch a single destination by ID
- `useDestinationMutation()` - Mutations for create/update/delete (placeholders for future implementation)

#### Categories

- `useCategories()` - Fetch all categories with subcategories
- `useCategory(id)` - Fetch a single category by ID
- `useCategoryMutation()` - Mutations for create/update/delete (placeholders for future implementation)

### Usage Example

```tsx
import { useDestinations } from "@/hooks/useDestinations";
import { useCategories } from "@/hooks/useCategories";

function MyComponent() {
  const { data: destinations, isLoading, error } = useDestinations();
  const { data: categories } = useCategories();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {destinations?.map(dest => (
        <div key={dest.id}>{dest.name}</div>
      ))}
    </div>
  );
}
```

## File Structure

```
src/
├── hooks/
│   ├── useDestinations.ts  # React Query hooks for destinations
│   └── useCategories.ts    # React Query hooks for categories
├── lib/
│   └── api.ts              # API client functions
└── types/
    └── api.types.ts        # TypeScript types matching backend
```

## API Endpoints

The frontend connects to the following backend endpoints:

- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get a single destination
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a single category

## Running the Application

1. Make sure the backend is running:
   ```bash
   cd kinxplore-backend
   npm run start:dev
   ```

2. Start the frontend:
   ```bash
   cd kinxplore
   npm run dev
   ```

3. Open your browser to `http://localhost:3001` (or the configured port)

4. Navigate to the Destinations page to see the data from the backend

## Troubleshooting

### CORS Issues

If you encounter CORS errors, make sure the backend has CORS enabled for `http://localhost:3001` (or your frontend URL).

### Connection Refused

If you see "Connection refused" errors:
1. Verify the backend is running
2. Check that the `NEXT_PUBLIC_API_URL` in `.env.local` matches your backend URL
3. Ensure the backend is listening on port 2431

### No Data Displayed

1. Check the browser console for errors
2. Verify the backend has data in the database
3. Test the API endpoints directly using curl or Postman:
   ```bash
   curl http://localhost:2431/api/destinations
   curl http://localhost:2431/api/categories
   ```
