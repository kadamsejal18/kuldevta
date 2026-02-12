# API Documentation

Complete API reference for Kuldevta Estate Agency.

Base URL: `https://your-backend-url.com/api`

---

## Authentication

All admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### POST /auth/login

Admin login

**Request Body:**
```json
{
  "email": "admin@kuldevta.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@kuldevta.com",
    "name": "Admin",
    "role": "admin"
  }
}
```

### GET /auth/me

Get current admin details (requires auth)

**Response:**
```json
{
  "success": true,
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@kuldevta.com",
    "name": "Admin",
    "role": "admin",
    "lastLogin": "2026-02-10T12:00:00.000Z"
  }
}
```

### POST /auth/create-admin

Create initial admin (one-time only)

**Request Body:**
```json
{
  "email": "admin@kuldevta.com",
  "password": "secure_password",
  "name": "Admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@kuldevta.com",
    "name": "Admin"
  }
}
```

---

## Properties (Public)

### GET /properties

Get all active properties with pagination and filters

**Query Parameters:**
- `city` (string): Filter by city
- `type` (string): `rent` or `buy`
- `category` (string): `1BHK`, `2BHK`, `3BHK`, `4BHK`, `Villa`, `Plot`, etc.
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `featured` (boolean): Filter featured properties
- `search` (string): Search in title, description, city
- `page` (number, default: 1): Page number
- `limit` (number, default: 12): Items per page
- `sort` (string, default: -createdAt): Sort field

**Example:**
```
GET /properties?city=Mumbai&type=rent&page=1&limit=12
```

**Response:**
```json
{
  "success": true,
  "count": 12,
  "total": 45,
  "pages": 4,
  "currentPage": 1,
  "properties": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Luxurious 3BHK Apartment",
      "description": "Beautiful apartment with modern amenities",
      "city": "Mumbai",
      "price": 50000,
      "type": "rent",
      "category": "3BHK",
      "images": [
        {
          "url": "https://res.cloudinary.com/...",
          "publicId": "kuldevta/properties/xyz123"
        }
      ],
      "videos": [],
      "featured": true,
      "advertised": false,
      "views": 125,
      "active": true,
      "createdAt": "2026-02-01T10:00:00.000Z",
      "updatedAt": "2026-02-10T15:30:00.000Z"
    }
  ]
}
```

### GET /properties/:id

Get single property by ID

**Response:**
```json
{
  "success": true,
  "property": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Luxurious 3BHK Apartment",
    "description": "Beautiful apartment...",
    "city": "Mumbai",
    "price": 50000,
    "type": "rent",
    "category": "3BHK",
    "images": [...],
    "videos": [...],
    "featured": true,
    "views": 125,
    "active": true,
    "area": 1200,
    "bedrooms": 3,
    "bathrooms": 2,
    "address": "Andheri West, Mumbai",
    "amenities": ["Parking", "Gym", "Swimming Pool"],
    "contact": {
      "name": "Kuldevta Estate",
      "phone": "9930388219",
      "email": "contact@kuldevta.com"
    }
  }
}
```

### PUT /properties/:id/view

Increment property view count

**Response:**
```json
{
  "success": true,
  "views": 126
}
```

### GET /properties/trending

Get trending properties (most viewed)

**Query Parameters:**
- `limit` (number, default: 6): Number of properties

**Response:**
```json
{
  "success": true,
  "count": 6,
  "properties": [...]
}
```

### GET /properties/featured

Get featured properties

**Query Parameters:**
- `limit` (number, default: 6): Number of properties

**Response:**
```json
{
  "success": true,
  "count": 6,
  "properties": [...]
}
```

### GET /properties/advertisements

Get active advertisements

**Response:**
```json
{
  "success": true,
  "count": 3,
  "properties": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Featured Property",
      "advertised": true,
      "adStartDate": "2026-02-01T00:00:00.000Z",
      "adEndDate": "2026-02-28T23:59:59.000Z",
      ...
    }
  ]
}
```

---

## Properties (Admin)

All endpoints require authentication.

### POST /properties

Create new property

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `title` (string, required)
- `description` (string, required)
- `city` (string, required)
- `price` (number, required)
- `type` (string, required): `rent` or `buy`
- `category` (string, required)
- `featured` (boolean, default: false)
- `advertised` (boolean, default: false)
- `adStartDate` (date, optional)
- `adEndDate` (date, optional)
- `active` (boolean, default: true)
- `area` (number, optional)
- `bedrooms` (number, optional)
- `bathrooms` (number, optional)
- `address` (string, optional)
- `amenities` (array, optional)
- `images` (files, max 20)
- `videos` (files, max 5)

**Response:**
```json
{
  "success": true,
  "property": {...}
}
```

