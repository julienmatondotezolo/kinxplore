# Booking Management - Quick Reference

## 🎯 Quick Start

### For Users

1. **View Your Bookings**
   - Click your profile picture in navigation
   - Select "My Bookings"
   - Or navigate to `/bookings`

2. **Filter Bookings**
   - Click filter buttons: All, Pending, Confirmed, Completed, Cancelled
   - View statistics at the top of the page

3. **Cancel a Booking**
   - Find the booking you want to cancel
   - Click "Cancel Booking" button
   - Optionally add a reason
   - Confirm cancellation

### For Developers

#### Backend Routes

```bash
# Get all user bookings
GET /api/bookings/my-bookings
Authorization: Bearer {token}

# Get booking statistics
GET /api/bookings/my-bookings/stats
Authorization: Bearer {token}

# Get specific booking
GET /api/bookings/my-bookings/:id
Authorization: Bearer {token}

# Create booking
POST /api/bookings
Authorization: Bearer {token}
Body: { destination_id, booking_date, number_of_guests, contact_email, ... }

# Update booking
PUT /api/bookings/my-bookings/:id
Authorization: Bearer {token}
Body: { booking_date?, number_of_guests?, contact_email?, ... }

# Cancel booking
POST /api/bookings/my-bookings/:id/cancel
Authorization: Bearer {token}
Body: { reason?: string }
```

#### Frontend Usage

```typescript
import { bookingsApi } from "@/lib/api";

// Get token
const token = localStorage.getItem("access_token");

// Get all bookings
const bookings = await bookingsApi.getMyBookings(token);

// Get statistics
const stats = await bookingsApi.getMyBookingStats(token);

// Cancel booking
await bookingsApi.cancelMyBooking(bookingId, "Reason", token);
```

## 📊 Booking Fields

### Required
- `destination_id` - UUID of destination
- `booking_date` - Date string (YYYY-MM-DD)
- `number_of_guests` - Integer (min: 1)
- `contact_email` - Email address
- `status` - pending | confirmed | cancelled | completed

### Optional
- `contact_phone` - Phone number
- `special_requests` - Text
- `cancellation_reason` - Text (when cancelled)

## 🧪 Testing

### Backend Test Script

```bash
cd kinxplore-backend
./test-booking-api.sh
```

This will:
1. Login as test user
2. Create a booking
3. Fetch all bookings
4. Get statistics
5. Update booking
6. Cancel booking

### Manual Testing

1. **Start Backend**
   ```bash
   cd kinxplore-backend
   npm run start:dev
   ```

2. **Start Frontend**
   ```bash
   cd kinxplore
   npm run dev
   ```

3. **Test Flow**
   - Login at `/login`
   - Book a destination
   - Go to `/bookings`
   - View, filter, and cancel bookings

## 🔒 Security

- All routes require authentication
- Users can only access their own bookings
- JWT token validation
- RLS enabled on Supabase

## 🌍 Translations

Supported languages:
- English (`en`)
- French (`fr`)
- Dutch (`nl`)

All booking-related text is translated.

## 📱 Responsive Design

The bookings page is fully responsive:
- Mobile: Stacked layout, touch-friendly
- Tablet: Grid layout with 2 columns
- Desktop: Full-width cards with images

## 🎨 Status Colors

- **Pending** - Yellow
- **Confirmed** - Green
- **Cancelled** - Red
- **Completed** - Blue

## 🚀 Features

✅ View all bookings with images  
✅ Filter by status  
✅ Booking statistics dashboard  
✅ Cancel bookings with reason  
✅ Responsive design  
✅ Multilingual support  
✅ Real-time updates  
✅ Error handling  

## 📝 Common Tasks

### Add a new booking status

1. Update enum in Supabase
2. Update `Booking` interface in `api.ts`
3. Add color in `getStatusColor()` function
4. Add icon in `getStatusIcon()` function
5. Add translations

### Customize booking card

Edit `/src/app/[locale]/(pages)/bookings/page.tsx`:
- Line 300+: Booking card rendering
- Modify layout, colors, or information displayed

### Add new filter

1. Add button in filters section (line 220+)
2. Update `filteredBookings` logic (line 130+)
3. Add translation key

## 🐛 Troubleshooting

**"Failed to load bookings"**
- Check if backend is running
- Verify authentication token
- Check browser console for errors

**"Unauthorized" error**
- Token expired, login again
- Check token is being sent correctly

**Bookings not showing**
- Verify user has bookings in database
- Check filter is set to "All"
- Clear browser cache

## 📚 Related Files

**Backend:**
- `src/booking/booking.controller.ts` - API routes
- `src/booking/booking.service.ts` - Business logic
- `src/booking/dto/*.dto.ts` - Data transfer objects

**Frontend:**
- `src/app/[locale]/(pages)/bookings/page.tsx` - Bookings page
- `src/lib/api.ts` - API client
- `messages/*.json` - Translations
- `src/components/Navigation.tsx` - Navigation menu

## 🔗 Links

- [Full Documentation](./BOOKING_MANAGEMENT.md)
- [Backend API Test Script](../kinxplore-backend/test-booking-api.sh)
- [Supabase Dashboard](https://supabase.com/dashboard)

---

**Last Updated:** February 2026  
**Version:** 1.0.0
