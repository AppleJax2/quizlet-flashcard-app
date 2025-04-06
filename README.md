# Quizlet Flashcard App

A modern flashcard application for enhanced learning.

## Features

- User authentication (login, registration, password recovery)
- Flashcard creation and management
- Study sessions with spaced repetition
- Multiple flashcard generation methods (text, document, URL)
- User profile management
- Responsive design for all devices

## Tech Stack

### Frontend

- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form for form management
- Axios for API requests
- Vite for build tooling

### Backend

- Node.js with Express
- MongoDB for database
- JWT for authentication
- REST API architecture

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

#### Backend

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/quizlet-flashcard-app.git
   cd quizlet-flashcard-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration:
   ```
   NODE_ENV=development
   PORT=5001
   API_PREFIX=/api/v1
   CLIENT_URL=http://localhost:3000
   ALLOWED_ORIGINS=http://localhost:3000,https://your-netlify-app.netlify.app
   MONGODB_URI=mongodb://localhost:27017/quizlet
   JWT_SECRET=your_jwt_secret_key
   JWT_LIFETIME=1d
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

#### Frontend

1. Navigate to the client directory
   ```bash
   cd client
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.development
   ```
   Edit the `.env.development` file:
   ```
   VITE_API_URL=http://localhost:5001/api/v1
   VITE_NODE_ENV=development
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

## Deployment

### Backend Deployment

1. Create a production `.env.production` file with appropriate settings:
   ```
   NODE_ENV=production
   PORT=5001
   API_PREFIX=/api/v1
   CLIENT_URL=https://your-netlify-app.netlify.app
   ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
   MONGODB_URI=mongodb+srv://your-mongodb-connection-string
   JWT_SECRET=your_secure_jwt_secret
   JWT_LIFETIME=1d
   ```

2. Deploy to your hosting platform (Render, Heroku, AWS, etc.)
   - For Render.com: Connect your GitHub repository and set the build command to `npm install && npm run build`
   - Start command: `npm start`
   - Add all environment variables from your `.env.production` file

### Frontend Deployment

1. Set up Netlify CLI (if not already installed)
   ```bash
   npm install -g netlify-cli
   ```

2. Create a production environment file
   ```bash
   cd client
   cp .env.development .env.production
   ```
   Edit `.env.production`:
   ```
   VITE_API_URL=https://your-backend-api.com/api/v1
   VITE_NODE_ENV=production
   ```

3. Update the `netlify.toml` file with your backend URL:
   ```toml
   [context.production.environment]
     VITE_NODE_ENV = "production"
     VITE_API_URL = "https://your-backend-api.com/api/v1"
   ```

4. Deploy to Netlify
   ```bash
   npm run deploy:prod
   ```

## Troubleshooting

### CORS Issues

If you're experiencing CORS errors:

1. Ensure your backend's `ALLOWED_ORIGINS` includes your frontend domain
2. Check that the Content-Security-Policy in `netlify.toml` is correctly configured

### Content Security Policy

If you're seeing CSP errors with Google Fonts or other resources:

1. Update the Content-Security-Policy in `netlify.toml`:
   ```toml
   Content-Security-Policy = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self' https://your-backend-api.com;"
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 