# First Farmer Agriculture System

> **"Learn Agriculture. Grow Knowledge. Discover Value."**

A complete, responsive, multilingual full-stack web application designed for students, beginners, and agricultural enthusiasts to understand the complete agricultural journey—from crop suitability and cultivation practices to pest management, harvesting maturity, and high-value post-harvest commercial processing.

---

## 1. System Features & Highlights

- **Multilingual Support**: Real-time interface localization in **English**, **தமிழ் (Tamil)**, and **हिन्दी (Hindi)**.
- **Crop Recommendation Engine**: Transparent, rule-based agronomic suitability matching based on soil type, season, water availability, and agro-climatic region with detailed score breakdowns.
- **Comprehensive Crop Library**: Over 10 major crops with reviewed educational data:
  - Rice (*Oryza sativa*), Wheat (*Triticum aestivum*), Maize (*Zea mays*), Tomato (*Solanum lycopersicum*), Cotton (*Gossypium hirsutum*), Banana (*Musa acuminata*), Sugarcane (*Saccharum officinarum*), Groundnut (*Arachis hypogaea*), Finger Millet/Ragi (*Eleusine coracana*), and Chickpea/Bengal Gram (*Cicer arietinum*).
- **Interactive Cultivation Guides**: In-depth instructions covering land tilth, seed treatment, planting method, irrigation schedules, fertilizer management, weed control, and physiological growth stages.
- **Pest & Disease Health Explorer**: Integrated Pest Management (IPM) guidelines with visual symptom indicators, contributing environmental triggers, and verified university extension citations.
- **Harvesting Protocols**: Crop-specific biological maturity indicators, reaping techniques, and field-loss prevention precautions.
- **Post-Harvest & Value Addition**: Detailed processing guides, storage protocols, food uses, industrial by-products, and consumer packaged products (e.g., Tomato Puree, Cold-Pressed Rice Bran Oil, Crispy Banana Chips, Cold-Pressed Groundnut Oil, Organic Sugarcane Jaggery, Sprouted Ragi Malt, Stone-Ground Besan).
- **Agro-Weather Advisories**: Real-time agro-meteorological advisories connecting temperature, humidity, wind velocity, and rainfall to farm operations, with honest educational simulation fallback when live API keys are not configured.
- **Agricultural Chatbot**: Retrieval-based learning chatbot grounded in verified agricultural records with direct links to relevant learning pages.
- **Student Learning Progress**: Persistent bookmarks, module completion tracking, and interactive dashboard activity charts.
- **Role-Based Admin Panel**: Secure administrative area for managing crop profiles, guides, and reviewing user activity with server-side authorization enforcement.

---

## 2. Technology Stack

- **Frontend**:
  - React 18 with Vite
  - TypeScript
  - Tailwind CSS with Forest Green design tokens (`#1F5135`, `#2E7D4F`, `#6E9F78`, `#EEF5EE`, `#F7F9F5`)
  - React Router v6
  - Lucide React Icons
  - Recharts for progress and dashboard analytics
- **Backend**:
  - Python 3.12 with FastAPI
  - Pydantic v2 for request validation and schema modeling
  - SQLAlchemy 2.0 ORM with declarative models
  - RESTful architecture with OpenAPI/Swagger documentation
- **Database**:
  - MySQL 8.0 support with connection pooling
  - Automatic SQLite fallback (`sqlite:///./first_farmer.db`) with foreign key enforcement
- **Authentication & Security**:
  - BCrypt password hashing with 12 rounds of random salt
  - HS256 JWT tokens with role-based access control (Student vs Administrator)
  - Input validation on both client and server

---

## 3. Prerequisites & Installation

### Required Software
- **Python**: Version 3.10+ (tested on Python 3.12)
- **Node.js**: Version 18+ LTS (tested on Node.js v24 LTS)
- **Database**: MySQL 8.0 (Optional: SQLite is enabled by default for zero-setup local execution)

