# Luxe Housing Agent Platform

A full-stack, comprehensive web platform for real estate agents to list properties and for users to find their next home. This application features robust role-based access control (RBAC), secure authentication, and dedicated dashboards for Users, Agents, and Administrators.

## 🏛️ System Architecture

Our application is built for scalability and performance, following a decoupled architecture. 

<div align="center">
  <img src="./architecture.svg" alt="System Architecture Diagram" width="100%" />
</div>

- **Frontend:** React.js, Tailwind CSS, Framer Motion (Hosted securely on Vercel)
- **Backend:** Python, FastAPI, SQLAlchemy (Hosted on vercel)
- **Database:** PostgreSQL (Hosted on Supabase)
- **Media Storage:** Cloudinary (For optimized image delivery)

---

## 🏗️ Structure Overview

### 🎨 Frontend Architecture
The frontend is built with **React 18** and **Vite** for lightning-fast HMR and optimized builds. It heavily relies on component-based architecture and React Context for global state management.

#### 📦 Core Libraries:
* **Tailwind CSS v4:** Utility-first styling for rapid, responsive UI development.
* **React Router Dom (v7):** Handling client-side routing, protected routes (`/admin`, `/dashboard`), and navigation.
* **Framer Motion:** Used for smooth page transitions, modal popups, and micro-animations (like the Property Image Gallery).
* **Axios:** Pre-configured HTTP client intercepting requests to attach JWT bearer tokens securely.
* **Lucide React:** Beautiful, consistent icon set used throughout the UI.

#### 📂 Directory Map
```text
frontend/
├── public/             # Static public assets
└── src/
    ├── components/     # Reusable UI parts (Navbar, PropertyCards, ProtectedRoutes)
    ├── context/        # React Context wrappers (e.g., AuthProvider for global user state handling)
    ├── lib/            # Utility functions and base configurations (e.g., Axios customized instance)
    └── pages/          # Major route views (Home, PropertyDetails, AgentDashboard, AdminPanel)
```


### Backend Structure
The backend uses FastAPI, following a modern MVC-like pattern adapted for APIs.

```text
app/
├── api/                # API router definitions and endpoint handlers
├── core/               # App configuration, security (JWT hashing), and environment settings
├── db/                 # Database connection and session management
├── models/             # SQLAlchemy ORM models (Database Tables)
└── schemas/            # Pydantic models for request/response bodies validation
```

---

## 🗄️ Database Structure

The platform uses a relational PostgreSQL database to map users, their specialized roles (Agents, Admins), properties, and platform interactions (reviews, reports, verification).

<div align="center">
  <img src="./db_schema.svg" alt="Database Schema Diagram" width="100%" />
</div>

### Entities summary:
* **Users:** Core identity table for every registered account.
* **Agents:** Extension of Users for people who apply to post housing. Linked 1-to-1 to a User.
* **Properties:** Real estate listings tied to a specific Agent.
* **Property Images:** 1-to-Many relation with Properties mapping Cloudinary URLs.
* **Verification Requests:** Audit trail for agents submitting NIN/Phone data for Admin approval.
* **Ratings & Reports:** User-submitted reviews to measure agent reliability and flag fraudulent posts.

---

## 🔌 API Overview

The platform provides a comprehensive REST API grouped by entity. All protected routes require a `Bearer` JWT token.

### 1. Authentication Endpoints (`/api/auth`)
* `POST /login` - Generate JWT access token (OAuth2 specs).
* `POST /register` - Create a base user account.
* `GET /me` - Fetch details based on current logged in user.

### 2. Properties Endpoints (`/api/properties`)
* `GET /` - List properties (public with pagination/filters).
* `GET /{id}` - Get specific property details.
* `POST /` - Create a new property listing (Agent only).
* `PUT /{id}`, `DELETE /{id}` - Update or delete listing (Agent only).

### 3. Agent Endpoints (`/api/agents`)
* `POST /register` - Upgrade standard user to unverified Agent.
* `POST /verify` - Submit NIN & Phone for verification.
* `GET /{id}` - Fetch agent public profile and listings.

### 4. Admin Endpoints (`/api/admin`)
* `GET /users`, `GET /agents` - Full lists for moderation.
* `PUT /verify-agent/{request_id}` - Approve or Reject an agent's application.
* `PUT /suspend-user/{user_id}` - Revoke platform access for a user/agent.

### 5. Review & Report Endpoints (`/api/reviews`)
* `POST /rating` - Rate a specific agent.
* `POST /report` - Flag an agent or property for admin review.

---

## 🚀 Features

### For Users
* **Browse & Search:** Search available properties with dynamic filtering (price, type, location, beds/baths).
* **Detailed Listings:** View high-quality images and full details of posted properties.
* **Authentication:** Secure JWT-based registration and login system.
* **Property Reporting:** Flag suspicious listings directly to administrators.

### For Real Estate Agents
* **Instant Onboarding:** Users can opt to register as an Agent to unlock listing capabilities instantly.
* **Dedicated Agent Panel:** A focused, professional dashboard specifically for agents to manage their business.
* **Post Properties:** Create comprehensive listings with multi-image upload support.
* **Verified Status:** Agents can submit their National ID Number (NIN) and phone number to achieve verified status (Level 2), which is prominently displayed to gain buyer trust.

### For Administrators
* **Admin Dashboard:** A secure, protected `/admin` route only accessible by authorized platform administrators.
* **User Management:** View all registered users/agents on the platform.
* **Moderation:** Quickly suspend/activate or permanently delete users who violate platform rules.

---

## 💻 Getting Started (Local Development)

### 1. Backend Setup

Open a terminal and navigate to the project root:

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the FastAPI server
uvicorn app.main:app --reload
```
*The backend API will run at `http://localhost:8000`*

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*The frontend application will run at `http://localhost:5173`*

---

## 🧪 Testing with Seed Accounts

The platform comes with helpful scripts to generate test users so you can easily explore the different role dashboards without needing to manually modify the database.

Run these scripts from the root directory while your virtual environment is active:

**Seed an Admin User**
```bash
python scripts/seed_admin.py
# Email: admin@luxehousing.com
# Password: AdminPassword123!
```

**Seed a Verified Agent User**
```bash
python scripts/seed_agent.py
# Email: agent@luxehousing.com
# Password: AgentPassword123!
```
