# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including development dependencies
RUN npm install

# Copy application files
COPY . .

# Set environment variables
ENV NODE_ENV=production \
    PORT=5000 \
    MONGODB_URI=mongodb://localhost:27017/quizlet-flashcard-generator

# Expose the application port
EXPOSE 5000

# Create volume for logs
VOLUME ["/app/logs"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"] 