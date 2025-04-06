# Render.com Deployment Instructions

## Important: MongoDB Configuration

Your current `render.yaml` uses a local MongoDB connection string, which won't work in production:
```yaml
MONGODB_URI: mongodb://localhost:27017/quizlet-flashcard-generator
```

You need to use a real MongoDB database service. Here are your options:

### Option 1: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up database access (create a username and password)
4. Set up network access (allow access from anywhere `0.0.0.0/0` for simplicity)
5. Get your connection string, which will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/quizlet-flashcard-generator?retryWrites=true&w=majority
   ```

### Option 2: Use Environment Variable in Render Dashboard

Instead of hard-coding the MongoDB URI in the `render.yaml`, you can:
1. Log in to your [Render Dashboard](https://dashboard.render.com)
2. Navigate to your "quizlet-flashcard-api" service
3. Go to "Environment" section
4. Update the MONGODB_URI environment variable with your MongoDB Atlas connection string
5. Click "Save Changes" and your service will redeploy

### Option 3: Update render.yaml

If you prefer keeping configuration in code, update your `render.yaml` file:

```yaml
- key: MONGODB_URI
  value: mongodb+srv://<username>:<password>@cluster0.mongodb.net/quizlet-flashcard-generator?retryWrites=true&w=majority
```

## Verifying Your Deployment

After updating your MongoDB configuration:

1. Your service should automatically redeploy
2. Check the logs for any errors
3. Test the API endpoint: https://quizlet-flashcard-api.onrender.com/health

## CORS Configuration

Your CORS settings in `render.yaml` look good:
```yaml
- key: ALLOWED_ORIGINS
  value: https://lustrous-tartufo-9102a1.netlify.app,http://localhost:3000,http://localhost:5173,*
```

This will allow requests from your Netlify site and local development servers.

## Troubleshooting

If your deployment fails:
1. Check the logs in the Render dashboard
2. Verify your MongoDB connection string is correct
3. Ensure all required environment variables are set
4. Remember that the free tier on Render has limitations and may sleep after periods of inactivity 