---

## 4. Quick Start (Local Development)

### Step 1: Install Backend Dependencies
```bash
cd backend
python -m pip install -r requirements.txt
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` in the `backend/` directory:
```bash
cp .env.example .env
```
Default configuration inside `backend/.env`:
```env
PROJECT_NAME="First Farmer Agriculture System"
SECRET_KEY="first_farmer_super_secret_development_key_for_jwt_2026"
DATABASE_URL="sqlite:///./first_farmer.db"
BACKEND_CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
OPENWEATHER_API_KEY=""
```

### Step 3: Seed Database with Agricultural Data
Run the database seed script to populate 10 crops, complete agronomic guides, pest records, products, and default accounts:
```bash
python seed.py
```

### Step 4: Build Frontend
```bash
cd ../frontend
npm install
npm run build
```

### Step 5: Start Backend Application
```bash
cd ../backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Open your browser at **`http://localhost:8000`** to access the complete application!
*(The FastAPI server serves both the REST API at `/api` and the React frontend SPA at `/`).*

Alternatively, for active frontend development with Hot Module Replacement (HMR):
```bash
cd frontend
npm run dev
```
Open **`http://localhost:5173`**.

---

## 5. Development Test Credentials

The database seed script generates two pre-configured development accounts:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@firstfarmer.org` | `Admin@123` | Full access to Admin Panel, Crop CRUD, and Stats |
| **Student / Farmer** | `student@firstfarmer.org` | `Student@123` | Standard access to Bookmarks, Progress Tracking, and Chatbot |

*(You can also use the "Student Demo" and "Admin Demo" quick-fill buttons on the login screen).*

---

## 6. Configuring MySQL 8 (Optional)

If you have MySQL 8 installed locally or in production:

1. Create a MySQL database and user:
   ```sql
   CREATE DATABASE first_farmer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'firstfarmer_user'@'localhost' IDENTIFIED BY 'securepassword123';
   GRANT ALL PRIVILEGES ON first_farmer_db.* TO 'firstfarmer_user'@'localhost';
   FLUSH PRIVILEGES;
   ```
2. Update `backend/.env`:
   ```env
   DATABASE_URL="mysql+pymysql://firstfarmer_user:securepassword123@localhost:3306/first_farmer_db"
   ```
3. Run the database seed script:
   ```bash
   cd backend
   python seed.py
   ```

---

## 7. Docker Compose Deployment

To run the entire full-stack system using Docker Compose:
```bash
docker-compose up --build
```
This starts:
- MySQL 8.0 on port `3306` with persistent volume storage
- FastAPI Backend & Frontend SPA on port `8000`

---

## 8. Automated Testing

To run the automated backend test suite covering authentication, crop listing, recommendations, bookmarks, learning progress, and chatbot responses:
```bash
cd backend
python -m pytest tests/
```
All 17 automated tests pass with clean test isolation.

---

## 9. Configuring External APIs

### OpenWeather API (Weather Advisories)
1. Register for an API key at [OpenWeatherMap](https://openweathermap.org/api).
2. Set the key in `backend/.env`:
   ```env
   OPENWEATHER_API_KEY="your_actual_api_key_here"
   ```
3. Restart the backend. The weather page will automatically switch from educational simulation to live satellite weather data.

### Optional AI Provider (Chatbot)
1. By default, the chatbot uses verified database retrieval with zero external dependencies.
2. To connect an optional LLM provider (e.g. Gemini or OpenAI), configure `AI_API_KEY` and `AI_PROVIDER` in `backend/.env`.

---

## 10. Educational Disclaimer

First Farmer Agriculture System is an educational and assistive platform. Agricultural recommendations are based on published agronomic research (ICAR, SAUs) and preliminary agro-climatic matching. Farmers and learners should always verify soil nutrient profiles through certified soil testing laboratories and consult local Krishi Vigyan Kendra (KVK) officers before commercial planting.
