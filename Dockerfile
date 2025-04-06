# Use Node.js 16 as base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files for server
COPY server/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy server application files
COPY server/src/ ./src/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5001
ENV API_PREFIX=/api/v1

# Expose the application port
EXPOSE 5001

# Start the application
CMD ["node", "src/index.js"] 