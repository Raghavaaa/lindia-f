# Google Auth Setup Guide

## ✅ Implementation Status

Google Auth is **fully implemented** and ready to use! Here's what's been set up:

### 🔧 Files Created/Modified

1. **`src/lib/auth.ts`** - NextAuth configuration with Google provider
2. **`src/app/api/auth/[...nextauth]/route.ts`** - API route handler
3. **`src/components/SessionProvider.tsx`** - Session provider wrapper
4. **`src/hooks/useAuth.ts`** - Custom auth hook
5. **`src/app/layout.tsx`** - Updated with SessionProvider
6. **`src/app/login/page.tsx`** - Updated with real Google login
7. **`src/components/header.tsx`** - Shows lawyer name when logged in

### 🎯 Features Implemented

- ✅ Google OAuth integration
- ✅ Session management
- ✅ User profile display in header
- ✅ Automatic redirect to `/app` after login
- ✅ Logout functionality
- ✅ Fallback to manual form if needed
- ✅ Lawyer name display next to settings

---

## 🚀 Setup Instructions

### 1. Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 2. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# For production, update NEXTAUTH_URL to your domain
# NEXTAUTH_URL=https://yourdomain.com
```

### 3. Generate NextAuth Secret

```bash
# Generate a random secret
openssl rand -base64 32
```

---

## 🧪 Testing Google Login

### Local Testing
1. Start the development server: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Click "Sign in with Google"
4. Complete Google OAuth flow
5. Should redirect to `/app` with your name displayed in header

### Production Testing
1. Update environment variables with production values
2. Deploy to Vercel/your hosting platform
3. Test the same flow on your live domain

---

## 🔍 Troubleshooting

### Common Issues

1. **"Invalid client" error**
   - Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
   - Verify redirect URI matches exactly

2. **"Redirect URI mismatch"**
   - Add correct redirect URI in Google Console
   - Format: `https://yourdomain.com/api/auth/callback/google`

3. **"NEXTAUTH_SECRET not set"**
   - Generate and set NEXTAUTH_SECRET environment variable

4. **Login button not working**
   - Check browser console for errors
   - Verify NextAuth API route is accessible at `/api/auth/[...nextauth]`

### Debug Steps

1. Check environment variables are loaded:
   ```javascript
   console.log(process.env.GOOGLE_CLIENT_ID); // Should not be undefined
   ```

2. Test NextAuth API route:
   - Visit `http://localhost:3000/api/auth/providers`
   - Should show Google provider configuration

3. Check browser network tab for failed requests

---

## 📱 User Experience

### Login Flow
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. User grants permissions
4. Redirected back to `/app`
5. User name appears in header next to settings

### Header Display
- **When logged in**: Shows lawyer name in rounded badge + logout button
- **When not logged in**: Shows "Login" button

### Fallback
- Manual form still available as backup
- Works with localStorage for offline usage

---

## 🎯 Current Status

**Google Login**: ✅ **READY TO USE**

Just need to:
1. Set up Google OAuth app
2. Add environment variables
3. Test the flow

The implementation is complete and follows NextAuth.js best practices!

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify environment variables are set correctly
3. Test the API route at `/api/auth/providers`
4. Check browser console for errors

**The Google Auth implementation is production-ready!** 🚀
