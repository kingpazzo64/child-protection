# Deployment Guide

Complete guide for deploying the Child Protection Services Directory to production.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Platform Options](#platform-options)
- [Vercel Deployment](#vercel-deployment)
- [Railway Deployment](#railway-deployment)
- [Traditional VPS Deployment](#traditional-vps-deployment)
- [Docker Deployment](#docker-deployment)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment Steps](#post-deployment-steps)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

Before deploying to production, ensure:

### Code Readiness
- [ ] All features are tested and working
- [ ] No console errors or warnings
- [ ] Code is reviewed and approved
- [ ] Latest changes are merged to main branch
- [ ] Build runs successfully (`npm run build`)
- [ ] All dependencies are up to date

### Security
- [ ] All secrets are stored securely (not in code)
- [ ] Strong passwords for database
- [ ] NEXTAUTH_SECRET is unique and strong
- [ ] CORS policies are configured
- [ ] Rate limiting implemented (optional but recommended)
- [ ] SQL injection protection verified
- [ ] XSS protection in place

### Configuration
- [ ] Environment variables prepared
- [ ] Database ready (PostgreSQL)
- [ ] SMTP service configured
- [ ] Domain name purchased (if applicable)
- [ ] SSL certificate ready (if not using platform SSL)

### Performance
- [ ] Images optimized
- [ ] Bundle size acceptable
- [ ] Database queries optimized
- [ ] Caching strategy in place

## Platform Options

### Quick Comparison

| Platform | Difficulty | Cost | Best For |
|----------|-----------|------|----------|
| Vercel | Easy | Free-Paid | Quick deployment, serverless |
| Railway | Easy | Paid | All-in-one, includes database |
| DigitalOcean | Medium | Paid | Full control, traditional hosting |
| AWS | Hard | Paid | Enterprise, scalability |
| Docker | Medium | Varies | Any platform, containerized |

## Vercel Deployment

### Prerequisites

- Vercel account
- PostgreSQL database (Supabase, Neon, etc.)
- SMTP service

### Steps

#### 1. Prepare Database

```bash
# Create production database
# Use Supabase or another provider
```

#### 2. Install Vercel CLI

```bash
npm install -g vercel
```

#### 3. Login to Vercel

```bash
vercel login
```

#### 4. Configure Project

Create `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret"
  }
}
```

#### 5. Add Environment Variables

```bash
# Via CLI
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add SMTP_HOST production
# ... add all other env vars

# Or via Vercel Dashboard:
# 1. Go to project settings
# 2. Environment Variables
# 3. Add each variable
```

#### 6. Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

#### 7. Run Database Migrations

After first deployment:

```bash
# Connect to your database and run
npx prisma migrate deploy
npx prisma db seed
```

### Vercel Configuration

**Build Settings:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables:**
All environment variables from `.env` file

### Domain Setup

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

## Railway Deployment

Railway offers an all-in-one solution with built-in PostgreSQL.

### Steps

#### 1. Create Railway Account

Sign up at [railway.app](https://railway.app)

#### 2. New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your repository

#### 3. Add PostgreSQL

1. Click "New Service"
2. Select "Database" → "PostgreSQL"
3. Note the connection string

#### 4. Configure Environment Variables

In Railway dashboard:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
SHADOW_DATABASE_URL=${{Postgres.DATABASE_URL}}
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}
SMTP_HOST=<your-smtp-host>
SMTP_PORT=<smtp-port>
SMTP_USER=<smtp-user>
SMTP_PASS=<smtp-password>
EMAIL_FROM=<sender-email>
```

#### 5. Add Build Command

In Settings → Deploy:

```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

#### 6. Deploy

Push to GitHub - Railway auto-deploys

#### 7. Custom Domain

1. Settings → Networking → Custom Domain
2. Add your domain
3. Update DNS records

## Traditional VPS Deployment

For DigitalOcean, AWS EC2, Linode, etc.

### Prerequisites

- Ubuntu 22.04 LTS server
- Root or sudo access
- Domain name pointed to server IP

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Step 2: Database Setup

```bash
# Switch to postgres user
sudo -i -u postgres

# Create database and user
psql
CREATE DATABASE child_protection;
CREATE USER cp_user WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE child_protection TO cp_user;
\q
exit

# Enable PostgreSQL remote connections (if needed)
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

### Step 3: Deploy Application

```bash
# Create app directory
sudo mkdir -p /var/www/child-protection
sudo chown $USER:$USER /var/www/child-protection
cd /var/www/child-protection

# Clone repository
git clone <your-repo-url> .

# Install dependencies
npm install

# Create .env file
nano .env
# Add all environment variables

# Build application
npm run build

# Run migrations
npx prisma migrate deploy
npx prisma db seed
```

### Step 4: Configure PM2

```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'child-protection',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

```bash
# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Run the command that PM2 outputs
```

### Step 5: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/child-protection
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/child-protection /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 6: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 7: Firewall Configuration

```bash
# Enable firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### Step 8: Monitoring Setup

```bash
# View application logs
pm2 logs

# Monitor processes
pm2 monit

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://cp_user:password@db:5432/child_protection
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=cp_user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=child_protection
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Database Setup

### Production Database Options

#### Supabase (Recommended for small-medium apps)

1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection strings from Settings → Database
4. Use pooler connection (port 6543) for DATABASE_URL
5. Use direct connection (port 5432) for migrations

#### Neon (Serverless PostgreSQL)

1. Sign up at [neon.tech](https://neon.tech)
2. Create database
3. Copy connection string
4. Add to environment variables

#### AWS RDS

1. Create PostgreSQL instance
2. Configure security groups
3. Note endpoint and credentials
4. Use connection string format

#### DigitalOcean Managed Database

1. Create PostgreSQL cluster
2. Add trusted sources
3. Get connection details
4. Use in environment variables

### Database Migrations in Production

```bash
# Always backup before migrations!
pg_dump -U username -d database_name > backup.sql

# Run migrations
npx prisma migrate deploy

# If migration fails, restore backup
psql -U username -d database_name < backup.sql
```

## Environment Configuration

### Production Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:6543/database?pgbouncer=true"
SHADOW_DATABASE_URL="postgresql://user:password@host:5432/database"

# Authentication (generate new secrets!)
NEXTAUTH_SECRET="production-secret-here"
JWT_SECRET="production-jwt-secret"

# URLs (update with your domain)
NEXTAUTH_URL="https://yourdomain.com"
APP_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Email (use production SMTP)
SMTP_HOST="smtp.yourmailprovider.com"
SMTP_PORT="587"
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="Child Protection Directory <noreply@yourdomain.com>"

# Optional: Error tracking
SENTRY_DSN="your-sentry-dsn"

# Optional: Analytics
NEXT_PUBLIC_GA_ID="your-ga-id"
```

### Generating Secure Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32

# Generate random password
openssl rand -base64 24
```

## Post-Deployment Steps

### 1. Verify Deployment

```bash
# Check if app is running
curl https://yourdomain.com

# Check health endpoint (if implemented)
curl https://yourdomain.com/api/health
```

### 2. Create Admin User

```bash
# If seed didn't run, manually create admin
# or use the activation flow
```

### 3. Test Core Functionality

- [ ] Homepage loads correctly
- [ ] Login works
- [ ] Dashboard is accessible
- [ ] User invitation sends email
- [ ] Directory creation works
- [ ] Search functionality works
- [ ] All API endpoints respond

### 4. Configure Monitoring

Set up:
- Error tracking (Sentry)
- Uptime monitoring (UptimeRobot)
- Performance monitoring
- Log aggregation

### 5. Setup Backups

```bash
# Automated daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U username database_name | gzip > backup_$DATE.sql.gz

# Upload to cloud storage
# aws s3 cp backup_$DATE.sql.gz s3://your-bucket/backups/
```

### 6. Security Hardening

- Enable firewall
- Configure fail2ban
- Set up SSL
- Implement rate limiting
- Enable security headers
- Regular security updates

## Monitoring and Maintenance

### Monitoring Checklist

- [ ] Application uptime
- [ ] Database performance
- [ ] Error rates
- [ ] Response times
- [ ] Disk space
- [ ] Memory usage
- [ ] SSL certificate expiry

### Maintenance Tasks

**Daily:**
- Check error logs
- Monitor uptime

**Weekly:**
- Review performance metrics
- Check database size
- Review user activity

**Monthly:**
- Security updates
- Dependency updates
- Backup verification
- Performance optimization

### Updating the Application

```bash
# On VPS
cd /var/www/child-protection
git pull origin main
npm install
npx prisma migrate deploy
npm run build
pm2 restart child-protection

# On Vercel/Railway
# Simply push to main branch
git push origin main
```

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs child-protection

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Port already in use
```

### Database Connection Issues

```bash
# Test database connection
psql "postgresql://user:password@host:port/database"

# Check if PostgreSQL is running
sudo systemctl status postgresql
```

### 502 Bad Gateway (Nginx)

```bash
# Check if app is running
pm2 status

# Check Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Out of Memory

```bash
# Check memory usage
free -h

# Increase swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew

# Check certificate
sudo certbot certificates
```

## Performance Optimization

### Caching

Implement caching for:
- API responses
- Database queries
- Static assets

### CDN

Use a CDN for:
- Static assets
- Images
- JavaScript/CSS bundles

### Database Optimization

- Add appropriate indexes
- Use connection pooling
- Optimize slow queries
- Regular vacuum and analyze

### Load Balancing

For high traffic:
- Multiple application instances
- Database replication
- Redis for sessions/cache

## Rollback Procedure

If deployment fails:

```bash
# On VPS
cd /var/www/child-protection
git reset --hard HEAD~1
npm install
npx prisma migrate deploy
npm run build
pm2 restart child-protection

# Database rollback
psql -U username -d database_name < backup.sql
```

## Support

For deployment help:
- Check [troubleshooting](#troubleshooting) section
- Review platform documentation
- Contact the development team

---

**Last Updated**: October 2025  
**Maintained By**: Development Team


