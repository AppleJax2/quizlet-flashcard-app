# MongoDB Connection Fix for Render Deployment

## Current Issue

The deployment log shows that the environment variables are now validating successfully, but the application is still crashing with exit code 1. Based on the logs:

```
2025-04-06 13:11:30 [info]: Environment validated successfully for production mode 
2025-04-06 13:11:30 [info]: Server will run on port 5001 
2025-04-06 13:11:30 [info]: API prefix: /api/v1 
==> Exited with status 1
```

This indicates that the application is crashing during startup, most likely when trying to connect to MongoDB.

## Fix the MongoDB Connection

### 1. Set Up MongoDB Atlas

If you haven't already, create a MongoDB Atlas cluster:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and new cluster
3. Set up database access (username and password)
4. Configure network access (allow access from anywhere by adding `0.0.0.0/0` to IP allow list)
5. Get your connection string, which will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/quizlet-flashcard-generator
   ```
   (Replace `<username>` and `<password>` with your actual credentials)

### 2. Update the MONGODB_URI Environment Variable

1. Go to the [Render Dashboard](https://dashboard.render.com/)
2. Navigate to your `quizlet-flashcard-api` service
3. Go to the "Environment" tab
4. Find or add the `MONGODB_URI` environment variable
5. Set it to your MongoDB Atlas connection string
6. Click "Save Changes" to trigger a redeploy

### 3. Check Database Connection Timeout Settings

Let's also update the database connection logic to increase timeouts for cloud connections. Create a new file called `database_connection_fix.js` that you can apply to your codebase:

```javascript
// Update this in src/loaders/database.js
const connectDB = async () => {
  try {
    logger.info(`Connecting to MongoDB at: ${obfuscateURI(env.MONGODB_URI)}`);
    
    // Increase timeouts for cloud connections
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,  // Increase from default 10000
      socketTimeoutMS: 45000,   // Increase from default 30000
      serverSelectionTimeoutMS: 30000,  // Increase from default 20000
    };
    
    // Use MongoMemory server only in development
    if (env.NODE_ENV === 'development' && !env.MONGODB_URI.includes('mongodb+srv')) {
      logger.info('Using MongoDB Memory Server for development');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const connection = await mongoose.connect(uri, connectionOptions);
      logger.info('MongoDB memory server connected successfully');
      return connection;
    }
    
    // Connect to the real MongoDB instance
    const connection = await mongoose.connect(env.MONGODB_URI, connectionOptions);
    logger.info('MongoDB connected successfully');
    
    // Listen for MongoDB connection events
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connection established');
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection disconnected');
    });
    
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
      
      // Only exit in production - in development we want to keep trying
      if (env.NODE_ENV === 'production') {
        logger.error('MongoDB connection failure in production environment - exiting application');
        process.exit(1);
      }
    });
    
    // Debug for slow queries in development
    if (env.NODE_ENV === 'development') {
      mongoose.set('debug', (collectionName, method, query, doc) => {
        logger.debug(`Mongoose: ${collectionName}.${method}(${JSON.stringify(query)}, ${JSON.stringify(doc)})`);
      });
    }
    
    return connection;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    
    // Add more specific error messages to help with debugging
    if (error.name === 'MongoServerSelectionError') {
      logger.error('Could not connect to any MongoDB server - check network and credentials');
    }
    
    if (error.message.includes('authentication failed')) {
      logger.error('MongoDB authentication failed - check username and password');
    }
    
    if (error.message.includes('getaddrinfo')) {
      logger.error('DNS resolution failed - check hostname in connection string');
    }
    
    // In production, crash the application so it can be restarted
    if (env.NODE_ENV === 'production') {
      logger.error('Fatal database connection error in production - exiting');
      process.exit(1);
    }
    
    throw error;
  }
};
```

### 4. Enable More Detailed Logging

To help debug the issue, add more detailed logging by updating your render.yaml file:

```yaml
- key: LOG_LEVEL
  value: debug
```

Or set this environment variable directly in the Render dashboard.

## Verify the Fix

After making these changes:

1. Deploy the updated code
2. Monitor the logs closely for any MongoDB connection errors
3. If the connection is successful, you should see logs indicating "MongoDB connected successfully"

## Common MongoDB Connection Issues

If you continue to have issues:

1. **Authentication Failed**: Check your username and password in the connection string
2. **Connection Timeout**: Ensure your MongoDB Atlas cluster is running and network access rules allow connections from Render's IP address
3. **DNS Resolution Failure**: Verify the hostname in your connection string
4. **MongoDB URI Format**: Make sure your URI follows the format: `mongodb+srv://<username>:<password>@<hostname>/<database>?retryWrites=true&w=majority`

## Testing the MongoDB Connection

You can test your MongoDB connection string before deploying:

```bash
# Install mongosh (MongoDB Shell)
npm install -g mongosh

# Test connection
mongosh "your-connection-string"
```

If this connects successfully, your connection string is valid. 