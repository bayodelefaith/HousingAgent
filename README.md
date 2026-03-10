# Luxe Housing Agent Platform

A full-stack, comprehensive web platform for real estate agents to list properties and for users to find their next home. This application features robust role-based access control (RBAC), secure authentication, and dedicated dashboards for Users, Agents, and Administrators.

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

## 🛠️ Tech Stack

### Backend
* **Python 3.10+**
* **FastAPI:** High-performance async web framework
* **SQLAlchemy & Alembic:** ORM and database migration management
* **PostgreSQL:** PostgreSQL using SupaBase
* **Passlib (Bcrypt) & Python-Jose:** Secure password hashing and JWT token generation
* **Pydantic:** Type validation and settings management

### Frontend
* **React 18:** Component-based UI library
* **Vite:** Next-generation frontend tooling and bundler
* **Tailwind CSS:** Utility-first CSS framework for rapid and responsive styling
* **React Router Dom:** Client-side routing with protected route logic
* **Lucide React:** Beautiful, consistent icon set
* **Axios:** Promise-based HTTP client

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

---

## 📂 Project Structure

```text
HousingAgent/
├── alembic/                # Database migration scripts
├── app/                    # FastAPI Backend
│   ├── api/                # API routers and endpoints (/auth, /properties, /admin, etc.)
│   ├── core/               # Security, settings, and config
│   ├── db/                 # Database connection setup
│   ├── models/             # SQLAlchemy ORM models
│   └── schemas/            # Pydantic validation schemas
├── frontend/               # React + Vite Frontend
│   ├── public/             # Static public assets
│   └── src/
│       ├── components/     # Reusable UI components (Navbar, ProtectedRoute, Forms)
│       ├── context/        # React Context providers (AuthContext)
│       ├── lib/            # Utilities (Axios config)
│       └── pages/          # Full page views (Dashboard, AdminDashboard, Properties)
├── scripts/                # Helpful developer scripts (seeding DB)
└── uploads/                # Local storage for user-uploaded property images
```
