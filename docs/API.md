# API Documentation

Complete API reference for the Child Protection Services Directory platform.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Most endpoints require authentication. Include the session cookie in requests or use NextAuth.js session.

### Headers

```
Content-Type: application/json
Cookie: next-auth.session-token=<token>
```

## Error Responses

All endpoints follow a consistent error format:

```json
{
  "error": "Error message description",
  "details": "Optional additional details"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication Endpoints

### Login

```http
POST /api/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "ADMIN"
  },
  "token": "jwt-token-here"
}
```

### Logout

```http
POST /api/logout
```

**Authentication Required**: Yes

---

## User Management

### List All Users

```http
GET /api/users
```

**Authentication Required**: Yes (Admin only)

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+250788123456",
      "idNumber": "1234567890123456",
      "role": "ADMIN",
      "emailVerified": true,
      "disabled": false,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Invite User

```http
POST /api/users/invite
```

**Authentication Required**: Yes (Admin only)

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+250788123456",
  "idNumber": "1234567890123456",
  "role": "ENUMERATOR"
}
```

**Response:**
```json
{
  "user": {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "ENUMERATOR",
    "emailVerified": false
  },
  "message": "Invitation sent successfully"
}
```

### Get User Details

```http
GET /api/users/[id]
```

**Authentication Required**: Yes (Admin only)

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+250788123456",
  "idNumber": "1234567890123456",
  "role": "ADMIN",
  "emailVerified": true,
  "disabled": false,
  "directories": [...]
}
```

### Update User

```http
PUT /api/users/[id]
```

**Authentication Required**: Yes (Admin only)

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+250788999999",
  "role": "ENUMERATOR",
  "disabled": false
}
```

### Delete User

```http
DELETE /api/users/[id]
```

**Authentication Required**: Yes (Admin only)

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

### Resend Activation Email

```http
POST /api/users/[id]/resend
```

**Authentication Required**: Yes (Admin only)

**Response:**
```json
{
  "message": "Activation email sent successfully"
}
```

### Activate User Account

```http
POST /api/users/activate
```

**Request Body:**
```json
{
  "token": "activation-token-from-email",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Account activated successfully"
}
```

### Change Password

```http
POST /api/users/change-password
```

**Authentication Required**: Yes

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## Directory Management

### List Directories

```http
GET /api/directories
```

**Query Parameters:**
- `district` (optional) - Filter by district ID
- `service` (optional) - Filter by service type ID
- `beneficiary` (optional) - Filter by beneficiary type ID

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
      "otherServices": "Additional services",
      "services": [
        {
          "id": 1,
          "service": {
            "id": 1,
            "name": "Counseling"
          }
        }
      ],
      "beneficiaries": [
        {
          "id": 1,
          "beneficiary": {
            "id": 1,
            "name": "Children 0-5 years"
          }
        }
      ],
      "locations": [
        {
          "id": 1,
          "district": { "id": 1, "name": "Kigali" },
          "sector": { "id": 1, "name": "Gasabo" },
          "cell": { "id": 1, "name": "Kacyiru" },
          "village": { "id": 1, "name": "Kamatamu" }
        }
      ],
      "createdBy": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com"
      }
    }
  ]
}
```

### Create Directory

```http
POST /api/directories
```

**Authentication Required**: Yes

**Request Body:**
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

**Validation Rules:**
- `nameOfOrganization`: Required, string
- `category`: Required, one of: GOVERNMENT, NON_GOVERNMENTAL, COMMUNITY_BASED
- `email`: Required, valid email format
- `phone`: Required, string
- `website`: Optional, valid URL
- `paid`: Required, boolean
- `serviceTypeIds`: Optional, array of valid service type IDs
- `beneficiaryTypeIds`: Optional, array of valid beneficiary type IDs
- `locations`: Optional, array of location objects

### Get Directory Details

```http
GET /api/directories/[id]
```

**Response:** Same structure as single directory in list response

### Update Directory

```http
PUT /api/directories/[id]
```

**Authentication Required**: Yes (Owner or Admin)

**Request Body:** Same as Create Directory

### Delete Directory

```http
DELETE /api/directories/[id]
```

**Authentication Required**: Yes (Owner or Admin)

**Response:**
```json
{
  "message": "Directory deleted successfully"
}
```

---

## Service Type Management

### List Service Types

```http
GET /api/service-types
```

**Response:**
```json
{
  "types": [
    {
      "id": 1,
      "name": "Counseling"
    },
    {
      "id": 2,
      "name": "Medical Care"
    }
  ]
}
```

### Create Service Type

```http
POST /api/service-types
```

**Authentication Required**: Yes (Admin only)

**Request Body:**
```json
{
  "name": "New Service Type"
}
```

### Update Service Type

```http
PUT /api/service-types/[id]
```

**Authentication Required**: Yes (Admin only)

**Request Body:**
```json
{
  "name": "Updated Service Type"
}
```

### Delete Service Type

```http
DELETE /api/service-types/[id]
```

**Authentication Required**: Yes (Admin only)

---

## Beneficiary Type Management

### List Beneficiary Types

```http
GET /api/beneficiary-types
```

**Response:**
```json
{
  "types": [
    {
      "id": 1,
      "name": "Children 0-5 years",
      "description": "Early childhood services"
    }
  ]
}
```

### Create Beneficiary Type

```http
POST /api/beneficiary-types
```

**Authentication Required**: Yes (Admin only)

**Request Body:**
```json
{
  "name": "New Beneficiary Type",
  "description": "Optional description"
}
```

### Update Beneficiary Type

```http
PUT /api/beneficiary-types/[id]
```

**Authentication Required**: Yes (Admin only)

**Request Body:**
```json
{
  "name": "Updated Beneficiary Type",
  "description": "Updated description"
}
```

### Delete Beneficiary Type

```http
DELETE /api/beneficiary-types/[id]
```

**Authentication Required**: Yes (Admin only)

---

## Location Endpoints

### List Districts

```http
GET /api/districts
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Kigali"
  },
  {
    "id": 2,
    "name": "Musanze"
  }
]
```

### List Sectors by District

```http
GET /api/sectors/[districtId]
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Gasabo",
    "districtId": 1
  }
]
```

### List Cells by Sector

```http
GET /api/cells/[sectorId]
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Kacyiru",
    "sectorId": 1
  }
]
```

### List Villages by Cell

```http
GET /api/villages/[cellId]
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Kamatamu",
    "cellId": 1
  }
]
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production:

- **Authenticated requests**: 100 requests per 15 minutes
- **Public endpoints**: 50 requests per 15 minutes

---

## Webhooks

Webhooks are not currently implemented but could be added for:

- User registration events
- Directory creation/updates
- Admin notifications

---

## SDK / Client Libraries

Currently, no official SDK is available. Consider creating client libraries for:

- JavaScript/TypeScript
- Python
- Mobile (React Native, Flutter)

---

## Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Get directories
curl http://localhost:3000/api/directories \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

### Using Postman

1. Import the API endpoints
2. Set up environment variables
3. Use collection for automated testing

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new collection
3. Add requests with authentication

---

## Changelog

### Version 0.1.0 (Current)

- Initial API release
- User management endpoints
- Directory CRUD operations
- Service and beneficiary type management
- Location endpoints

### Planned Features

- API versioning (v2)
- Pagination support
- Advanced filtering
- Bulk operations
- File upload endpoints
- Statistics and analytics endpoints

---

## Support

For API support:
- Contact the Fine Africa team
- Check the main README.md

**Last Updated**: October 2025