### PUT /properties/:id

Update property

**Content-Type:** `multipart/form-data`

Same fields as create. New images/videos are added to existing ones.

**Response:**
```json
{
  "success": true,
  "property": {...}
}
```

### DELETE /properties/:id

Delete property and all associated media

**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

### DELETE /properties/:id/images/:publicId

Delete specific image from property

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "property": {...}
}
```

### PUT /properties/:id/featured

Toggle property featured status

**Response:**
```json
{
  "success": true,
  "property": {...}
}
```

### PUT /properties/:id/active

Toggle property active/hidden status

**Response:**
```json
{
  "success": true,
  "property": {...}
}
```

### GET /properties/admin/all

Get all properties for admin (including inactive)

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `sort` (string, default: -createdAt)
- `active` (boolean, optional)
- `featured` (boolean, optional)
- `advertised` (boolean, optional)

**Response:**
```json
{
  "success": true,
  "count": 20,
  "total": 45,
  "pages": 3,
  "currentPage": 1,
  "properties": [...]
}
```

---

## Leads

### POST /leads

Create new lead (public)

**Request Body:**
```json
{
  "property": "507f1f77bcf86cd799439011",
  "phone": "9876543210",
  "email": "user@example.com",
  "name": "John Doe",
  "message": "I'm interested in this property",
  "source": "gallery"
}
```

**Response:**
```json
{
  "success": true,
  "lead": {
    "_id": "507f1f77bcf86cd799439012",
    "property": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Luxurious 3BHK Apartment",
      "city": "Mumbai",
      "price": 50000,
      "type": "rent",
      "category": "3BHK"
    },
    "phone": "9876543210",
    "email": "user@example.com",
    "name": "John Doe",
    "message": "I'm interested in this property",
    "status": "new",
    "source": "gallery",
    "createdAt": "2026-02-10T16:00:00.000Z"
  }
}
```

### GET /leads (Admin)

Get all leads

**Query Parameters:**
- `property` (string): Filter by property ID
- `status` (string): `new`, `contacted`, `interested`, `not-interested`, `closed`
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `sort` (string, default: -createdAt)

**Response:**
```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "pages": 8,
  "currentPage": 1,
  "leads": [...]
}
```

### GET /leads/property/:propertyId (Admin)

Get all leads for specific property

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `sort` (string, default: -createdAt)

**Response:**
```json
{
  "success": true,
  "count": 15,
  "total": 15,
  "pages": 1,
  "currentPage": 1,
  "leads": [...]
}
```

### PUT /leads/:id (Admin)

Update lead status

**Request Body:**
```json
{
  "status": "contacted"
}
```

**Response:**
```json
{
  "success": true,
  "lead": {...}
}
```

### DELETE /leads/:id (Admin)

Delete lead

**Response:**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

### GET /leads/stats (Admin)

Get lead statistics

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 150,
    "new": 45,
    "contacted": 60,
    "interested": 30,
    "closed": 15,
    "byProperty": [
      {
        "propertyId": "507f1f77bcf86cd799439011",
        "propertyTitle": "Luxurious 3BHK Apartment",
        "count": 25
      }
    ]
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common Status Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Response when exceeded:**
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

---

## File Upload Limits

- **Images:** Max 20 per property, 50MB each
- **Videos:** Max 5 per property, 50MB each
- **Supported formats:**
  - Images: JPEG, JPG, PNG, GIF, WebP
  - Videos: MP4, MOV, AVI, MKV

---

## Examples

### Using JavaScript Fetch

```javascript
// Public: Get properties
fetch('https://your-api.com/api/properties?city=Mumbai')
  .then(res => res.json())
  .then(data => console.log(data));

// Admin: Login
fetch('https://your-api.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@kuldevta.com',
    password: 'password'
  })
})
.then(res => res.json())
.then(data => {
  localStorage.setItem('token', data.token);
});

// Admin: Create property
const formData = new FormData();
formData.append('title', 'New Property');
formData.append('description', 'Description here');
formData.append('city', 'Mumbai');
formData.append('price', 50000);
formData.append('type', 'rent');
formData.append('category', '3BHK');
formData.append('images', imageFile1);
formData.append('images', imageFile2);

fetch('https://your-api.com/api/properties', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

### Using cURL

```bash
# Get properties
curl https://your-api.com/api/properties

# Admin login
curl -X POST https://your-api.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kuldevta.com","password":"password"}'

# Toggle featured (with auth)
curl -X PUT https://your-api.com/api/properties/507f1f77bcf86cd799439011/featured \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## WebSocket (Future Enhancement)

Real-time updates for:
- New leads notification
- Property view counts
- Admin actions sync

*Coming soon in v2.0*
