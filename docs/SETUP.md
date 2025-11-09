# Quick Setup Guide

Get the Child Protection Services Directory up and running in minutes.

## Prerequisites Check

Before starting, ensure you have:

- [ ] Node.js 22.x or higher installed
- [ ] PostgreSQL 14+ installed and running
- [ ] Git installed
- [ ] A code editor (VS Code recommended)
- [ ] Terminal/Command line access

### Verify Installations

```bash
# Check Node.js version
node --version  # Should show v22.x.x

# Check npm version
npm --version

# Check PostgreSQL
psql --version
```

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd child-protection

# Install dependencies
npm install
```

## Step 2: Database Setup

### Option A: Local PostgreSQL

```bash
# Create database and user
psql -U postgres

# In PostgreSQL shell:
CREATE DATABASE child_protection;
CREATE DATABASE child_protection_shadow;
CREATE USER cp_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE child_protection TO cp_user;
GRANT ALL PRIVILEGES ON DATABASE child_protection_shadow TO cp_user;
\q
```

### Option B: Cloud Database (Supabase)

1. Sign up at [Supabase](https://supabase.com)
2. Create a new project
3. Note the connection strings:
   - Transaction pooler (port 6543) for DATABASE_URL
   - Direct connection (port 5432) for SHADOW_DATABASE_URL

## Step 3: Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy from example (if available) or create new
touch .env
```

Add the following variables to `.env`:

```env
# Database URLs
DATABASE_URL="postgresql://cp_user:your_secure_password@localhost:5432/child_protection?pgbouncer=true"
SHADOW_DATABASE_URL="postgresql://cp_user:your_secure_password@localhost:5432/child_protection_shadow"

# Generate secrets using: openssl rand -base64 32
NEXTAUTH_SECRET="your-nextauth-secret-here"
JWT_SECRET="your-jwt-secret-here"

# Application URLs
NEXTAUTH_URL="http://localhost:3000"
APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email Configuration (Required for user invitations)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="Child Protection Directory <noreply@yourdomain.com>"
```

### Generate Secure Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

### Email Configuration Tips

**Gmail:**
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `SMTP_PASS`

**Other SMTP Providers:**
- **SendGrid**: Use API key as password with port 587
- **Mailgun**: Use SMTP credentials from dashboard
- **AWS SES**: Get SMTP credentials from IAM

## Step 4: Database Migration and Seeding

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations and seed (this will reset the database)
npm run prisma:migrate

# Or run them separately:
# npx prisma migrate deploy  # Apply migrations
# npm run prisma:seed        # Seed data
```

### What Gets Seeded?

- ✅ All Rwandan districts, sectors, cells, and villages
- ✅ Default service types (Counseling, Medical Care, etc.)
- ✅ Sample beneficiary types
- ✅ Initial admin user
- ✅ Sample service providers (optional)

### Default Admin Credentials

After seeding, check `prisma/seed.cjs` for the default admin credentials.

**Important**: Change the password immediately after first login!

## Step 5: Start the Development Server

```bash
npm run dev
```

The application should now be running at `http://localhost:3000`

## Step 6: Verify Installation

### Test the Application

1. **Homepage**: Navigate to `http://localhost:3000`
   - Should see the search interface
   - Service cards should be visible

2. **Login**: Go to `http://localhost:3000/login`
   - Use the default admin credentials from seed file
   - Should redirect to dashboard after login

3. **Dashboard**: At `http://localhost:3000/dashboard`
   - Should see statistics cards
   - Sidebar navigation should work

4. **Create User**: Test user management
   - Go to Dashboard → Users
   - Click "Invite User"
   - Check that email is sent (check logs if using a dev SMTP service)

## Troubleshooting

### Common Issues

#### Database Connection Failed

```bash
Error: Can't reach database server at `localhost:5432`
```

**Solution:**
- Ensure PostgreSQL is running: `sudo systemctl start postgresql`
- Check connection string in `.env`
- Verify database user permissions

#### Prisma Client Not Generated

```bash
Error: Cannot find module '@prisma/client'
```

**Solution:**
```bash
npm run prisma:generate
```

#### Migration Errors

```bash
Error: P3005: The database schema is not empty
```

**Solution:**
```bash
# Reset the database
npx prisma migrate reset --force
```

#### Email Sending Failed

