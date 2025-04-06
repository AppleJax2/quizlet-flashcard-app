# Deployment Fixes

This document outlines the changes made to fix deployment issues with the Quizlet application.

## Issues Fixed

1. **Content Security Policy (CSP) Error**
   - The Netlify configuration had an incorrect CSP that prevented loading Google Fonts
   - Fixed by updating the `netlify.toml` file to properly allow Google Fonts domains in both `style-src` and `font-src` directives
   - Removed duplicate `font-src` directive that was causing conflicts

2. **CORS Policy Error**
   - The backend API wasn't configured to accept requests from the Netlify domain
   - Added `https://lustrous-tartufo-9102a1.netlify.app` to the `ALLOWED_ORIGINS` environment variable in both development and production environment files

## Deployment Instructions

### Backend (Render.com)

1. Update environment variables on Render.com:
   - Add `ALLOWED_ORIGINS=https://lustrous-tartufo-9102a1.netlify.app`
   - (Alternatively) Upload the updated `.env.production` file

2. Redeploy the backend service:
   ```
   git push
   ```
   Or use the manual deploy option in the Render dashboard.

### Frontend (Netlify)

1. The updated `netlify.toml` file should be committed and pushed:
   ```
   git add netlify.toml
   git commit -m "Fix CSP for Google Fonts"
   git push
   ```

2. Netlify should automatically deploy the updated configuration.

## Verification

After deploying these changes:

1. Clear your browser cache or use incognito/private mode
2. Visit https://lustrous-tartufo-9102a1.netlify.app/login
3. Check the browser console - there should be no more CSP or CORS errors
4. Test the authentication flow (registration, login, forgot password)

## Additional Notes

- If you're using a custom domain, update the `ALLOWED_ORIGINS` to include that domain as well
- For security, review the JWT secrets in production and ensure they are strong, unique values
- Consider adding proper error handling on the frontend to display user-friendly messages when API calls fail 