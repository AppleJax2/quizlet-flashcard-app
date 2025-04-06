# Deployment Fixes for CORS and JWT_SECRET Issues

This guide explains the changes made to fix the CORS and JWT_SECRET issues that were preventing successful authentication between your Netlify frontend and Render.com backend.

## What's Fixed

1. **CORS Configuration**: 
   - Updated the CORS settings in both `src/loaders/express.js` and `server/src/loaders/express.js`
   - Made CORS configuration more permissive to allow requests from your Netlify app
   - Added explicit support for preflight OPTIONS requests
   - Improved CORS error handling and logging

2. **JWT_SECRET Environment Variable**:
   - Created instructions for setting the JWT_SECRET environment variable in Render.com

## Deployment Steps

### 1. Commit and Push Changes

```bash
# Add the changed files
git add src/loaders/express.js server/src/loaders/express.js RENDER_ENV_SETUP.md DEPLOYMENT_FIXES.md

# Commit with a descriptive message
git commit -m "Fix CORS issues and provide JWT_SECRET setup instructions"

# Push to GitHub
git push origin main
```

### 2. Set Environment Variables in Render

Before your app will work correctly, you need to set the required environment variables in Render.com:

1. Go to the [Render Dashboard](https://dashboard.render.com/)
2. Navigate to your `quizlet-flashcard-api` service
3. Go to the "Environment" tab
4. Add or update the following environment variables:
   - **JWT_SECRET**: Generate a secure random value using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - **ALLOWED_ORIGINS**: Make sure this includes `https://lustrous-tartufo-9102a1.netlify.app`
   - **MONGODB_URI**: Set this to your MongoDB Atlas connection string

5. Click "Save Changes" to trigger a redeploy

### 3. Monitor Deployment

1. Watch the deployment logs in the Render dashboard
2. Verify that the application starts successfully without JWT_SECRET errors
3. Check that the CORS configuration is working by testing authentication from your Netlify app

### 4. Test Authentication Flow

After deployment, test the complete authentication flow:

1. Visit your Netlify frontend: https://lustrous-tartufo-9102a1.netlify.app
2. Try to register a new account
3. Check browser console for any CORS or API connection errors
4. If successful, you should be able to log in and use the protected routes

## Troubleshooting

### If CORS Issues Persist

1. Check the Network tab in browser dev tools to see the specific errors
2. Verify that the `ALLOWED_ORIGINS` environment variable in Render includes your Netlify domain
3. Try temporarily allowing all origins if needed by setting `ALLOWED_ORIGINS` to `*`

### If JWT Authentication Fails

1. Make sure the JWT_SECRET is properly set in Render
2. Check the Render logs for any JWT-related errors
3. Verify that tokens are being properly generated during registration/login

## Additional Notes

- The CORS configuration has been made more permissive for troubleshooting. Once everything is working correctly, you may want to tighten security.
- We've added a root endpoint to the API that provides basic info and links to help with API discovery.
- Both express.js files have been updated to maintain consistency between src/ and server/src/ directories. 