# Quizlet Flashcard Generator Security Guide

This security guide provides comprehensive recommendations and best practices for securing your Quizlet Flashcard Generator application in both development and production environments.

## Table of Contents

1. [Authentication and Authorization](#authentication-and-authorization)
2. [Data Security](#data-security)
3. [API Security](#api-security)
4. [Environment Configuration](#environment-configuration)
5. [Frontend Security](#frontend-security)
6. [Infrastructure Security](#infrastructure-security)
7. [Monitoring and Incident Response](#monitoring-and-incident-response)
8. [Security Checklist](#security-checklist)

## Authentication and Authorization

### JWT Implementation

- **Secret Key Management**: 
  - Use a strong, randomly generated JWT secret of at least 32 characters
  - Rotate your JWT secret periodically (every 30-90 days)
  - Store the JWT secret securely as an environment variable
  - Example of generating a secure JWT secret:
    ```bash
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    ```

- **Token Configuration**:
  - Set appropriate token expiration times (e.g., `JWT_LIFETIME=1d`)
  - Implement token refresh mechanism for extended sessions
  - Include only necessary claims in the JWT payload
  - Consider implementing token revocation for critical scenarios

- **Secure Token Storage**:
  - Store tokens in HttpOnly cookies to prevent XSS attacks
  - Set the Secure flag on cookies to ensure HTTPS-only transmission
  - Implement CSRF protection when using cookies

### Authentication Flow

- Enforce strong password policies
- Implement rate limiting for login attempts
- Consider multi-factor authentication for admin accounts
- Log all authentication events, especially failures

## Data Security

### Database Security

- **MongoDB Security**:
  - Use a strong, unique password for database access
  - Create dedicated database users with least privilege
  - Never use the root admin account for application connections
  - Enable authentication in MongoDB (`--auth` flag)
  - Configure MongoDB to bind only to localhost unless remote access is needed
  - For MongoDB Atlas:
    - Use IP allowlisting
    - Encrypt data at rest
    - Enable advanced security features

- **Data Encryption**:
  - Encrypt sensitive data before storing in the database
  - Use bcrypt (already implemented) for password hashing
  - Consider field-level encryption for highly sensitive data

- **Data Validation**:
  - Validate all input data before storing in the database
  - Implement Mongoose schemas with strict validation
  - Sanitize user inputs to prevent NoSQL injection attacks

## API Security

### Request Validation

- Validate all API input parameters
- Implement schema validation for request bodies
- Sanitize inputs to prevent injection attacks
- Validate content types and accept headers

### Rate Limiting and Throttling

The application already implements rate limiting. Configure it appropriately:

```javascript
// Example rate limiting configuration
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
  })
);
```

### API Permissions

- Implement role-based access control (RBAC)
- Ensure each endpoint checks for proper authorization
- Document API permission requirements
- Test API endpoints with different permission levels

## Environment Configuration

### Secure Environment Setup

- Never commit `.env` files to your repository
- Use different environment files for development and production
- Consider using a secrets management service for production
- Include comprehensive environment validation on application startup

Example environment validation:

```javascript
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_LIFETIME'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Environment variable ${envVar} is required`);
    process.exit(1);
  }
}
```

### Production Environment

- Set `NODE_ENV=production` to enable security features
- Use a properly configured reverse proxy (Nginx, Caddy)
- Enable HTTPS with modern cipher suites
- Implement proper CORS configuration:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
```

## Frontend Security

### XSS Prevention

- Use React's built-in XSS protection
- Implement Content Security Policy (CSP)
- Sanitize any dynamic content before rendering
- Avoid using dangerouslySetInnerHTML

### Secure State Management

- Don't store sensitive data in local storage
- Clear sensitive data when no longer needed
- Implement secure authentication state management

### HTTPS

- Always use HTTPS in production
- Implement HSTS headers
- Consider enabling preloading for HSTS

Recommended security headers:

```javascript
// In Express server configuration
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
```

## Infrastructure Security

### Docker Security

If deploying with Docker:

- Use official Node.js images
- Don't run containers as root
- Scan images for vulnerabilities
- Keep images updated
- Limit container capabilities

Example secure Dockerfile configuration:

```Dockerfile
# Use specific version to avoid supply chain attacks
FROM node:16-alpine

# Create app directory
WORKDIR /app

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs

# Install dependencies with exact versions
COPY package*.json ./
RUN npm ci --only=production

# Copy only necessary files
COPY --chown=nodejs:nodejs . .

# Run as non-root user
USER nodejs

# Use non-privileged port
EXPOSE 5000

CMD ["node", "src/index.js"]
```

### Network Security

- Use network segmentation
- Configure firewalls to restrict traffic
- Use VPCs for cloud deployments
- Implement proper DNS configuration

## Monitoring and Incident Response

### Logging

- Log security-relevant events
- Use structured logging format
- Never log sensitive information
- Implement log rotation and retention policies

Example logging configuration:

```javascript
const winston = require('winston');
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'quizlet-flashcard-generator' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});
```

### Security Monitoring

- Monitor application logs for suspicious activity
- Set up alerts for authentication failures
- Implement health checks and monitoring
- Consider using security scanning tools

## Security Checklist

Use this checklist for deployment:

- [ ] Strong JWT secret configured
- [ ] MongoDB connection secure with proper authentication
- [ ] Environment variables properly set and validated
- [ ] HTTPS enabled for all production endpoints
- [ ] CORS configured properly for your domains
- [ ] Rate limiting enabled and configured
- [ ] Security headers implemented
- [ ] Input validation implemented for all API endpoints
- [ ] Authentication and authorization properly tested
- [ ] Logging configured and tested
- [ ] No sensitive information in logs
- [ ] Dependencies updated and security audited
- [ ] Docker containers configured securely (if using Docker)
- [ ] Database backups configured
- [ ] Incident response plan in place

### Regular Security Maintenance

- Run `npm audit` regularly and fix vulnerabilities
- Update dependencies on a schedule
- Perform periodic security reviews
- Keep informed about security best practices
- Test your security measures with penetration testing tools 