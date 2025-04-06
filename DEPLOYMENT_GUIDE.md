# Quizlet Flashcard Generator Deployment Guide

This comprehensive guide covers multiple deployment options for the Quizlet Flashcard Generator application, including local development, local deployment with Docker, and free cloud hosting options.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Local Production Deployment](#local-production-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Cloud Deployment - Free Options](#cloud-deployment---free-options)
   - [Render.com Deployment](#rendercom-deployment)
   - [Frontend-only Deployment on Netlify](#frontend-only-deployment-on-netlify)
   - [Backend-only Deployment on Railway](#backend-only-deployment-on-railway)
6. [Environment Configuration](#environment-configuration)
7. [Security Considerations](#security-considerations)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js v16 or higher
- MongoDB (local installation or MongoDB Atlas account)
- Git
- Basic command line knowledge
- Docker and Docker Compose (optional, for containerized deployment)

## Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd quizlet-flashcard-generator
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration values, particularly the `JWT_SECRET`.

5. **Set up MongoDB**:
   - Install MongoDB locally, or
   - Create a free MongoDB Atlas account and update the `MONGODB_URI` in your `.env` file

6. **Start the development servers**:
   ```bash
   # Start the backend server in one terminal
   npm run dev
   
   # Start the frontend server in another terminal
   cd client
   npm run dev
   ```

7. **Access the application**:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

## Local Production Deployment

1. **Build the application**:
   ```bash
   node build.js
   ```
   This will create a `dist` directory with the production-ready application.

2. **Set up environment for production**:
   ```bash
   cd dist
   cp .env.example .env
   ```
   Edit the `.env` file with your production configuration, ensuring:
   - `NODE_ENV=production`
   - A secure `JWT_SECRET`
   - A valid MongoDB connection string

3. **Install production dependencies**:
   ```bash
   npm install --production
   ```

4. **Start the application**:
   ```bash
   npm start
   ```
   or
   ```bash
   ./start.sh
   ```

5. **Access the application**:
   http://localhost:5000 (or the configured port)

## Docker Deployment

1. **Build and run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```
   This will start both the application and MongoDB in containers.

2. **Access the application**:
   http://localhost:5000

3. **Stop the containers**:
   ```bash
   docker-compose down
   ```

4. **View logs**:
   ```bash
   docker-compose logs -f app
   ```

## Cloud Deployment - Free Options

### Render.com Deployment

Render.com offers a free tier for web services and databases.

1. **Sign up for a Render.com account**:
   Visit [Render.com](https://render.com) and create an account

2. **Deploy from GitHub**:
   - Connect your GitHub repository to Render
   - Create a new Web Service
   - Select the repository
   - Configure the service:
     - Build Command: `node ./build.js`
     - Start Command: `node server.js`
   - Add environment variables from your `.env` file

3. **Set up MongoDB**:
   - Use MongoDB Atlas free tier
   - Create a cluster
   - Configure network access and database user
   - Get the connection string and add it to your Render environment variables

4. **Deploy the application**:
   Click "Create Web Service" and wait for the deployment to complete

### Frontend-only Deployment on Netlify

If you prefer separate frontend and backend deployments:

1. **Deploy frontend to Netlify**:
   ```bash
   # Navigate to the frontend directory
   cd client
   
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Initialize and deploy
   netlify init
   ```

2. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Configure environment variables**:
   - Set `VITE_API_URL` to point to your backend API URL
   - You can use the Netlify dashboard for this

4. **Configure redirects for SPA routing**:
   The `netlify.toml` file already includes the necessary redirects.

### Backend-only Deployment on Railway

Railway offers a free tier for web services:

1. **Sign up for Railway**:
   Visit [Railway.app](https://railway.app) and create an account

2. **Deploy from GitHub**:
   - Connect your GitHub repository
   - Create a new project from the repository
   - Configure the service:
     - Root directory: `./`
     - Build command: `npm install`
     - Start command: `npm start`

3. **Add environment variables**:
   Add all the required environment variables from your `.env` file

4. **Deploy MongoDB**:
   - Add a MongoDB plugin to your project
   - Railway will generate the connection details
   - Add the connection string to your environment variables

## Environment Configuration

### Essential Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` |
| `API_PREFIX` | API route prefix | `/api/v1` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://username:password@cluster.mongodb.net/quizlet-flashcard-generator` |
| `JWT_SECRET` | Secret for JWT tokens | A long random string |
| `JWT_LIFETIME` | JWT token expiration | `1d` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `/api` (local) or `https://your-backend.render.com/api` (remote) |
| `VITE_NODE_ENV` | Environment mode | `production` |

## Security Considerations

1. **JWT Secret**:
   - Use a strong, randomly generated secret
   - At least 32 characters
   - Never commit this to your repository

2. **MongoDB Connection**:
   - Use a strong password for your MongoDB user
   - Restrict network access to your database
   - Use MongoDB Atlas IP allowlist feature

3. **HTTPS**:
   - Always use HTTPS in production
   - Free hosting providers like Render and Netlify include HTTPS

4. **API Rate Limiting**:
   - Already implemented, but adjust `RATE_LIMIT_MAX` based on your needs

5. **Environment Variables**:
   - Never commit `.env` files to your repository
   - Use environment variable management in your hosting platform

## Monitoring and Maintenance

1. **Checking Application Health**:
   - Access the `/health` endpoint to check server status
   - HTTP 200 response indicates the application is working

2. **Checking Logs**:
   - Local: Check the `logs` directory
   - Docker: `docker-compose logs -f app`
   - Render: Check the Logs tab in your service dashboard

3. **Database Maintenance**:
   - Regular backups (automated with MongoDB Atlas)
   - Periodically check database size
   - Monitor performance metrics

4. **Updates**:
   - Regularly update dependencies
   - Check for security vulnerabilities with `npm audit`
   - Follow a staging -> production deployment process

## Troubleshooting

### Common Issues

1. **Application won't start**:
   - Check environment variables are correctly set
   - Verify MongoDB connection string is correct
   - Check port availability
   - Look at the logs for specific error messages

2. **MongoDB connection issues**:
   - Verify MongoDB is running (local deployment)
   - Check network connectivity
   - Verify credentials and connection string
   - Check IP allowlist (MongoDB Atlas)

3. **Authentication problems**:
   - Verify `JWT_SECRET` is set correctly
   - Check token expiration settings
   - Clear browser cookies and local storage

4. **Frontend/Backend connectivity**:
   - Ensure API URL is correctly configured
   - Check CORS settings
   - Verify proxy settings in development

### Getting Help

- Check the project documentation
- Open issues on the project repository
- Check logs for detailed error information 