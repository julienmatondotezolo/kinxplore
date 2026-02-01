# Booking Management System

This document describes the complete booking management system implementation for KinXplore.

## Overview

The booking management system allows users to:
- View all their bookings
- Filter bookings by status (pending, confirmed, cancelled, completed)
- See booking statistics
- Cancel bookings with optional reason
- View detailed booking information

## Database Structure

### Booking Fields (Supabase)

**Required Fields:**
- `user_id` (uuid) - User who made the booking
- `destination_id` (uuid) - Destination being booked
- `booking_date` (date) - Date of the booking
- `number_of_guests` (integer) - Number of guests (minimum: 1)
- `total_price` (numeric) - Total price (calculated from destination price × guests)
- `contact_email` (text) - Contact email
- `status` (enum) - Booking status: `pending`, `confirmed`, `cancelled`, `completed`

**Optional Fields:**
- `special_requests` (text) - Special requests from the user
- `contact_phone` (text) - Contact phone number
- `cancelled_at` (timestamp) - When the booking was cancelled
- `cancellation_reason` (text) - Reason for cancellation

**Auto-generated Fields:**
- `id` (uuid) - Unique booking identifier
- `created_at` (timestamp) - When the booking was created
- `updated_at` (timestamp) - Last update timestamp

## Backend API

### User Booking Routes

All routes require authentication (Bearer token).

#### Get All User Bookings
```
GET /api/bookings/my-bookings
Authorization: Bearer {token}
```

Returns an array of bookings with destination details.

#### Get User Booking Statistics
```
GET /api/bookings/my-bookings/stats
Authorization: Bearer {token}
```

Returns:
```json
{
  "total": 10,
  "pending": 2,
  "confirmed": 5,
  "cancelled": 1,
  "completed": 2,
  "totalSpent": 5000.00
}
```

#### Get Specific Booking
```
GET /api/bookings/my-bookings/:id
Authorization: Bearer {token}
```

Returns a single booking with full details.

#### Create Booking
```
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "destination_id": "uuid",
  "booking_date": "2024-12-25",
  "number_of_guests": 2,
  "contact_email": "user@example.com",
  "contact_phone": "+1234567890",
  "special_requests": "Early check-in please"
}
```

#### Update Booking
```
PUT /api/bookings/my-bookings/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "booking_date": "2024-12-26",
  "number_of_guests": 3,
  "contact_email": "newemail@example.com",
  "contact_phone": "+1234567890",
  "special_requests": "Updated request"
}
```

Note: Users can only update pending or confirmed bookings.

#### Cancel Booking
```
POST /api/bookings/my-bookings/:id/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Change of plans"
}
```

## Frontend Implementation

### Bookings Page

Location: `/src/app/[locale]/(pages)/bookings/page.tsx`

Features:
- **Statistics Dashboard** - Shows total, pending, confirmed, completed bookings and total spent
- **Status Filters** - Filter bookings by status (all, pending, confirmed, completed, cancelled)
- **Booking Cards** - Display booking details with images, dates, guests, contact info
- **Cancel Modal** - Modal to cancel bookings with optional reason
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Multilingual** - Supports English, French, and Dutch

### API Client

Location: `/src/lib/api.ts`

New exports:
- `Booking` interface
- `CreateBookingDto` interface
- `UpdateBookingDto` interface
- `BookingStats` interface
- `bookingsApi` object with all booking methods

Example usage:
```typescript
import { bookingsApi } from "@/lib/api";

// Get user's bookings
const token = localStorage.getItem("access_token");
const bookings = await bookingsApi.getMyBookings(token);

// Cancel a booking
await bookingsApi.cancelMyBooking(bookingId, "Reason here", token);
```

### Navigation Integration

The bookings page is accessible from:
- User dropdown menu → "My Bookings"
- Direct URL: `/bookings`

## Translations

Translations added to all three language files:

- **English** (`messages/en.json`)
- **French** (`messages/fr.json`)
- **Dutch** (`messages/nl.json`)

Translation keys under `Bookings`:
- `title`, `subtitle`, `loading`, `noBookings`
- `stats.*` - Statistics labels
- `filters.*` - Filter button labels
- `status.*` - Status labels
- `cancelModal.*` - Cancel modal text

## User Flow

1. **View Bookings**
   - User clicks "My Bookings" in navigation dropdown
   - System loads all bookings and statistics
   - Bookings are displayed with status badges

2. **Filter Bookings**
   - User clicks filter button (All, Pending, Confirmed, etc.)
   - List updates to show only matching bookings

3. **Cancel Booking**
   - User clicks "Cancel Booking" button on a pending/confirmed booking
   - Modal appears asking for confirmation and optional reason
   - User confirms cancellation
   - System updates booking status to cancelled
   - List refreshes to show updated status

4. **View Destination**
   - User clicks "View Destination" on any booking
   - Navigates to destination detail page

## Security

- All routes require authentication
- Users can only view and manage their own bookings
- Cancelled and completed bookings cannot be modified
- JWT token validation on backend
- RLS (Row Level Security) enabled on Supabase

## Error Handling

- 401 Unauthorized → Redirect to login page
- 404 Not Found → Booking not found message
- 403 Forbidden → Cannot modify other users' bookings
- Network errors → Display error message to user

## Testing

To test the booking management system:

1. **Login as a user**
   ```
   Navigate to /login
   ```

2. **Create a booking**
   ```
   Navigate to any destination
   Click "Book Now"
   Fill in booking details
   Submit booking
   ```

3. **View bookings**
   ```
   Click user dropdown → My Bookings
   Verify booking appears in list
   Check statistics are correct
   ```

4. **Filter bookings**
   ```
   Click different filter buttons
   Verify correct bookings are shown
   ```

5. **Cancel booking**
   ```
   Click "Cancel Booking" on a pending booking
   Add optional reason
   Confirm cancellation
   Verify status updates to "Cancelled"
   ```

## Future Enhancements

Potential improvements:
- Email notifications for booking confirmations and cancellations
- PDF booking receipts
- Booking modification (change dates/guests)
- Payment integration
- Review system after completed bookings
- Booking reminders
- Refund processing for cancellations

## Files Modified/Created

### Backend
- `/src/booking/booking.controller.ts` - Added user-specific routes
- `/src/booking/booking.service.ts` - Already had all necessary methods

### Frontend
- `/src/lib/api.ts` - Added booking API functions
- `/src/app/[locale]/(pages)/bookings/page.tsx` - New bookings page
- `/messages/en.json` - Added English translations
- `/messages/fr.json` - Added French translations
- `/messages/nl.json` - Added Dutch translations
- `/src/components/Navigation.tsx` - Already had bookings link

## Support

For issues or questions:
- Check backend logs for API errors
- Check browser console for frontend errors
- Verify authentication token is valid
- Ensure Supabase connection is working
