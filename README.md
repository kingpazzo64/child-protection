# Child Protection Services Directory

A comprehensive web application for managing and searching child protection services across Rwanda. This platform enables organizations to register their services and allows users to search for child protection services based on location, service type, and beneficiary categories.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication & Authorization](#authentication--authorization)
- [User Roles](#user-roles)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Child Protection Services Directory is a Next.js-based platform designed to centralize information about child protection services in Rwanda. The system provides:

- **Public Directory**: Searchable database of child protection services
- **Service Registration**: Organizations can register and manage their services
- **Location-Based Search**: Filter services by districts, sectors, cells, and villages
- **Admin Dashboard**: Comprehensive management tools for administrators
- **User Management**: Role-based access control with admin and enumerator roles

## ✨ Features

### Public Features
- 🔍 **Advanced Search**: Search services by name, location, service type, and beneficiary type
- 📍 **Location Filtering**: Filter by district, sector, cell, and village
- 🏢 **Service Directory**: View detailed information about service providers
- 💬 **Chat Widget**: Interactive assistance for users
- 📱 **Responsive Design**: Mobile-friendly interface

### Admin Features
- 👥 **User Management**: Invite, activate, and manage users
- 📊 **Dashboard**: View statistics and analytics
- 🏗️ **Directory Management**: Create, edit, and delete service entries
- 🔧 **Service Type Management**: Manage service categories
- 👶 **Beneficiary Type Management**: Manage beneficiary categories
- ✉️ **Email Invitations**: Automated user invitation system

### Enumerator Features
- ➕ **Add Services**: Register new service providers
- ✏️ **Edit Own Entries**: Manage self-created directory entries
- 📋 **View Dashboard**: Access to personal statistics

## 🛠 Technology Stack

### Frontend
- **Next.js 15.4.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **React Hot Toast** - Toast notifications

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **NextAuth.js 4** - Authentication solution
- **Prisma 6** - Database ORM
- **PostgreSQL** - Primary database
- **Express.js** - Custom server

### Additional Tools
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation
- **Nodemailer** - Email sending
- **Mapbox GL** - Map integration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 22.x or higher
- **npm** or **yarn** package manager
- **PostgreSQL** 14 or higher
- **Git** for version control

## 🚀 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd child-protection
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory (see [Environment Variables](#environment-variables) section)

4. **Set up the database**

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations and seed data
npm run prisma:migrate
```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?pgbouncer=true"
SHADOW_DATABASE_URL="postgresql://username:password@host:port/shadow_database"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# JWT
JWT_SECRET="your-jwt-secret-key"

# Application URLs
APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email Configuration (SMTP)
SMTP_HOST="your-smtp-host"
SMTP_PORT="465"
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-email-password"
EMAIL_FROM="Child Protection Directory <noreply@yourdomain.com>"

# Optional: Mapbox (if using map features)
NEXT_PUBLIC_MAPBOX_TOKEN="your-mapbox-token"
```

### Environment Variable Descriptions

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string with pgbouncer | Yes |
| `SHADOW_DATABASE_URL` | Shadow database for Prisma migrations | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js (generate with `openssl rand -base64 32`) | Yes |
| `NEXTAUTH_URL` | Full URL of your application | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `APP_URL` | Application URL for server-side operations | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL for client-side operations | Yes |
| `SMTP_HOST` | SMTP server hostname | Yes |
| `SMTP_PORT` | SMTP server port | Yes |
| `SMTP_USER` | SMTP username/email | Yes |
| `SMTP_PASS` | SMTP password | Yes |
| `EMAIL_FROM` | Sender email address with display name | Yes |

## 🗄 Database Setup

### Database Schema Overview

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: System users (admins and enumerators)
- **Directory**: Service provider entries
- **ServiceType**: Categories of services offered
- **BeneficiaryType**: Types of beneficiaries served
- **Location Models**: District, Sector, Cell, Village (Rwanda administrative divisions)
- **Junction Tables**: DirectoryService, DirectoryBeneficiary, DirectoryLocation

### Running Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Apply migrations (development)
npx prisma migrate dev

# Apply migrations (production)
npx prisma migrate deploy

# Reset database and seed data
npm run prisma:migrate
```

### Seeding the Database

The seed script (`prisma/seed.cjs`) populates:
- Administrative locations (districts, sectors, cells, villages)
- Default service types
- Sample service providers
- Initial admin user

```bash
npm run prisma:seed
```

### Default Admin Credentials

After seeding, a default admin account is created:
- **Email**: Check the seed file for default credentials
- **Password**: Check the seed file for default credentials

⚠️ **Important**: Change default credentials immediately after first login!

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Reset database and apply migrations |
| `npm run prisma:seed` | Seed database with initial data |

## 📁 Project Structure

```
child-protection/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── directories/          # Directory CRUD operations
│   │   ├── service-types/        # Service type management
│   │   ├── beneficiary-types/    # Beneficiary type management
│   │   ├── users/                # User management
│   │   └── [districts, sectors, cells, villages]/
│   ├── dashboard/                # Admin/Enumerator dashboard
│   │   ├── users/                # User management UI
│   │   ├── directories/          # Directory management UI
│   │   ├── service-types/        # Service type management UI
│   │   └── beneficiary-types/    # Beneficiary type management UI
│   ├── login/                    # Login page
│   ├── activate/                 # User activation page
│   └── page.tsx                  # Public homepage
├── components/                   # React components
│   ├── ui/                       # Shadcn UI components
│   ├── users/                    # User-related components
│   ├── Header.tsx                # Site header
│   ├── Footer.tsx                # Site footer
│   ├── SearchSection.tsx         # Search interface
│   └── ServiceCard.tsx           # Service display card
├── lib/                          # Utility functions
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client
│   ├── mailer.ts                 # Email utilities
│   └── utils.ts                  # Helper functions
├── prisma/                       # Database configuration
│   ├── schema.prisma             # Database schema
│   ├── seed.cjs                  # Seed script
│   └── migrations/               # Database migrations
├── types/                        # TypeScript type definitions
├── public/                       # Static assets
├── middleware.ts                 # Next.js middleware (auth)
├── server.js                     # Custom Express server
└── package.json                  # Dependencies
```

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/[...nextauth]`
NextAuth.js authentication handler

#### POST `/api/login`
User login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST `/api/logout`
User logout (requires authentication)

### User Management

#### GET `/api/users`
Get all users (Admin only)

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ADMIN",
      "emailVerified": true,
      "disabled": false
    }
  ]
}
```

#### POST `/api/users/invite`
Invite new user (Admin only)

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+250788123456",
  "idNumber": "1234567890123456",
  "role": "ENUMERATOR"
}
```

#### PUT `/api/users/[id]`
Update user (Admin only)

#### DELETE `/api/users/[id]`
Delete user (Admin only)

#### POST `/api/users/activate`
Activate user account with token

### Directory Management

#### GET `/api/directories`
Get all directories (filtered by role)

**Response:**
```json
{
  "directories": [
    {
      "id": 1,
      "nameOfOrganization": "Child Care Center",
      "category": "GOVERNMENT",
      "email": "info@childcare.rw",
      "phone": "+250788123456",
      "website": "https://childcare.rw",
      "paid": false,
      "services": [...],
      "beneficiaries": [...],
      "locations": [...]
    }
  ]
}
```

#### POST `/api/directories`
Create new directory (Authenticated users)

**Request:**
```json
{
  "nameOfOrganization": "New Service Provider",
  "category": "NON_GOVERNMENTAL",
  "email": "contact@provider.rw",
  "phone": "+250788123456",
  "website": "https://provider.rw",
  "paid": false,
  "otherServices": "Additional services offered",
  "serviceTypeIds": [1, 2, 3],
  "beneficiaryTypeIds": [1, 2],
  "locations": [
    {
      "districtId": 1,
      "sectorId": 1,
      "cellId": 1,
      "villageId": 1
    }
  ]
}
```

#### PUT `/api/directories/[id]`
Update directory (Owner or Admin)

#### DELETE `/api/directories/[id]`
Delete directory (Owner or Admin)

### Service Types

#### GET `/api/service-types`
Get all service types

#### POST `/api/service-types`
Create service type (Admin only)

#### PUT `/api/service-types/[id]`
Update service type (Admin only)

#### DELETE `/api/service-types/[id]`
Delete service type (Admin only)

### Beneficiary Types

#### GET `/api/beneficiary-types`
Get all beneficiary types

#### POST `/api/beneficiary-types`
Create beneficiary type (Admin only)

#### PUT `/api/beneficiary-types/[id]`
Update beneficiary type (Admin only)

#### DELETE `/api/beneficiary-types/[id]`
Delete beneficiary type (Admin only)

### Location Endpoints

#### GET `/api/districts`
Get all districts

#### GET `/api/sectors/[districtId]`
Get sectors by district

#### GET `/api/cells/[sectorId]`
Get cells by sector

#### GET `/api/villages/[cellId]`
Get villages by cell

## 🔒 Authentication & Authorization

### Authentication Flow

1. **User Invitation**: Admin invites user via email
2. **Email Verification**: User receives activation link
3. **Account Activation**: User sets password and activates account
4. **Login**: User logs in with email and password
5. **JWT Token**: NextAuth.js issues JWT token stored in session

### Authorization Levels

The application uses NextAuth.js with JWT strategy for authentication:

- **Public Routes**: Homepage, search functionality
- **Protected Routes**: Dashboard, user profile
- **Admin Routes**: User management, system configuration

### Middleware Protection

Routes are protected via `middleware.ts`:
- `/dashboard/*` - Requires authentication
- `/admin/*` - Requires ADMIN role
- `/api/protected/*` - Requires authentication

### Password Security

- Passwords are hashed using **bcryptjs** with salt rounds
- Activation tokens are generated using **jsonwebtoken**
- Tokens expire after 7 days

## 👥 User Roles

### ADMIN
- Full system access
- User management (invite, edit, delete, activate/deactivate)
- Manage service types and beneficiary types
- View and edit all directories
- Access to system analytics

### ENUMERATOR
- Create and manage own directory entries
- View personal statistics
- Cannot access user management
- Cannot modify system configuration

## 💻 Development Workflow

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for Next.js
- **Formatting**: Follow existing code style

### Git Workflow

1. Create feature branch from `master`
```bash
git checkout -b feature/your-feature-name
```

2. Make changes and commit
```bash
git add .
git commit -m "feat: description of changes"
```

3. Push to remote
```bash
git push origin feature/your-feature-name
```

4. Create Pull Request

### Commit Message Convention

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Database Changes

1. Modify `prisma/schema.prisma`
2. Create migration:
```bash
npx prisma migrate dev --name description_of_change
```
3. Update seed file if necessary
4. Test migration thoroughly

### Adding New API Endpoints

1. Create route file in `app/api/[endpoint]/route.ts`
2. Implement GET, POST, PUT, DELETE handlers as needed
3. Add authentication/authorization checks
4. Update this documentation

## 🚀 Deployment

### Prerequisites for Production

- PostgreSQL database (recommend cloud provider like Supabase, AWS RDS)
- Node.js hosting platform (Vercel, Railway, AWS, DigitalOcean)
- SMTP email service
- Domain name (optional)

### Deployment Steps

1. **Database Setup**
   - Create production PostgreSQL database
   - Create shadow database for migrations
   - Note connection strings

2. **Environment Variables**
   - Set all production environment variables
   - Use strong, unique secrets
   - Update URLs to production domain

3. **Build Application**
```bash
npm run build
```

4. **Run Migrations**
```bash
npx prisma migrate deploy
```

5. **Seed Database**
```bash
npm run prisma:seed
```

6. **Start Server**
```bash
npm start
```

### Deployment Platforms

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Configuration:
- Set environment variables in Vercel dashboard
- Connect PostgreSQL database
- Enable Edge Functions for API routes

#### Railway

1. Connect GitHub repository
2. Add PostgreSQL service
3. Set environment variables
4. Deploy automatically on push

#### Docker (Optional)

Create `Dockerfile`:
```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Post-Deployment

1. Verify database connectivity
2. Test authentication flow
3. Create initial admin user
4. Change default credentials
5. Test email functionality
6. Monitor application logs
7. Set up error tracking (optional: Sentry)

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and activation
- [ ] Login/logout functionality
- [ ] Directory creation and editing
- [ ] Search and filtering
- [ ] Admin user management
- [ ] Email delivery
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### Automated Testing (To Be Implemented)

Consider adding:
- Unit tests with Jest
- Integration tests with React Testing Library
- E2E tests with Playwright or Cypress
- API tests with Supertest

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

### Areas for Contribution

- Bug fixes
- Feature enhancements
- Documentation improvements
- Test coverage
- Performance optimizations
- UI/UX improvements

## 📝 Notes

### Known Issues

- Check GitHub Issues for current known issues

### Future Enhancements

- [ ] Advanced analytics dashboard
- [ ] Export functionality (PDF, Excel)
- [ ] Multi-language support
- [ ] Mobile application
- [ ] API rate limiting
- [ ] Advanced search with Elasticsearch
- [ ] Real-time notifications
- [ ] File upload for service providers
- [ ] Reviews and ratings system

## 📄 License

This project is proprietary. All rights reserved.

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Contact the development team
- Check documentation

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/) and [Shadcn UI](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Maps by [Mapbox](https://www.mapbox.com/)

---

**Last Updated**: October 2025  
**Version**: 0.1.0  
**Maintained By**: Development Team
