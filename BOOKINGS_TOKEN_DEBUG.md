# Bookings Token Authentication Debug Guide

## Issue: 401 Unauthorized Error

When accessing the bookings page, you're getting a 401 error because the backend cannot validate the token.

## Root Cause

The token from Supabase session needs to be properly extracted and sent to the backend API.

## Solution Applied

### 1. Enhanced Token Retrieval
Added better error handling and logging when getting the Supabase session:

```typescript
const { data: { session }, error: sessionError } = await supabase.auth.getSession();

if (sessionError || !session) {
  console.error("Session error:", sessionError);
  router.push(`/login?returnUrl=/bookings`);
  return;
}

const token = session.access_token;
console.log("Using token:", token.substring(0, 20) + "...");
```

### 2. Token Refresh on 401
Added automatic token refresh if the token is expired:

```typescript
catch (err: any) {
  if (err.status === 401) {
    // Token might be expired, try to refresh
    const { data: { session } } = await supabase.auth.refreshSession();
    if (!session) {
      router.push(`/login?returnUrl=/bookings`);
    } else {
      // Retry with new token
      loadBookings();
    }
  }
}
```

## Debugging Steps

### Step 1: Check Browser Console
Open the browser console (F12) and look for:
- "Session error:" - Indicates session retrieval failed
- "No access token in session" - Session exists but no token
- "Using token: ..." - Token was found and is being used
- "Error loading bookings:" - API call failed

### Step 2: Check Supabase Session
In browser console, run:
```javascript
// Check if session exists
const { data } = await supabase.auth.getSession();
console.log("Session:", data.session);
console.log("Token:", data.session?.access_token);
```

### Step 3: Check Backend Logs
In your backend terminal, look for:
- "No authorization header found" - Token not sent
- "Invalid authorization header format" - Token format wrong
- "Invalid or expired token" - Token validation failed

### Step 4: Test Token Manually
```bash
# Get your token from browser console
TOKEN="your_token_here"

# Test the backend endpoint
curl -X GET "http://localhost:2431/api/bookings/my-bookings" \
  -H "Authorization: Bearer $TOKEN"
```

## Common Issues & Solutions

### Issue 1: Token Not Found
**Symptom:** "No access token in session"

**Cause:** User not properly logged in or session expired

**Solution:**
1. Logout completely
2. Clear browser cache
3. Login again
4. Try accessing bookings

### Issue 2: Token Expired
**Symptom:** 401 error, "Invalid or expired token"

**Cause:** Supabase session expired

**Solution:**
- The code now automatically refreshes the token
- If refresh fails, user is redirected to login

### Issue 3: Wrong Token Format
**Symptom:** "Invalid authorization header format"

**Cause:** Token not sent as "Bearer {token}"

**Solution:**
- Check `bookingsApi` in `/src/lib/api.ts`
- Ensure Authorization header is: `Bearer ${token}`

### Issue 4: Backend Not Running
**Symptom:** Network error, cannot connect

**Solution:**
```bash
cd kinxplore-backend
npm run start:dev
```

### Issue 5: CORS Error
**Symptom:** CORS policy error in browser

**Solution:**
- Check backend CORS configuration
- Ensure frontend URL is allowed

## Verification Checklist

Before accessing bookings page:

- [ ] Backend is running (`http://localhost:2431`)
- [ ] You are logged in (check Navigation shows user profile)
- [ ] Supabase session exists (check browser console)
- [ ] Token is present in session
- [ ] Backend can connect to Supabase

## Testing Flow

### 1. Fresh Login Test
```bash
1. Logout if logged in
2. Clear browser cache (Cmd+Shift+Delete)
3. Go to /login
4. Login with valid credentials
5. Open browser console
6. Navigate to /bookings
7. Check console for token logs
8. Verify bookings load or see error
```

### 2. Token Validation Test
```javascript
// In browser console after login
const { data: { session } } = await supabase.auth.getSession();
console.log("User ID:", session.user.id);
console.log("Token:", session.access_token);
console.log("Expires at:", new Date(session.expires_at * 1000));
```

### 3. Backend Validation Test
```bash
# In terminal
cd kinxplore-backend
npm run start:dev

# Watch for authentication logs
# Should see token validation attempts
```

## Expected Console Output

### Success Case
```
Using token: eyJhbGciOiJIUzI1NiIs...
Bookings loaded successfully
```

### Failure Case
```
Session error: [error details]
OR
No access token in session
OR
Error loading bookings: ApiError: Invalid or expired token
```

## Environment Variables

Ensure these are set in backend `.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

And in frontend `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:2431
```

## Backend Token Validation Flow

1. Request arrives with `Authorization: Bearer {token}`
2. AuthGuard extracts token
3. Calls `authService.verifyToken(token)`
4. Supabase validates token with `getUser(token)`
5. If valid, fetches user profile
6. Attaches user info to request
7. Proceeds to controller

## Quick Fix Commands

### Reset Everything
```bash
# Frontend
cd kinxplore
rm -rf .next
npm run dev

# Backend
cd kinxplore-backend
rm -rf dist
npm run start:dev

# Browser
# Clear all site data
# Logout and login again
```

### Check Supabase Connection
```bash
# In backend terminal
curl -X GET "https://your-project.supabase.co/rest/v1/" \
  -H "apikey: your_anon_key"
```

## Still Not Working?

If after all these steps it still doesn't work:

1. **Check Supabase Dashboard**
   - Go to Authentication → Users
   - Verify your user exists
   - Check if user has a profile in profiles table

2. **Check Backend Database Connection**
   - Verify SUPABASE_URL and SUPABASE_KEY
   - Test connection to Supabase

3. **Check Token Expiry**
   - Supabase tokens expire after 1 hour by default
   - Try logging out and back in

4. **Check Browser Network Tab**
   - Look at the actual request being sent
   - Verify Authorization header is present
   - Check the token value

5. **Enable Debug Mode**
   - Add more console.logs in the code
   - Check both frontend and backend logs

---

**Last Updated:** February 1, 2026  
**Status:** Enhanced with auto-refresh and better error handling
