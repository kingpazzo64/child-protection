# Changelog

All notable changes to the Child Protection Services Directory project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- Advanced analytics dashboard
- Export functionality (PDF, Excel)
- Multi-language support (Kinyarwanda, English, French)
- Mobile application (React Native)
- API rate limiting
- Advanced search with filters
- Real-time notifications
- File upload for service providers
- Reviews and ratings system
- Email notification preferences
- Two-factor authentication

## [0.1.0] - 2025-10-28

### Initial Release

#### Added
- **User Management**
  - User registration and invitation system
  - Email-based account activation
  - Role-based access control (Admin, Enumerator)
  - User profile management
  - Password change functionality
  - User deactivation/reactivation

- **Directory Management**
  - Create, read, update, delete service providers
  - Multiple service types per directory
  - Multiple beneficiary types per directory
  - Multiple location support
  - Organization categorization (Government, NGO, Community-based)
  - Free/Paid service indicator

- **Search and Filtering**
  - Search by organization name
  - Filter by district, sector, cell, village
  - Filter by service type
  - Filter by beneficiary type
  - Real-time search results
  - Debounced search input

- **Location System**
  - Complete Rwanda administrative divisions
  - 30 Districts
  - 416 Sectors
  - 2,148 Cells
  - 14,837 Villages
  - Hierarchical location selection

- **Authentication & Security**
  - NextAuth.js integration
  - JWT-based authentication
  - Bcrypt password hashing
  - Email verification
  - Role-based route protection
  - Middleware authentication

- **Admin Dashboard**
  - Statistics overview
  - User management interface
  - Directory management
  - Service type management
  - Beneficiary type management

- **Email System**
  - SMTP email integration
  - User invitation emails
  - Account activation emails
  - Resend activation emails

- **UI/UX**
  - Responsive design (mobile, tablet, desktop)
  - Modern UI with Tailwind CSS
  - Radix UI components
  - Toast notifications
  - Loading states
  - Error handling
  - Chat widget

- **Database**
  - PostgreSQL database
  - Prisma ORM
  - Database migrations
  - Seed data script
  - Location data seeding
  - Service type seeding

- **API Endpoints**
  - RESTful API architecture
  - User management endpoints
  - Directory CRUD endpoints
  - Service type endpoints
  - Beneficiary type endpoints
  - Location endpoints
  - Authentication endpoints

- **Documentation**
  - Comprehensive README
  - API documentation
  - Setup guide
  - Deployment guide
  - Contributing guidelines
  - Database documentation
  - Architecture documentation

### Technical Stack
- Next.js 15.4.4 with App Router
- React 19.1.0
- TypeScript 5
- Tailwind CSS 4
- Prisma 6.12.0
- PostgreSQL
- NextAuth.js 4.24.11
- Node.js 22.x

### Database Schema
- User model with roles
- Directory model with relations
- ServiceType model
- BeneficiaryType model
- Location models (District, Sector, Cell, Village)
- Junction tables for many-to-many relationships

### Security Features
- Password hashing with bcryptjs
- JWT token generation
- Email verification system
- Role-based access control
- Protected API routes
- Middleware authentication

## Version History

### Version Numbering

- **Major version (X.0.0)**: Incompatible API changes
- **Minor version (0.X.0)**: Add functionality (backwards compatible)
- **Patch version (0.0.X)**: Bug fixes (backwards compatible)

## Migration Guide

### From 0.0.x to 0.1.0

This is the initial release. No migration needed.

## Breaking Changes

None yet.

## Deprecations

None yet.

## Contributors

- Development Team

## Links

- [GitHub Repository](https://github.com/your-repo/child-protection)
- [Issue Tracker](https://github.com/your-repo/child-protection/issues)
- [Documentation](./docs/)

---

**Note**: This changelog is maintained manually. Please update it when making significant changes to the project.

**Last Updated**: October 28, 2025


