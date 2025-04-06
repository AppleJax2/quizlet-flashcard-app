# CORS Fix Deployment Instructions

## Backend Deployment (Render.com)

1. Log into your Render.com dashboard
2. Navigate to your quizlet-flashcard-api service
3. Go to the "Environment" tab
4. Add/update the following environment variable:
   ```
   ALLOWED_ORIGINS=https://lustrous-tartufo-9102a1.netlify.app,http://localhost:3000,http://localhost:5173,*
   ```
5. Save changes
6. Go to the "Deploy" tab
7. Click "Manual Deploy" → "Deploy latest commit"
8. Wait for deployment to complete

## Deploy Updated Backend Files to Render

If updating the environment variables alone doesn't resolve the issue, follow these steps:

### Option 1: Using the Render Dashboard
1. Download the current source code from Render (if available)
2. Replace `src/loaders/express.js` with our updated version
3. Compress the files into a ZIP archive
4. In the Render dashboard, select "Upload Files" and upload the ZIP archive

### Option 2: Using Render CLI (if available)
1. Install Render CLI
2. Authenticate with your Render account
3. Deploy the updated codebase using the CLI commands

## Verify Deployment

After deployment is complete:
1. Clear your browser cache or use incognito mode
2. Try accessing the registration endpoint from your Netlify frontend
3. Check the browser console for CORS errors

If issues persist:
1. Check Render logs for any error messages
2. Verify the service is fully deployed and running
3. Test the API endpoint directly using a tool like Postman to confirm it's working 