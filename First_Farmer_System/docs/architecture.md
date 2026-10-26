# System Architecture & Technical Specifications

## First Farmer Agriculture System

### 1. High-Level Architecture Overview

The First Farmer Agriculture System is structured as a modern, decoupled client-server web application adhering to RESTful API conventions, role-based access control (RBAC), and multi-lingual design patterns.

```
+--------------------------------------------------------------------------+
|                         Frontend Client (React + Vite)                  |
|  - React 18 / TypeScript                                                 |
|  - Tailwind CSS with Forest Green Design Tokens                          |
|  - Multi-lingual Dictionary Engine (English, தமிழ், हिन्दी)              |
|  - React Router v6 Client Routing & RBAC Guards                          |
|  - Interactive Recharts Visualizations & Lucide Icons                    |
+--------------------------------------------------------------------------+
                                     |
                                     | HTTP / JSON (Bearer JWT Auth)
                                     v
+--------------------------------------------------------------------------+
|                         Backend API (FastAPI)                            |
|  - REST Endpoints (/auth, /crops, /recommendations, /guides, /progress)  |
|  - Pydantic v2 Schema Validation                                         |
|  - BCrypt Salting & Cryptographic Password Hashing                       |
|  - Rule-Based Multi-Factor Agronomic Recommendation Engine               |
|  - Verified Agro-meteorological Advisory Integrator                      |
|  - Keyword/Intent Retrieval-Based Agricultural Chatbot                   |
+--------------------------------------------------------------------------+
                                     |
                                     | SQLAlchemy ORM 2.0
                                     v
+--------------------------------------------------------------------------+
|                         Database Layer (MySQL 8 / SQLite)                |
|  - Normalized Schemas: User, Crop, Guides, Products, Bookmarks, Progress |
|  - Foreign Key Constraints & Cascades                                    |
|  - Safe Migrations & Idempotent Seeding                                  |
+--------------------------------------------------------------------------+
```

### 2. Design Tokens & Color System

The user interface implements the specified agricultural palette:
- **Primary Forest Green**: `#1F5135` (Primary buttons, active links, key branding)
- **Secondary Green**: `#2E7D4F` (Interactive states, subtle accents)
- **Sage Green**: `#6E9F78` (Decorative borders, subtle badges)
- **Pale Green**: `#EEF5EE` (Highlight backgrounds, pill badges)
- **Main Background**: `#F7F9F5` (Page body canvas)
- **Surface**: `#FFFFFF` (Card surfaces, modals)
- **Primary Text**: `#1F2933` (Headings, primary content)
- **Secondary Text**: `#59665D` (Subtitles, metadata, captions)
- **Border**: `#DCE5DC` (Restrained card borders and dividers)
- **Success**: `#247447` (Positive states, completed badges)
- **Warning**: `#A86412` (Agronomic cautions, pest alerts)
- **Error**: `#B42318` (Validation alerts, deletions)

### 3. Authentication & Authorization

- **Password Hashing**: BCrypt with 12 rounds of random salt. Passwords are never stored in plain text.
- **Tokens**: HS256 JWT tokens with 24-hour expiration containing user identity claims (`sub`).
- **Role-Based Protection**: Two tiers:
  - `student`: Standard agricultural learner with bookmarking, recommendation, and progress tracking rights.
  - `admin`: Full administrative CRUD capabilities for crops, cultivation guides, pest profiles, and product records. Server-side validation is strictly enforced on every protected route.

### 4. Recommendation Engine Workflow

The recommendation algorithm implements a multi-parameter suitability model:
1. **Soil Type Match (30 pts)**: Matches query soil against ideal soil textures.
2. **Growing Season (25 pts)**: Evaluates seasonal photoperiod compatibility (Kharif, Rabi, Zaid, Year-round).
3. **Water Supply (25 pts)**: Assesses available irrigation infrastructure against physiological crop water needs.
4. **Agro-Climatic Region (20 pts)**: Verifies regional adaptation across India's agro-climatic zones.
5. **Transparency**: Generates an exact breakdown of matched criteria, partial gaps, and missing environmental factors. Recommendations are clearly framed with educational disclaimers.
