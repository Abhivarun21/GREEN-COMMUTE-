# 🌱 Green Commute Planner

A smart and eco-friendly commute planning web application that helps users find sustainable travel routes, track trip history, monitor CO₂ savings, and make greener transportation choices.

---

# 🚀 Live Demo

## Frontend
https://green-commute-tau.vercel.app

## Backend API
https://green-commute-ui8.onrender.com

---

# 📌 Project Overview

Green Commute Planner is a web-based application designed to encourage sustainable transportation choices.

The system allows users to:

- Register and login securely
- Search travel routes
- View route on interactive map
- Track carbon emissions
- Monitor travel statistics
- View travel history

This project helps users make environmentally friendly commuting decisions.

---

# ✨ Key Features

## User Authentication
- User Registration
- Secure Login
- JWT Authentication
- Protected Dashboard Access
- Logout Functionality

---

## Route Planning
Users can:

- Enter source location
- Enter destination location
- View route on map
- Compare travel options

---

## Dashboard Analytics
Users can monitor:

- Total Trips
- CO₂ Saved
- Eco Trips
- Total Money Spent

---

## Trip History
Users can view:

- Source
- Destination
- Travel Mode
- CO₂ Emission
- Cost
- Travel Date

---

## Interactive Map
Integrated map visualization using Leaflet Maps.

Features:

- Route display
- Location markers
- Zoom controls

---

# 🛠️ Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript

## Backend
- Node.js
- Express.js

## Database
- PostgreSQL

## APIs
- OpenRouteService API
- Leaflet Maps API

## Deployment
- Vercel (Frontend)
- Render (Backend + Cloud Database)

---

# 📂 Project Structure

```bash
Green_Commute_Planner/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── register.html
│   ├── dashboard.html
│   ├── style.css
│   └── js/
│       ├── login.js
│       ├── register.js
│       └── dashboard.js
│
└── README.md
```

---

# ⚙️ Installation Guide

## Step 1: Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
cd Green_Commute_Planner
```

---

## Step 2: Backend Setup

Move to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=3001

JWT_SECRET=your_secret_key

DB_USER=your_database_user
DB_HOST=your_database_host
DB_DATABASE=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=5432

ORS_API_KEY=your_openrouteservice_api_key
```

Run backend server:

```bash
node server.js
```

---

## Step 3: Frontend Setup

Move to frontend folder and open:

```bash
index.html
```

or run using Live Server.

---

# 🔒 Security Features

- JWT Token Authentication
- Protected Routes
- Session Management
- Unauthorized Access Prevention
- Secure Logout

---

# 🧪 Testing Performed

## Authentication Tests
✅ User Registration  
✅ Duplicate User Validation  
✅ Valid Login  
✅ Invalid Login Handling  

---

## Dashboard Tests
✅ Stats Loading  
✅ Trip History Loading  
✅ Token Verification  

---

## Route Tests
✅ Valid Route Search  
✅ Invalid Route Handling  
✅ Map Visualization  

---

## Security Tests
✅ Unauthorized Access Redirect  
✅ Logout Token Removal  

---

# 📈 System Workflow

```text
User Registers
      ↓
User Logs In
      ↓
JWT Token Generated
      ↓
Dashboard Opens
      ↓
Route Search
      ↓
Trip Saved to Database
      ↓
Dashboard Updated
```

---

# 🌍 Project Benefits

This project promotes:

- Sustainable transportation
- Reduced carbon footprint
- Eco-friendly commuting
- Smart urban mobility

---

# 👨‍💻 Developed By

**Abhivarun, Pradham, Akshitha, Laasya, Sohan, Pranavi, Shruthika, shriyanka**

---

# Future Enhancements

- Real-time traffic updates
- Public transport integration
- AI-based route recommendations
- Mobile app version

---

# Project Status

✅ Completed  
✅ Tested  
✅ Deployed  
✅ Production Ready