```bash
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solution:**
- For Gmail: Use App Password, not regular password
- Check SMTP credentials
- Verify SMTP host and port
- Enable less secure app access (if applicable)

#### Port Already in Use

```bash
Error: Port 3000 is already in use
```

**Solution:**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

#### NextAuth Secret Missing

```bash
Error: [next-auth][error][NO_SECRET]
```

**Solution:**
- Add `NEXTAUTH_SECRET` to `.env`
- Generate with: `openssl rand -base64 32`

## Development Tools

### Recommended VS Code Extensions

- **Prisma** - Syntax highlighting for Prisma schema
- **ESLint** - Linting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **Thunder Client** - API testing
- **GitLens** - Git integration

### Database Management Tools

- **Prisma Studio**: `npx prisma studio` - Visual database editor
- **pgAdmin** - PostgreSQL GUI
- **DBeaver** - Universal database tool
- **TablePlus** - Modern database GUI (paid)

### Useful Commands

```bash
# Open Prisma Studio (visual database editor)
npx prisma studio

# View database schema
npx prisma db pull

# Format Prisma schema
npx prisma format

# Check build
npm run build

# Run linter
npm run lint
```

## Next Steps

Now that you have the application running:

1. **Explore the Code**
   - Read through `app/page.tsx` for the homepage
   - Check `app/api` for backend routes
   - Review `prisma/schema.prisma` for data model

2. **Make Changes**
   - Create a feature branch
   - Make your changes
   - Test thoroughly
   - Submit a pull request

3. **Read Documentation**
   - [API Documentation](./API.md)
   - [Main README](../README.md)
   - [Contributing Guide](./CONTRIBUTING.md)

4. **Join Development**
   - Check open issues
   - Discuss features
   - Submit bug reports

## Development Workflow

### Typical Development Session

```bash
# 1. Start development server
npm run dev

# 2. Open Prisma Studio (in another terminal)
npx prisma studio

# 3. Make changes to code
# Files auto-reload on save

# 4. If you modify the database schema
npx prisma migrate dev --name your_migration_name
npx prisma generate

# 5. Test your changes
# Open http://localhost:3000

# 6. Commit your changes
git add .
git commit -m "feat: your feature description"
```

### Database Reset (Development Only)

```bash
# WARNING: This deletes all data!
npx prisma migrate reset --force
npm run prisma:seed
```

## Environment-Specific Setup

### Development

```env
NODE_ENV=development
DATABASE_URL="postgresql://localhost:5432/child_protection_dev"
APP_URL="http://localhost:3000"
```

### Staging

```env
NODE_ENV=staging
DATABASE_URL="postgresql://staging-db-url"
APP_URL="https://staging.yourdomain.com"
```

### Production

```env
NODE_ENV=production
DATABASE_URL="postgresql://production-db-url"
APP_URL="https://yourdomain.com"
```

## Quick Reference

### Project URLs (Development)

- Homepage: `http://localhost:3000`
- Login: `http://localhost:3000/login`
- Dashboard: `http://localhost:3000/dashboard`
- Admin Users: `http://localhost:3000/dashboard/users`
- API Base: `http://localhost:3000/api`
- Prisma Studio: `http://localhost:5555` (after `npx prisma studio`)

### Key Files

- **Environment**: `.env`
- **Database Schema**: `prisma/schema.prisma`
- **Seed Data**: `prisma/seed.cjs`
- **API Routes**: `app/api/**/route.ts`
- **Pages**: `app/**/page.tsx`
- **Components**: `components/**/*.tsx`

### Essential NPM Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open database GUI
npx prisma migrate dev  # Create and apply migration
npx prisma generate  # Generate Prisma client
npm run prisma:seed  # Seed database
```

## Getting Help

If you're stuck:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [API Documentation](./API.md)
3. Check the [Issues](https://github.com/your-repo/issues) page
4. Ask the development team
5. Check Next.js and Prisma documentation

## Success Checklist

You've successfully set up the project when:

- [ ] Application runs at http://localhost:3000
- [ ] You can log in with admin credentials
- [ ] Dashboard displays statistics
- [ ] You can create a new directory
- [ ] Search functionality works
- [ ] Email sending is configured (check logs)
- [ ] Prisma Studio opens and shows data

Congratulations! You're ready to start developing! 🎉

---

**Need help?** Open an issue or contact the development team.


