# REST API Reference Guide

## First Farmer Agriculture System

The backend is built using FastAPI with interactive Swagger UI available at `/api/docs` and ReDoc at `/api/redoc`.

### Base URL: `/api`

### 1. Authentication (`/api/auth`)

#### `POST /api/auth/register`
Creates a new student account.
- **Request Body**:
  ```json
  {
    "full_name": "Kisan Vidyarthi",
    "email": "kisan@example.com",
    "password": "SecurePassword123",
    "confirm_password": "SecurePassword123",
    "preferred_language": "en"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": { "id": 1, "full_name": "Kisan Vidyarthi", "email": "kisan@example.com", "role": "student" }
  }
  ```

#### `POST /api/auth/login`
Authenticates user and returns JWT bearer token.
- **Request Body**: `{"email": "...", "password": "..."}`
- **Response** (200 OK): Returns JWT access token and user object.

#### `GET /api/auth/me`
*Requires `Authorization: Bearer <token>`*
Returns current user profile.

#### `PUT /api/auth/me`
*Requires `Authorization: Bearer <token>`*
Updates user's name or preferred language.

#### `POST /api/auth/change-password`
*Requires `Authorization: Bearer <token>`*
Updates user password with old password verification.

---

### 2. Crops (`/api/crops`)

#### `GET /api/crops`
List published crops with query filters:
- `search` (string)
- `category` ('Cereal', 'Vegetable', 'Fruit', 'Cash Crop', 'Pulse', 'Millet')
- `season` ('Kharif', 'Rabi', 'Zaid', 'Year-round')
- `soil` ('Clay', 'Loamy', 'Black soil', etc.)
- `sort` ('asc' or 'desc')

#### `GET /api/crops/{crop_id}`
Returns complete crop profile including nested cultivation guide, pests, harvesting guide, post-harvest guide, and products.

#### `POST /api/crops` *(Admin Only)*
Creates a new crop record.

#### `PUT /api/crops/{crop_id}` *(Admin Only)*
Updates existing crop record.

#### `DELETE /api/crops/{crop_id}` *(Admin Only)*
Deletes crop record and cascades to guides.

---

### 3. Crop Recommendations (`/api/recommendations`)

#### `POST /api/recommendations`
Evaluates crops against input conditions:
- **Request Body**:
  ```json
  {
    "region": "South India",
    "soil_type": "Clay",
    "season": "Kharif",
    "water_availability": "High",
    "temperature": 28.5,
    "rainfall": 950.0,
    "preferred_category": "All"
  }
  ```
- **Response**: List of matching crops with score (0-100), match level, matched criteria list, unmet criteria, explanation, and educational disclaimer.

---

### 4. Searchable Guides (`/api/...`)

- `GET /api/crops/{crop_id}/cultivation`: Specific cultivation instructions.
- `GET /api/crops/{crop_id}/pests-diseases`: Specific crop pests & diseases.
- `GET /api/pests-diseases`: Searchable cross-crop pest and disease database.
- `GET /api/crops/{crop_id}/harvest`: Harvesting guide.
- `GET /api/crops/{crop_id}/post-harvest`: Post-harvest handling & storage.
- `GET /api/crops/{crop_id}/products`: Value-added products list.
- `GET /api/products`: Searchable cross-crop products library.

---

### 5. Bookmarks & Learning Progress

- `GET /api/bookmarks`: Get user's saved crops.
- `POST /api/bookmarks/{crop_id}`: Bookmark a crop.
- `DELETE /api/bookmarks/{crop_id}`: Remove bookmark.
- `GET /api/progress`: List user learning module progress.
- `POST /api/progress`: Record or update module completion.
- `GET /api/progress/stats`: Overview dashboard statistics.

---

### 6. Weather (`/api/weather`)

- `GET /api/weather?location=Coimbatore`
Fetches current conditions, wind, humidity, agricultural advisory, and 5-step forecast. If live key is not set, returns clearly labeled educational sample data.

---

### 7. Agriculture Chatbot (`/api/chat`)

- `POST /api/chat`:
  - Request: `{"message": "How do I cultivate Rice?", "language": "en"}`
  - Response: Grounded response from verified database with related links and source attribution.
