# Database Documentation

Complete database schema and relationship documentation for the Child Protection Services Directory.

## Table of Contents

- [Overview](#overview)
- [Database Schema](#database-schema)
- [Models](#models)
- [Relationships](#relationships)
- [Indexes and Constraints](#indexes-and-constraints)
- [Common Queries](#common-queries)
- [Migrations](#migrations)
- [Seeding](#seeding)
- [Backup and Restore](#backup-and-restore)

## Overview

The application uses **PostgreSQL** as the primary database with **Prisma** as the ORM.

### Technology Stack

- **Database**: PostgreSQL 14+
- **ORM**: Prisma 6.x
- **Connection Pooling**: PgBouncer (recommended for production)
- **Migrations**: Prisma Migrate

### Database Structure

The database consists of:
- **Core Models**: User, Directory
- **Classification Models**: ServiceType, BeneficiaryType
- **Location Models**: District, Sector, Cell, Village
- **Junction Tables**: DirectoryService, DirectoryBeneficiary, DirectoryLocation

## Database Schema

### Entity Relationship Diagram (ERD)

```
┌─────────────┐
│    User     │
└─────────────┘
      │ 1
      │ creates
      │
      ↓ *
┌─────────────────┐         ┌──────────────────┐
│   Directory     │ * ←──→ * │  ServiceType     │
└─────────────────┘         └──────────────────┘
      │ *                    (via DirectoryService)
      │
      ├──→ * ┌─────────────────────┐
      │      │ BeneficiaryType      │
      │      └─────────────────────┘
      │      (via DirectoryBeneficiary)
      │
      └──→ * ┌─────────────┐
             │  District   │
             └─────────────┘
                   │ 1
                   ↓ *
             ┌─────────────┐
             │   Sector    │
             └─────────────┘
                   │ 1
                   ↓ *
             ┌─────────────┐
             │    Cell     │
             └─────────────┘
                   │ 1
                   ↓ *
             ┌─────────────┐
             │   Village   │
             └─────────────┘
        (via DirectoryLocation)
```

## Models

### User

Stores system users (administrators and enumerators).

```prisma
model User {
  id              Int         @id @default(autoincrement())
  name            String
  phone           String
  email           String      @unique
  idNumber        String      @db.Char(16)
  role            Role
  password        String?
  emailVerified   Boolean     @default(false)
  activationToken String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  disabled        Boolean     @default(false)
  directories     Directory[]
  
  @@map("users")
}

enum Role {
  ADMIN
  ENUMERATOR
}
```

**Fields:**
- `id`: Primary key, auto-incrementing integer
- `name`: Full name of the user
- `phone`: Contact phone number
- `email`: Unique email address (used for login)
- `idNumber`: 16-character National ID number
- `role`: User role (ADMIN or ENUMERATOR)
- `password`: Hashed password (bcrypt)
- `emailVerified`: Whether email is verified
- `activationToken`: JWT token for account activation
- `disabled`: Soft delete flag
- `createdAt`: Timestamp when user was created
- `updatedAt`: Timestamp when user was last updated

**Indexes:**
- Unique index on `email`

**Business Rules:**
- Email must be unique
- Password must be hashed before storage
- Users must verify email before login
- Disabled users cannot log in
- Admins can manage all directories
- Enumerators can only manage their own directories

### Directory

Stores child protection service provider information.

```prisma
model Directory {
  id                 Int                    @id @default(autoincrement())
  nameOfOrganization String
  category           String
  email              String
  phone              String
  website            String?
  paid               Boolean                @default(false)
  otherServices      String?
  services           DirectoryService[]
  createdById        Int
  createdBy          User                   @relation(fields: [createdById], references: [id])
  locations          DirectoryLocation[]
  beneficiaries      DirectoryBeneficiary[]
}

enum Category {
  GOVERNMENT
  NON_GOVERNMENTAL
  COMMUNITY_BASED
}
```

**Fields:**
- `id`: Primary key
- `nameOfOrganization`: Organization name
- `category`: Organization category (Government, NGO, Community-based)
- `email`: Contact email
- `phone`: Contact phone number
- `website`: Optional website URL
- `paid`: Whether the service is paid or free
- `otherServices`: Additional services not in predefined list
- `createdById`: Foreign key to User
- `createdBy`: Relation to User who created this entry

**Relationships:**
- Many-to-One with User (creator)
- Many-to-Many with ServiceType (via DirectoryService)
- Many-to-Many with BeneficiaryType (via DirectoryBeneficiary)
- One-to-Many with DirectoryLocation

### ServiceType

Predefined categories of services offered.

```prisma
model ServiceType {
  id          Int                @id @default(autoincrement())
  name        String             @unique
  directories DirectoryService[]
}
```

**Examples:**
- Counseling
- Medical Care
- Legal Support
- Education
- Shelter
- Food Assistance

### BeneficiaryType

Types of beneficiaries served by the organization.

```prisma
model BeneficiaryType {
  id          Int                     @id @default(autoincrement())
  name        String                  @unique
  description String?
  directories DirectoryBeneficiary[]
}
```

**Examples:**
- Children 0-5 years
- Children 6-12 years
- Adolescents 13-17 years
- Street children
- Orphans
- Children with disabilities

### Location Models

Rwanda's administrative division hierarchy: District → Sector → Cell → Village

#### District

```prisma
model District {
  id          Int                  @id @default(autoincrement())
  name        String               @unique
  sectors     Sector[]
  directories DirectoryLocation[]
}
```

**Examples:** Kigali, Musanze, Rubavu, Huye

#### Sector

```prisma
model Sector {
  id          Int                  @id @default(autoincrement())
  name        String
  district    District             @relation(fields: [districtId], references: [id])
  districtId  Int
  cells       Cell[]
  directories DirectoryLocation[]
}
```

#### Cell

```prisma
model Cell {
  id          Int                  @id @default(autoincrement())
  name        String
  sector      Sector               @relation(fields: [sectorId], references: [id])
  sectorId    Int
  villages    Village[]
  directories DirectoryLocation[]
}
```

#### Village

```prisma
model Village {
  id          Int                  @id @default(autoincrement())
  name        String
  cell        Cell                 @relation(fields: [cellId], references: [id])
  cellId      Int
  directories DirectoryLocation[]
}
```

### Junction Tables

#### DirectoryService

Links directories to service types (many-to-many).

```prisma
model DirectoryService {
  id          Int         @id @default(autoincrement())
  directory   Directory   @relation(fields: [directoryId], references: [id])
  directoryId Int
  service     ServiceType @relation(fields: [serviceId], references: [id])
  serviceId   Int
}
```

#### DirectoryBeneficiary

Links directories to beneficiary types (many-to-many).

```prisma
model DirectoryBeneficiary {
  id            Int             @id @default(autoincrement())
  directory     Directory       @relation(fields: [directoryId], references: [id])
  directoryId   Int
  beneficiary   BeneficiaryType @relation(fields: [beneficiaryId], references: [id])
  beneficiaryId Int
}
```

#### DirectoryLocation

Links directories to specific locations.

```prisma
model DirectoryLocation {
  id          Int       @id @default(autoincrement())
  directory   Directory @relation(fields: [directoryId], references: [id])
  directoryId Int
  district    District  @relation(fields: [districtId], references: [id])
  districtId  Int
  sector      Sector    @relation(fields: [sectorId], references: [id])
  sectorId    Int
  cell        Cell      @relation(fields: [cellId], references: [id])
  cellId      Int
  village     Village   @relation(fields: [villageId], references: [id])
  villageId   Int
}
```

**Note:** A directory can operate in multiple locations.

## Relationships

### One-to-Many Relationships

1. **User → Directory**
   - One user can create many directories
   - Each directory has one creator

2. **District → Sector**
   - One district has many sectors
   - Each sector belongs to one district

3. **Sector → Cell**
   - One sector has many cells
   - Each cell belongs to one sector

4. **Cell → Village**
   - One cell has many villages
   - Each village belongs to one cell

### Many-to-Many Relationships

1. **Directory ↔ ServiceType**
   - One directory can offer multiple services
   - One service type can be offered by multiple directories
   - Junction: DirectoryService

2. **Directory ↔ BeneficiaryType**
   - One directory can serve multiple beneficiary types
   - One beneficiary type can be served by multiple directories
   - Junction: DirectoryBeneficiary

3. **Directory ↔ Location** (Complex)
   - One directory can operate in multiple locations
   - Each location reference includes district, sector, cell, and village
   - Junction: DirectoryLocation

## Indexes and Constraints

### Primary Keys

All tables have auto-incrementing integer primary keys (`id`).

### Unique Constraints

- `User.email` - Email must be unique
- `ServiceType.name` - Service type names must be unique
- `BeneficiaryType.name` - Beneficiary type names must be unique
- `District.name` - District names must be unique

### Foreign Keys

All relations have foreign key constraints with cascade behavior:
- `Directory.createdById` → `User.id`
- `DirectoryService.directoryId` → `Directory.id`
- `DirectoryService.serviceId` → `ServiceType.id`
- And so on for all relationships

### Recommended Indexes (for Performance)

```sql
-- User lookups
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role);

-- Directory searches
CREATE INDEX idx_directory_category ON "Directory"(category);
CREATE INDEX idx_directory_creator ON "Directory"("createdById");

-- Location lookups
CREATE INDEX idx_sector_district ON "Sector"("districtId");
CREATE INDEX idx_cell_sector ON "Cell"("sectorId");
CREATE INDEX idx_village_cell ON "Village"("cellId");

-- Junction table lookups
CREATE INDEX idx_dir_service_dir ON "DirectoryService"("directoryId");
CREATE INDEX idx_dir_service_svc ON "DirectoryService"("serviceId");
CREATE INDEX idx_dir_ben_dir ON "DirectoryBeneficiary"("directoryId");
CREATE INDEX idx_dir_ben_ben ON "DirectoryBeneficiary"("beneficiaryId");
CREATE INDEX idx_dir_loc_dir ON "DirectoryLocation"("directoryId");
CREATE INDEX idx_dir_loc_dist ON "DirectoryLocation"("districtId");
```

## Common Queries

### Get All Directories with Related Data

```typescript
const directories = await prisma.directory.findMany({
  include: {
    services: {
      include: {
        service: true
      }
    },
    beneficiaries: {
      include: {
        beneficiary: true
      }
    },
    locations: {
      include: {
        district: true,
        sector: true,
        cell: true,
        village: true
      }
    },
    createdBy: {
      select: {
        id: true,
        name: true,
        email: true
      }
    }
  }
})
```

### Get Directories by Location

```typescript
const directories = await prisma.directory.findMany({
  where: {
    locations: {
      some: {
        districtId: districtId,
        sectorId: sectorId // optional
      }
    }
  },
  include: {
    services: { include: { service: true } },
    locations: {
      include: {
        district: true,
        sector: true,
        cell: true,
        village: true
      }
    }
  }
})
```

### Get Directories by Service Type

```typescript
const directories = await prisma.directory.findMany({
  where: {
    services: {
      some: {
        serviceId: serviceTypeId
      }
    }
  },
  include: {
    services: { include: { service: true } }
  }
})
```

### Get User's Directories

```typescript
const directories = await prisma.directory.findMany({
  where: {
    createdById: userId
  },
  include: {
    services: { include: { service: true } },
    beneficiaries: { include: { beneficiary: true } }
  }
})
```

### Create Directory with Relations

```typescript
const directory = await prisma.directory.create({
  data: {
    nameOfOrganization: "Organization Name",
    category: "NON_GOVERNMENTAL",
    email: "contact@org.com",
    phone: "+250788123456",
    paid: false,
    createdById: userId,
    
    // Add services
    services: {
      create: serviceTypeIds.map(id => ({
        service: { connect: { id } }
      }))
    },
    
    // Add beneficiaries
    beneficiaries: {
      create: beneficiaryTypeIds.map(id => ({
        beneficiary: { connect: { id } }
      }))
    },
    
    // Add locations
    locations: {
      create: locations.map(loc => ({
        district: { connect: { id: loc.districtId } },
        sector: { connect: { id: loc.sectorId } },
        cell: { connect: { id: loc.cellId } },
        village: { connect: { id: loc.villageId } }
      }))
    }
  },
  include: {
    services: { include: { service: true } },
    beneficiaries: { include: { beneficiary: true } },
    locations: {
      include: {
        district: true,
        sector: true,
        cell: true,
        village: true
      }
    }
  }
})
```

### Search Directories

```typescript
const directories = await prisma.directory.findMany({
  where: {
    OR: [
      { nameOfOrganization: { contains: searchQuery, mode: 'insensitive' } },
      { email: { contains: searchQuery, mode: 'insensitive' } },
      { phone: { contains: searchQuery } }
    ]
  }
})
```

### Get Location Hierarchy

```typescript
// Get sectors by district
const sectors = await prisma.sector.findMany({
  where: { districtId: districtId }
})

// Get cells by sector
const cells = await prisma.cell.findMany({
  where: { sectorId: sectorId }
})

// Get villages by cell
const villages = await prisma.village.findMany({
  where: { cellId: cellId }
})
```

## Migrations

### Creating a Migration

```bash
# After modifying schema.prisma
npx prisma migrate dev --name description_of_change
```

### Applying Migrations

```bash
# Development
npx prisma migrate dev

# Production
npx prisma migrate deploy
```

### Migration Best Practices

1. **Always backup before migrations in production**
2. **Test migrations in staging first**
3. **Use descriptive migration names**
4. **Review generated SQL before applying**
5. **Never edit migration files manually**

### Reverting Migrations

If a migration fails:

```bash
# Restore from backup
psql -U username -d database_name < backup.sql

# Or reset database (DEVELOPMENT ONLY)
npx prisma migrate reset
```

## Seeding

The seed script (`prisma/seed.cjs`) populates:

### 1. Location Data

All Rwanda administrative divisions (from `prisma/data/locations.json`):
- 30 Districts
- 416 Sectors
- 2,148 Cells
- 14,837 Villages

### 2. Service Types

Predefined service categories:
- Counseling Services
- Medical Care
- Legal Support
- Education Support
- Shelter and Housing
- And more...

### 3. Beneficiary Types

Target beneficiary categories:
- Children (various age groups)
- Orphans
- Street children
- Children with disabilities
- And more...

### 4. Sample Data (Optional)

- Admin user
- Sample directories

### Running the Seed

```bash
npm run prisma:seed
```

### Custom Seeding

Add to `prisma/seed.cjs`:

```javascript
async function main() {
  // Your custom seed logic
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      // ...
    }
  })
}
```

## Backup and Restore

### Backup Database

```bash
# Full backup
pg_dump -U username -d database_name > backup.sql

# Compressed backup
pg_dump -U username -d database_name | gzip > backup_$(date +%Y%m%d).sql.gz

# Schema only
pg_dump -U username -d database_name --schema-only > schema.sql

# Data only
pg_dump -U username -d database_name --data-only > data.sql
```

### Restore Database

```bash
# Restore from backup
psql -U username -d database_name < backup.sql

# Restore from compressed backup
gunzip < backup.sql.gz | psql -U username -d database_name
```

### Automated Backups

Create a cron job for daily backups:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * pg_dump -U username database_name | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz
```

## Database Maintenance

### Vacuum and Analyze

```sql
-- Regular maintenance
VACUUM ANALYZE;

-- Full vacuum (requires exclusive lock)
VACUUM FULL;

-- Analyze only
ANALYZE;
```

### Check Database Size

```sql
-- Database size
SELECT pg_size_pretty(pg_database_size('database_name'));

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Connection Monitoring

```sql
-- Active connections
SELECT * FROM pg_stat_activity WHERE datname = 'database_name';

-- Kill idle connections
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'database_name' 
  AND state = 'idle' 
  AND state_change < NOW() - INTERVAL '1 hour';
```

## Performance Optimization

### Query Optimization Tips

1. Use indexes appropriately
2. Use `select` to limit returned fields
3. Use pagination for large datasets
4. Use database-level filtering instead of application-level
5. Use connection pooling (PgBouncer)
6. Monitor slow queries

### Prisma Performance

```typescript
// Good: Select only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
  }
})

// Good: Use pagination
const directories = await prisma.directory.findMany({
  take: 20,
  skip: page * 20
})

// Good: Use appropriate includes
const directory = await prisma.directory.findUnique({
  where: { id },
  include: {
    services: { include: { service: true } }
    // Only include what you need
  }
})
```

## Troubleshooting

### Common Issues

**Connection refused:**
- Check if PostgreSQL is running
- Verify connection string
- Check firewall rules

**Migration failed:**
- Review error message
- Check for data conflicts
- Restore from backup if needed

**Slow queries:**
- Use `EXPLAIN ANALYZE` to diagnose
- Add appropriate indexes
- Optimize query structure

**Out of connections:**
- Implement connection pooling
- Close unused connections
- Increase max_connections in PostgreSQL

---

**Last Updated**: October 2025  
**Database Version**: PostgreSQL 14+  
**Prisma Version**: 6.x


