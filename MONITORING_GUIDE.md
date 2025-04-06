# Quizlet Flashcard Generator Monitoring & Maintenance Guide

This guide provides detailed instructions for monitoring, maintaining, and troubleshooting the Quizlet Flashcard Generator application across different deployment environments.

## Table of Contents

1. [Application Health Monitoring](#application-health-monitoring)
2. [Performance Monitoring](#performance-monitoring)
3. [Error Tracking and Debugging](#error-tracking-and-debugging)
4. [Database Monitoring and Maintenance](#database-monitoring-and-maintenance)
5. [Resource Utilization](#resource-utilization)
6. [Security Monitoring](#security-monitoring)
7. [Logging Practices](#logging-practices)
8. [Backup and Recovery](#backup-and-recovery)
9. [Update and Maintenance Procedures](#update-and-maintenance-procedures)
10. [Scaling Strategies](#scaling-strategies)
11. [Monitoring Tools and Services](#monitoring-tools-and-services)

## Application Health Monitoring

### Health Check Endpoint

The application includes a health check endpoint at `/health` that returns the following information:
- Server status
- Database connection status
- Application uptime
- Memory usage

**How to use it:**
```bash
# Example health check request
curl http://localhost:5000/health

# Expected response
{
  "status": "up",
  "uptime": "3h 24m 15s",
  "database": "connected",
  "memory": {
    "rss": "45.3 MB",
    "heapTotal": "21.5 MB",
    "heapUsed": "18.7 MB"
  }
}
```

### Setting Up Uptime Monitoring

For production environments, consider using:
- [UptimeRobot](https://uptimerobot.com/) (free plan available)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

Configure these services to:
1. Ping the `/health` endpoint every 5 minutes
2. Alert via email/SMS when the service is down
3. Track and report on uptime percentage

## Performance Monitoring

### Key Metrics to Monitor

1. **Response Times**:
   - API endpoint response times
   - Database query performance
   - Frontend load times

2. **Throughput**:
   - Requests per second
   - Daily active users
   - API call volume by endpoint

3. **Resource Usage**:
   - CPU utilization
   - Memory consumption
   - Disk I/O and available space

### Performance Benchmarks

Establish baseline performance metrics for:
- Home page load time: < 1.5 seconds
- API response times: < 200ms for most endpoints
- Database queries: < 100ms for common operations

## Error Tracking and Debugging

### Centralized Error Logging

The application logs errors to `./logs/error.log`. Monitor this file for critical issues.

For production, consider integrating:
- [Sentry](https://sentry.io/) (free tier available)
- [LogRocket](https://logrocket.com/)
- [Rollbar](https://rollbar.com/)

### Common Error Troubleshooting

| Error | Potential Cause | Resolution |
|-------|-----------------|------------|
| MongoDB connection failures | Network issues, incorrect credentials | Check connection string, network connectivity, MongoDB server status |
| JWT authentication errors | Expired token, invalid signature | Verify JWT_SECRET consistency, check token expiration time |
| Rate limiting errors | Too many requests from same IP | Adjust rate limit settings if needed, investigate potential abuse |
| File upload errors | File size too large, invalid file type | Check upload limits in env configuration, verify client-side validation |

## Database Monitoring and Maintenance

### MongoDB Health Check

```bash
# Connect to MongoDB shell
mongo mongodb://localhost:27017/quizlet-flashcard-generator

# Check database status
db.adminCommand("serverStatus")

# Check collection statistics
db.flashcards.stats()
```

### Database Maintenance Tasks

**Regular Tasks (Weekly):**
1. Check database size and growth rate
2. Review index usage and performance
3. Validate collections integrity

**Monthly Tasks:**
1. Optimize indexes
2. Archive old/unused data if needed
3. Run database diagnostics

## Resource Utilization

### System Resources

Monitor the following system resources:

**Memory Usage:**
```bash
# Check memory usage on Linux
free -h

# On Docker
docker stats quizlet_app
```

**CPU Usage:**
```bash
# Check CPU usage on Linux
top

# On Docker
docker stats quizlet_app
```

**Disk Space:**
```bash
# Check disk space on Linux
df -h

# Monitor log file sizes
du -h logs/
```

### Setting Resource Alerts

Configure alerts when:
- Memory usage exceeds 80% of allocated RAM
- CPU usage sustains above 70% for more than 5 minutes
- Disk space falls below 20% available
- Log files exceed 1GB in size

## Security Monitoring

### Authentication Monitoring

Track and alert on:
- Multiple failed login attempts from the same IP
- Unusual login patterns (time of day, geography)
- Admin account access and actions

### API Security Monitoring

Monitor for:
- Unusual API call patterns
- Attempts to access unauthorized endpoints
- Requests with malformed data or injection attempts

### Regular Security Checks

**Weekly Security Tasks:**
1. Review authentication logs for suspicious activity
2. Check for failed API requests and potential abuse patterns
3. Monitor rate limiting triggers

## Logging Practices

### Log Levels and Usage

The application uses the following log levels:
- **ERROR**: System errors requiring immediate attention
- **WARN**: Noteworthy issues that don't require immediate action
- **INFO**: General operational information
- **DEBUG**: Detailed information for debugging purposes

### Log Rotation and Retention

Logs are automatically rotated based on size (5MB) and retained for 5 files per log type.

For manual log rotation:
```bash
# Archive current logs
tar -czf logs-$(date +%Y%m%d).tar.gz logs/
mkdir -p logs-archive
mv logs-$(date +%Y%m%d).tar.gz logs-archive/
```

### Log Analysis

For basic log analysis:
```bash
# Find all error messages
grep "ERROR" logs/combined.log

# Count occurrences of specific errors
grep "MongoError" logs/error.log | wc -l

# Find slow database operations
grep "slow query" logs/combined.log
```

## Backup and Recovery

### Database Backup Procedures

**Manual Backup:**
```bash
# Backup MongoDB database
mongodump --uri="mongodb://localhost:27017/quizlet-flashcard-generator" --out=./backup/$(date +%Y%m%d)
```

**Automated Daily Backup Script:**
```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d)
MONGODB_URI="mongodb://localhost:27017/quizlet-flashcard-generator"

# Create backup directory
mkdir -p $BACKUP_DIR/$DATE

# Perform backup
mongodump --uri="$MONGODB_URI" --out=$BACKUP_DIR/$DATE

# Compress backup
tar -czf $BACKUP_DIR/$DATE.tar.gz -C $BACKUP_DIR $DATE

# Remove uncompressed backup
rm -rf $BACKUP_DIR/$DATE

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.tar.gz" -type f -mtime +30 -delete
```

### Application State Backup

Backup these critical components:
1. Environment configuration files
2. User uploads (if applicable)
3. Custom configuration settings

### Recovery Procedures

**Database Restoration:**
```bash
# Restore from backup
mongorestore --uri="mongodb://localhost:27017/quizlet-flashcard-generator" --drop backup/20230901/quizlet-flashcard-generator
```

**Complete Recovery Checklist:**
1. Restore database from latest backup
2. Verify environment configuration
3. Restart application services
4. Verify application health via health check endpoint
5. Test critical functionality

## Update and Maintenance Procedures

### Dependency Updates

**Regular Update Schedule:**
- Security updates: Immediate application
- Minor dependencies: Monthly review and update
- Major version upgrades: Quarterly planning and testing

**Update Procedure:**
1. Create a development/staging branch
2. Update dependencies (`npm update` or selective updates)
3. Run automated tests and fix issues
4. Perform manual testing of critical features
5. Deploy to staging environment for further testing
6. Schedule production update during low-traffic period

### Code Maintenance

**Code Quality Tasks:**
1. Run linting and fix issues: `npm run lint`
2. Check for code duplication
3. Identify and refactor components with technical debt
4. Review and update documentation

## Scaling Strategies

### Vertical Scaling

When to consider:
- Response times increasing
- CPU/Memory consistently near capacity
- Database query times increasing

Steps:
1. Increase server resources (CPU, RAM)
2. Optimize database indexes
3. Enable caching mechanisms

### Horizontal Scaling

For advanced scaling needs:
1. Implement load balancing across multiple application instances
2. Consider database sharding for large data volumes
3. Separate API and frontend hosting

## Monitoring Tools and Services

### Free/Low-Cost Monitoring Solutions

1. **Application Monitoring:**
   - [New Relic](https://newrelic.com/) (free tier available)
   - [Prometheus](https://prometheus.io/) + [Grafana](https://grafana.com/) (open-source)
   - [AppSignal](https://appsignal.com/) (free tier for small projects)

2. **Uptime Monitoring:**
   - [UptimeRobot](https://uptimerobot.com/) (free plan with 5-minute checks)
   - [Freshping](https://www.freshworks.com/website-monitoring/) (free plan available)

3. **Log Management:**
   - [Papertrail](https://www.papertrail.com/) (free tier available)
   - [Loggly](https://www.loggly.com/) (free tier available)
   - [ELK Stack](https://www.elastic.co/what-is/elk-stack) (open-source)

### DIY Monitoring Setup

For small to medium deployments, consider setting up:

1. **Prometheus + Grafana:**
   - Install Prometheus for metric collection
   - Set up Grafana for visualization
   - Add Node.js exporters for system metrics

2. **Custom Dashboard:**
   Create a simple dashboard that queries:
   - The application health endpoint
   - Basic server metrics
   - Recent log entries
   - Active user count

### Alerting Configuration

Configure alerting channels based on urgency:
- **Critical Issues:** SMS and email alerts
- **Warnings:** Email notifications
- **Informational:** Dashboard highlighting

Establish on-call procedures for after-hours critical alerts. 