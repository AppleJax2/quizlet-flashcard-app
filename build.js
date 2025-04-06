/**
 * Production build script for Quizlet Flashcard Generator
 * This script builds both the frontend and backend for production deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// Helper function to print colored messages
const print = {
  info: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}${colors.bright}✓ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.bright}${colors.cyan}=== ${msg} ===${colors.reset}\n`)
};

// Execute command and handle errors
function exec(command, cwd = process.cwd()) {
  try {
    print.info(`Executing: ${command}`);
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    print.error(`Command failed: ${command}`);
    print.error(error.message);
    return false;
  }
}

// Clean previous build
function cleanBuild() {
  print.section('Cleaning previous build');
  
  try {
    // Remove previous dist directories
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true, force: true });
      print.success('Removed dist directory');
    }
    
    // Create dist directory
    fs.mkdirSync('dist', { recursive: true });
    print.success('Created fresh dist directory');
    
    return true;
  } catch (error) {
    print.error(`Failed to clean build: ${error.message}`);
    return false;
  }
}

// Build frontend
function buildFrontend() {
  print.section('Building frontend');
  
  // Check if client directory exists
  if (!fs.existsSync('client')) {
    print.error('Client directory not found');
    return false;
  }
  
  // Create production .env file for client
  try {
    fs.writeFileSync('client/.env.production', 'VITE_API_URL=/api\nVITE_NODE_ENV=production');
    print.success('Created client production environment file');
  } catch (error) {
    print.error(`Failed to create client env file: ${error.message}`);
    return false;
  }
  
  // Install dependencies and build
  if (!exec('npm install', 'client')) return false;
  if (!exec('npm run build', 'client')) return false;
  
  // Copy the built files to the server public directory
  try {
    // Create public directory if it doesn't exist
    if (!fs.existsSync('dist/public')) {
      fs.mkdirSync('dist/public', { recursive: true });
    }
    
    // Copy the contents of client/dist to server's public directory
    fs.cpSync('client/dist', 'dist/public', { recursive: true });
    print.success('Copied frontend build to dist/public');
    
    return true;
  } catch (error) {
    print.error(`Failed to copy frontend build: ${error.message}`);
    return false;
  }
}

// Build backend
function buildBackend() {
  print.section('Building backend');
  
  try {
    // Install dependencies
    if (!exec('npm install --production')) return false;
    
    // Copy backend files to dist
    const backendDirs = ['src', 'package.json', 'package-lock.json'];
    
    backendDirs.forEach(item => {
      const source = path.join('.', item);
      const dest = path.join('dist', item);
      
      if (fs.existsSync(source)) {
        if (fs.lstatSync(source).isDirectory()) {
          fs.cpSync(source, dest, { recursive: true });
        } else {
          fs.copyFileSync(source, dest);
        }
        print.success(`Copied ${item} to dist`);
      }
    });
    
    // Create production .env file template in dist
    if (!fs.existsSync('dist/.env')) {
      const envTemplate = fs.readFileSync('.env.example', 'utf-8')
        .replace('NODE_ENV=development', 'NODE_ENV=production')
        .replace('mongodb://localhost:27017/quizlet-flashcard-generator', 'mongodb+srv://username:password@cluster.mongodb.net/quizlet-flashcard-generator?retryWrites=true&w=majority')
        .replace('your_jwt_secret_key_here', 'CHANGE_THIS_TO_A_SECURE_RANDOM_STRING');
        
      fs.writeFileSync('dist/.env.example', envTemplate);
      print.success('Created production environment template');
    }
    
    // Create start script in dist
    const startScript = `
    #!/bin/bash
    # Quizlet Flashcard Generator Startup Script
    
    # Check if .env file exists
    if [ ! -f .env ]; then
      echo "Error: .env file not found. Please create one from the .env.example template."
      exit 1
    fi
    
    # Start the application
    echo "Starting Quizlet Flashcard Generator..."
    node src/index.js
    `;
    
    fs.writeFileSync('dist/start.sh', startScript.trim());
    fs.chmodSync('dist/start.sh', 0o755);
    print.success('Created startup script');
    
    // Create server.js file to serve static frontend
    const serverFile = `
    /**
     * Express static file server for frontend
     * This file serves the frontend build from the public directory
     */
    
    const path = require('path');
    const express = require('express');
    const app = require('./src/index');
    
    // Serve static files from the public directory
    app.use(express.static(path.join(__dirname, 'public')));
    
    // For any other routes, serve the index.html file
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
    `;
    
    fs.writeFileSync('dist/server.js', serverFile.trim());
    print.success('Created server static file handler');
    
    return true;
  } catch (error) {
    print.error(`Failed to build backend: ${error.message}`);
    return false;
  }
}

// Create package.json for production
function createProductionPackage() {
  print.section('Creating production package.json');
  
  try {
    const pkg = require('./package.json');
    
    // Create a simplified package.json for production
    const prodPkg = {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      main: 'server.js',
      scripts: {
        start: 'node server.js',
      },
      engines: pkg.engines,
      dependencies: pkg.dependencies,
    };
    
    fs.writeFileSync('dist/package.json', JSON.stringify(prodPkg, null, 2));
    print.success('Created production package.json');
    
    return true;
  } catch (error) {
    print.error(`Failed to create production package.json: ${error.message}`);
    return false;
  }
}

// Create deployment documentation
function createDeploymentDocs() {
  print.section('Creating deployment documentation');
  
  const deploymentDoc = `# Quizlet Flashcard Generator Deployment Guide

## Prerequisites
- Node.js ${require('./package.json').engines.node}
- MongoDB database (local or MongoDB Atlas)

## Setup Instructions

1. Configure environment variables by creating a \`.env\` file based on the \`.env.example\` template.
   - Set \`NODE_ENV=production\`
   - Configure a secure \`JWT_SECRET\`
   - Update \`MONGODB_URI\` to point to your MongoDB instance

2. Install dependencies:
   \`\`\`
   npm install --production
   \`\`\`

3. Start the application:
   \`\`\`
   ./start.sh
   \`\`\`
   Or alternatively:
   \`\`\`
   npm start
   \`\`\`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | production |
| PORT | Server port | 5000 |
| API_PREFIX | API route prefix | /api/v1 |
| MONGODB_URI | MongoDB connection string | mongodb+srv://username:password@cluster.mongodb.net/quizlet-flashcard-generator |
| JWT_SECRET | Secret for JWT tokens | long-random-string |
| JWT_LIFETIME | JWT token expiration | 1d |

## Troubleshooting

- If the server fails to start, check the logs for error messages.
- Ensure MongoDB is accessible from your server.
- Verify that all required environment variables are set correctly.
`;

  try {
    fs.writeFileSync('dist/DEPLOYMENT.md', deploymentDoc);
    print.success('Created deployment documentation');
    
    return true;
  } catch (error) {
    print.error(`Failed to create deployment docs: ${error.message}`);
    return false;
  }
}

// Main build process
async function build() {
  print.section('Starting production build');
  
  // Run build steps
  if (!cleanBuild()) process.exit(1);
  if (!buildFrontend()) process.exit(1);
  if (!buildBackend()) process.exit(1);
  if (!createProductionPackage()) process.exit(1);
  if (!createDeploymentDocs()) process.exit(1);
  
  print.section('Build completed successfully');
  print.success('The production build is available in the dist directory');
  print.info('To deploy, copy the contents of the dist directory to your server');
  print.info('Follow the instructions in DEPLOYMENT.md to set up the environment');
}

// Run the build
build().catch(error => {
  print.error(`Build failed: ${error.message}`);
  process.exit(1);
}); 