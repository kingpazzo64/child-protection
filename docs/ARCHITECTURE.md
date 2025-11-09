# System Architecture

This document describes the architecture, design decisions, and technical implementation of the Child Protection Services Directory.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Application Layers](#application-layers)
- [Data Flow](#data-flow)
- [Authentication Flow](#authentication-flow)
- [Design Patterns](#design-patterns)
- [Security Architecture](#security-architecture)
- [Performance Considerations](#performance-considerations)
- [Scalability](#scalability)
- [Design Decisions](#design-decisions)

## Overview

The Child Protection Services Directory is a full-stack web application built with Next.js, following a modern, serverless-friendly architecture. The system is designed to be:

- **Scalable**: Can handle growing data and user base
- **Secure**: Implements industry-standard security practices
- **Maintainable**: Clean code structure and separation of concerns
- **Performant**: Optimized for fast load times and responsiveness
- **User-friendly**: Intuitive interface for all user types

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│  (Browser - React Components, Tailwind CSS)             │
└───────────────────┬─────────────────────────────────────┘
                    │ HTTP/HTTPS
                    │ REST API
┌───────────────────▼─────────────────────────────────────┐
│                 Application Layer                       │
│  (Next.js App Router - Pages & API Routes)              │
├─────────────────────────────────────────────────────────┤
│                Authentication Layer                      │
│            (NextAuth.js - JWT Strategy)                 │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│                  Business Logic Layer                   │
│        (Services, Utilities, Validation)                │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│                   Data Access Layer                     │
│              (Prisma ORM - Type-safe)                   │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│                   Database Layer                        │
│         (PostgreSQL - Relational Database)              │
└─────────────────────────────────────────────────────────┘
```

### Component Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Frontend                             │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│ │   Pages      │  │  Components  │  │    Hooks     │   │
│ │  (Routes)    │  │    (UI)      │  │  (Logic)     │   │
│ └──────────────┘  └──────────────┘  └──────────────┘   │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                    API Layer                             │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│ │    Auth      │  │    Users     │  │ Directories  │   │
│ │   Routes     │  │   Routes     │  │   Routes     │   │
│ └──────────────┘  └──────────────┘  └──────────────┘   │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                  Middleware                              │
│         Authentication & Authorization                   │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                 Database (Prisma)                        │
│    Models, Migrations, Queries, Transactions             │
└──────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

**Core Framework:**
- **Next.js 15.4.4**: React framework with App Router, SSR, and API routes
- **React 19.1.0**: UI library for building interactive interfaces
- **TypeScript 5**: Static typing for improved code quality

**Styling:**
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible, unstyled component primitives
- **Lucide React**: Icon library

**State & Forms:**
- **React Hook Form**: Performant form handling
- **React Hot Toast**: Toast notifications

### Backend

**Framework:**
- **Next.js API Routes**: Serverless API endpoints
- **Express.js**: Custom server for advanced configurations

**Database:**
- **PostgreSQL**: Relational database
- **Prisma 6**: Type-safe ORM and query builder

**Authentication:**
- **NextAuth.js 4**: Authentication solution with JWT strategy
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token generation

**Email:**
- **Nodemailer**: Email sending via SMTP

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting (via Tailwind)
- **TypeScript**: Type checking
- **Git**: Version control

## Application Layers

### 1. Presentation Layer

**Location**: `app/`, `components/`

**Responsibilities:**
- Render UI components
- Handle user interactions
- Display data to users
- Form handling and validation
- Client-side state management

**Key Components:**
```
app/
├── page.tsx                    # Public homepage
├── login/page.tsx              # Login page
├── dashboard/                  # Protected dashboard
│   ├── page.tsx               # Dashboard home
│   ├── users/page.tsx         # User management
│   ├── directories/page.tsx   # Directory management
│   └── layout.tsx             # Dashboard layout
└── activate/                   # User activation

components/
├── ui/                         # Reusable UI components
├── Header.tsx                  # Site header
├── Footer.tsx                  # Site footer
├── SearchSection.tsx           # Search interface
└── ServiceCard.tsx             # Service display
```

**Design Pattern**: Component-based architecture with separation of concerns

### 2. API Layer

**Location**: `app/api/`

**Responsibilities:**
- Handle HTTP requests
- Route management
- Request validation
- Response formatting
- Error handling

**Key Routes:**
```
app/api/
├── auth/                       # Authentication
│   └── [...nextauth]/route.ts
├── users/                      # User management
│   ├── route.ts               # List/create users
│   ├── [id]/route.ts          # Get/update/delete user
│   └── invite/route.ts        # Invite users
├── directories/                # Directory management
│   ├── route.ts               # List/create directories
│   └── [id]/route.ts          # Get/update/delete directory
├── service-types/              # Service types
├── beneficiary-types/          # Beneficiary types
└── districts/                  # Location data
```

**Design Pattern**: RESTful API design with resource-based routing

### 3. Business Logic Layer

**Location**: `lib/`

**Responsibilities:**
- Business rules enforcement
- Data transformation
- Utility functions
- Email services
- Authentication logic

**Key Files:**
```
lib/
├── auth.ts                     # NextAuth configuration
├── auth.server.ts              # Server-side auth utilities
├── prisma.ts                   # Prisma client instance
├── mailer.ts                   # Email service
├── authHelpers.ts              # Auth helper functions
└── utils.ts                    # General utilities
```

**Design Pattern**: Service layer pattern with dependency injection

### 4. Data Access Layer

**Location**: `prisma/`

**Responsibilities:**
- Database schema definition
- Query execution
- Data migrations
- Transaction management
- Data seeding

**Key Files:**
```
prisma/
├── schema.prisma               # Database schema
├── seed.cjs                    # Seed script
└── migrations/                 # Migration history
```

**Design Pattern**: Repository pattern via Prisma ORM

### 5. Database Layer

**Technology**: PostgreSQL

**Schema Overview:**
- **Users**: System users with roles
- **Directories**: Service providers
- **ServiceTypes**: Service categories
- **BeneficiaryTypes**: Beneficiary categories
- **Locations**: Administrative divisions
- **Junction Tables**: Many-to-many relationships

## Data Flow

### Public Directory Search Flow

```
1. User enters search criteria
   ↓
2. SearchSection component updates state
   ↓
3. Debounced search triggers (300ms)
   ↓
4. Fetch request to /api/directories
   ↓
5. API route queries database via Prisma
   ↓
6. Prisma executes SQL query
   ↓
7. PostgreSQL returns results
   ↓
8. API formats and returns JSON
   ↓
9. Frontend updates state
   ↓
10. ServiceCard components re-render
```

### User Creation Flow

```
1. Admin clicks "Invite User"
   ↓
2. Modal form displayed
   ↓
3. Admin submits form data
   ↓
4. POST /api/users/invite
   ↓
5. Validate request data
   ↓
6. Check authentication & authorization
   ↓
7. Generate activation token
   ↓
8. Create user in database
   ↓
9. Send activation email
   ↓
10. Return success response
   ↓
11. Update UI with new user
```

### Directory Creation Flow

```
1. User fills directory form
   ↓
2. Select services, beneficiaries, locations
   ↓
3. POST /api/directories
   ↓
4. Validate authentication
   ↓
5. Validate form data
   ↓
6. Prisma transaction starts
   ↓
7. Create directory record
   ↓
8. Create junction records (services, beneficiaries, locations)
   ↓
9. Commit transaction
   ↓
10. Return complete directory object
   ↓
11. Redirect to directory list
```

## Authentication Flow

### Login Flow

```
1. User enters email & password
   ↓
2. POST /api/auth/signin (NextAuth)
   ↓
3. Credentials provider validates
   ↓
4. Query database for user
   ↓
5. Verify password with bcrypt
   ↓
6. Check emailVerified and disabled flags
   ↓
7. Generate JWT token
   ↓
8. Set session cookie
   ↓
9. Return user object
   ↓
10. Redirect to dashboard
```

### Account Activation Flow

```
1. User receives email with activation link
   ↓
2. Click link → /activate/[token]
   ↓
3. Page validates token (JWT)
   ↓
4. Display password form
   ↓
5. User sets password
   ↓
6. POST /api/users/activate
   ↓
7. Verify token
   ↓
8. Hash password with bcrypt
   ↓
9. Update user: password, emailVerified=true, activationToken=null
   ↓
10. Return success
   ↓
11. Redirect to login
```

### Protected Route Access

```
1. User requests /dashboard/*
   ↓
2. middleware.ts intercepts request
   ↓
3. Check for valid session token
   ↓
4. If no token → redirect to /login
   ↓
5. If valid token → extract user data
   ↓
6. Check role for admin routes
   ↓
7. If authorized → allow access
   ↓
8. If not authorized → redirect to /unauthorized
```

## Design Patterns

### 1. Component Pattern

**Location**: `components/`

**Pattern**: Atomic Design
- Atoms: Button, Input, Label (in `ui/`)
- Molecules: UserCard, DirectoryForm
- Organisms: UserList, SearchSection
- Templates: Dashboard layout
- Pages: Complete pages

### 2. Server Components Pattern

**Next.js App Router**
- Server components by default
- Client components marked with `"use client"`
- Data fetching in server components
- Interactivity in client components

### 3. API Route Pattern

**RESTful Design**
```typescript
// GET /api/resource - List all
// POST /api/resource - Create new
// GET /api/resource/[id] - Get one
// PUT /api/resource/[id] - Update one
// DELETE /api/resource/[id] - Delete one
```

### 4. Repository Pattern

**Via Prisma ORM**
```typescript
// Instead of direct SQL
const users = await prisma.user.findMany()

// Type-safe queries
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { directories: true }
})
```

### 5. Middleware Pattern

**Authentication & Authorization**
```typescript
// middleware.ts
export default withAuth(
  function middleware(req) {
    // Check permissions
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)
```

---

**Last Updated**: October 28, 2025  
**Architecture Version**: 1.0  
**Maintained By**: Fine Africa Team


