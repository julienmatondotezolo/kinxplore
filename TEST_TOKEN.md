# Token Authentication Test

## The Problem

You're getting 401 Unauthorized errors because the backend cannot validate the Supabase token from the frontend.

## Quick Fix Steps

### Step 1: Verify Supabase Configuration Match

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Backend** (`.env`):
```env
SUPABASE_URL=https://your-project.supabase.co  # MUST BE SAME
SUPABASE_KEY=your_anon_key  # MUST BE SAME
```

⚠️ **CRITICAL**: Both must use the SAME Supabase project URL and the SAME anon key!

### Step 2: Test Token in Browser Console

1. Open browser console (F12)
2. Navigate to any page (while logged in)
3. Run this code:

```javascript
// Get the session
const { data: { session } } = await supabase.auth.getSession();
console.log("Session:", session);
console.log("Token:", session?.access_token);
console.log("User ID:", session?.user?.id);

// Test the backend
const token = session?.access_token;
const response = await fetch('http://localhost:2431/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
console.log("Backend response:", await response.json());
```

**Expected Output:**
- If working: Your user profile data
- If not working: 401 Unauthorized error

### Step 3: Manual Token Test

```bash
# In browser console, copy your token
const { data: { session } } = await supabase.auth.getSession();
console.log(session.access_token);

# Then in terminal, test it:
TOKEN="paste_your_token_here"

curl -X GET "http://localhost:2431/api/auth/profile" \
  -H "Authorization: Bearer $TOKEN"
```

## Most Likely Causes

### 1. Different Supabase Projects
**Problem:** Frontend and backend using different Supabase projects

**Check:**
```bash
# Frontend
cat kinxplore/.env.local | grep SUPABASE_URL

# Backend  
cat kinxplore-backend/.env | grep SUPABASE_URL
```

**Fix:** Make sure they're the SAME URL

### 2. Different Supabase Keys
**Problem:** Frontend and backend using different keys

**Check:**
```bash
# Frontend
cat kinxplore/.env.local | grep SUPABASE_ANON_KEY

# Backend
cat kinxplore-backend/.env | grep SUPABASE_KEY
```

**Fix:** Make sure they're the SAME key

### 3. Backend Using Service Role Key
**Problem:** Backend accidentally using service_role key instead of anon key

**Fix:** Backend should use the ANON key, not service_role key

### 4. Token Format Issue
**Problem:** Token not being sent correctly

**Check:** Look at Network tab in browser, check the Authorization header

**Fix:** Should be `Authorization: Bearer eyJhbGc...`

## Complete Reset

If nothing works, do a complete reset:

```bash
# 1. Stop everything
# Kill all node processes

# 2. Clear frontend
cd kinxplore
rm -rf .next node_modules
npm install
npm run dev

# 3. Clear backend
cd kinxplore-backend
rm -rf dist node_modules
npm install
npm run start:dev

# 4. Clear browser
# Open browser
# Clear all site data
# Logout
# Login again
```

## Environment File Template

### Frontend `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://itthtlyxykrnfemmuuta.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_API_URL=http://localhost:2431
```

### Backend `.env`
```env
SUPABASE_URL=https://itthtlyxykrnfemmuuta.supabase.co
SUPABASE_KEY=your_anon_key_here
PORT=2431
```

## Debug Commands

### Check if backend can connect to Supabase
```bash
cd kinxplore-backend
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
supabase.auth.getSession().then(console.log);
"
```

### Check frontend Supabase connection
Open browser console:
```javascript
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
const { data } = await supabase.auth.getSession();
console.log("Session exists:", !!data.session);
```

## Still Not Working?

If you've tried everything and it still doesn't work, the issue might be:

1. **Supabase RLS Policies** - Check if Row Level Security is blocking requests
2. **Supabase JWT Secret** - Backend might need the JWT secret for validation
3. **Token Expiry** - Token expired (default 1 hour)
4. **Network Issues** - CORS or firewall blocking requests

---

**Next Step:** Run the browser console test from Step 2 and share the output!
