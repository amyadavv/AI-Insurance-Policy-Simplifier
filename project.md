# 🛡️ AI Insurance Policy Simplifier — Complete Project Documentation

> **Problem Statement:** Why don't people understand the insurance policies they buy? Policyholders make uninformed decisions because insurance documents are written in legal and technical language, obscuring exclusions and conditions that directly affect claim outcomes.

> **Solution:** An AI-powered web application that allows users to upload their insurance policy documents (PDF/images), extracts text using OCR, and uses AI (Google Gemini API) to simplify complex legal/technical language into plain, easy-to-understand summaries — highlighting key coverage details, exclusions, conditions, and claim-affecting clauses.

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Tech Stack & Free Tools Selection](#3-tech-stack--free-tools-selection)
4. [Project Folder Structure](#4-project-folder-structure)
5. [Phase 1 — Environment Setup](#5-phase-1--environment-setup)
6. [Phase 2 — Database Design (MongoDB)](#6-phase-2--database-design-mongodb)
7. [Phase 3 — Backend Foundation (Node.js + Express)](#7-phase-3--backend-foundation-nodejs--express)
8. [Phase 4 — Authentication System (JWT)](#8-phase-4--authentication-system-jwt)
9. [Phase 5 — File Upload & Storage (Cloudinary)](#9-phase-5--file-upload--storage-cloudinary)
10. [Phase 6 — OCR Pipeline (Tesseract.js + pdf-parse)](#10-phase-6--ocr-pipeline-tesseractjs--pdf-parse)
11. [Phase 7 — AI Simplification Engine (Google Gemini API)](#11-phase-7--ai-simplification-engine-google-gemini-api)
12. [Phase 8 — Backend API Routes (Complete)](#12-phase-8--backend-api-routes-complete)
13. [Phase 9 — Frontend Setup (React + Vite + Tailwind CSS)](#13-phase-9--frontend-setup-react--vite--tailwind-css)
14. [Phase 10 — State Management (Recoil)](#14-phase-10--state-management-recoil)
15. [Phase 11 — Frontend Pages & Components](#15-phase-11--frontend-pages--components)
16. [Phase 12 — API Integration (Axios)](#16-phase-12--api-integration-axios)
17. [Phase 13 — Testing](#17-phase-13--testing)
18. [Phase 14 — Deployment](#18-phase-14--deployment)
19. [Environment Variables Reference](#19-environment-variables-reference)
20. [Complete API Documentation](#20-complete-api-documentation)

---

## 1. Project Overview

### 1.1 What Does This App Do?

```
User uploads insurance policy (PDF / Image)
         │
         ▼
   File stored on Cloudinary (free)
         │
         ▼
   OCR extracts text from document
   (Tesseract.js for images, pdf-parse for digital PDFs)
         │
         ▼
   Extracted text sent to Google Gemini API
         │
         ▼
   AI returns simplified summary:
     ✅ What's covered
     ❌ What's excluded
     ⚠️  Key conditions & limitations
     💰 Claim-affecting clauses
     📋 Plain-English summary
         │
         ▼
   User views simplified policy on dashboard
   (can save, revisit, compare, and download)
```

### 1.2 Core Features

| Feature | Description |
|---|---|
| **User Authentication** | Register/Login with JWT tokens |
| **Document Upload** | Upload PDF or image files of insurance policies |
| **OCR Text Extraction** | Automatic text extraction from uploaded documents |
| **AI Simplification** | Google Gemini converts legal jargon into plain English |
| **Structured Summary** | Organized output: Coverage, Exclusions, Conditions, Premiums |
| **Policy Dashboard** | View all uploaded & simplified policies |
| **Policy History** | Track previously analyzed policies |
| **Downloadable Reports** | Export simplified summaries as PDF |
| **Responsive Design** | Mobile-first, works on all devices |

### 1.3 User Flow

```
1. User signs up / logs in
2. User lands on Dashboard
3. User clicks "Upload Policy"
4. User selects a PDF or image file
5. System uploads file to Cloudinary
6. System runs OCR to extract text
7. System sends extracted text to Gemini AI
8. AI returns a simplified, structured summary
9. Summary is saved to MongoDB and displayed to user
10. User can view, revisit, or download the summary
```

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │  Auth    │ │ Dashboard│ │  Upload  │ │  Policy Viewer    │  │
│  │  Pages   │ │  Page    │ │  Page    │ │  (Summary View)   │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬──────────┘  │
│       │             │            │                 │             │
│       └─────────────┼────────────┼─────────────────┘             │
│                     │     Axios HTTP Requests                    │
│                     │     (JWT in Authorization Header)          │
└─────────────────────┼───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express.js)                │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │  Auth Routes │  │ Policy Routes│  │  Middleware             │ │
│  │  /api/auth/* │  │ /api/policy/*│  │  (JWT verify, multer)  │ │
│  └──────┬───────┘  └──────┬───────┘  └────────────────────────┘ │
│         │                 │                                      │
│         │    ┌────────────┼────────────────┐                    │
│         │    │            │                │                    │
│         ▼    ▼            ▼                ▼                    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐        │
│  │   MongoDB    │ │  Cloudinary  │ │  OCR Engine      │        │
│  │   (Atlas)    │ │  (Storage)   │ │  (Tesseract.js / │        │
│  │              │ │              │ │   pdf-parse)     │        │
│  └──────────────┘ └──────────────┘ └────────┬─────────┘        │
│                                              │                  │
│                                              ▼                  │
│                                    ┌──────────────────┐         │
│                                    │  Google Gemini   │         │
│                                    │  API (Free Tier) │         │
│                                    └──────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Tech Stack & Free Tools Selection

### 3.1 Complete Stack

| Layer | Technology | Cost | Why This? |
|---|---|---|---|
| **Frontend** | React 18+ (Vite) | Free | Fast build tool, HMR, modern DX |
| **Styling** | Tailwind CSS 3+ | Free | Utility-first, rapid UI development |
| **State Mgmt** | Recoil | Free | Simple atoms/selectors for React state |
| **HTTP Client** | Axios | Free | Promise-based, interceptors for JWT |
| **Backend** | Node.js + Express.js | Free | Lightweight, huge ecosystem |
| **Authentication** | JWT (jsonwebtoken) | Free | Stateless, scalable auth |
| **Password Hashing** | bcryptjs | Free | Secure password hashing |
| **Database** | MongoDB Atlas (M0) | **Free Forever** | 512 MB storage, 500 connections |
| **ODM** | Mongoose | Free | Schema validation, middleware |
| **File Storage** | Cloudinary | **Free** (25 credits/mo) | ~25 GB storage or bandwidth |
| **File Upload** | Multer | Free | Multipart form-data handling |
| **OCR (Images)** | Tesseract.js | **Free** (open-source) | Client/server OCR, no API key needed |
| **PDF Parsing** | pdf-parse | **Free** (open-source) | Extract text from digital PDFs |
| **AI Engine** | Google Gemini API | **Free Tier** | 15 RPM, 1M TPM free |
| **Validation** | express-validator / Joi | Free | Input sanitization & validation |
| **CORS** | cors | Free | Cross-origin resource sharing |
| **Env Config** | dotenv | Free | Environment variable management |
| **Deployment (FE)** | Vercel | **Free** | Auto deploy from GitHub |
| **Deployment (BE)** | Render | **Free** (750 hrs/mo) | Free Node.js hosting |

### 3.2 Free Tier Limits Cheat Sheet

| Service | Free Limit | Enough For? |
|---|---|---|
| **MongoDB Atlas M0** | 512 MB storage, 500 connections, 100 ops/sec | ~10,000+ policies |
| **Cloudinary** | 25 credits/month (≈ 25 GB storage or bandwidth) | ~5,000 documents |
| **Google Gemini API** | 15 requests/min, 1M tokens/min, 1,500 req/day | ~1,500 policies/day |
| **Tesseract.js** | Unlimited (runs locally) | No limits |
| **pdf-parse** | Unlimited (runs locally) | No limits |
| **Vercel (Frontend)** | 100 GB bandwidth/month | Plenty for dev/demo |
| **Render (Backend)** | 750 hours/month (sleeps after 15 min idle) | Good for development |

---

## 4. Project Folder Structure

```
AI-Insurance-Policy-Simplifier/
│
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── authController.js        # Register, Login, Profile
│   │   └── policyController.js      # Upload, Simplify, Get, Delete
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── uploadMiddleware.js      # Multer config for file uploads
│   │   └── errorMiddleware.js       # Global error handler
│   │
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── Policy.js                # Policy schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth/*
│   │   └── policyRoutes.js          # /api/policy/*
│   │
│   ├── services/
│   │   ├── ocrService.js            # Tesseract.js + pdf-parse logic
│   │   ├── aiService.js             # Google Gemini API integration
│   │   └── cloudinaryService.js     # Cloudinary upload/delete
│   │
│   ├── utils/
│   │   ├── generateToken.js         # JWT token generator
│   │   └── validators.js            # Input validation schemas
│   │
│   ├── .env                         # Environment variables (NEVER commit)
│   ├── .env.example                 # Template for env vars
│   ├── package.json
│   └── server.js                    # Entry point
│
├── frontend/
│   ├── public/
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js      # Axios config with interceptors
│   │   │
│   │   ├── atoms/
│   │   │   ├── authAtom.js           # Recoil auth state
│   │   │   └── policyAtom.js         # Recoil policy state
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── Toast.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   │
│   │   │   ├── policy/
│   │   │   │   ├── PolicyCard.jsx
│   │   │   │   ├── PolicyUpload.jsx
│   │   │   │   ├── PolicySummary.jsx
│   │   │   │   └── PolicyList.jsx
│   │   │   │
│   │   │   └── dashboard/
│   │   │       ├── StatsCard.jsx
│   │   │       └── RecentPolicies.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── UploadPage.jsx
│   │   │   ├── PolicyDetailPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── usePolicy.js
│   │   │
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css                 # Tailwind directives
│   │
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── project.md                        # ← This documentation file
├── .gitignore
└── README.md
```

---

## 5. Phase 1 — Environment Setup

### Step 1.1: Prerequisites

Install these on your machine before starting:

| Tool | Version | Download |
|---|---|---|
| Node.js | v18+ (LTS recommended) | https://nodejs.org |
| npm | v9+ (comes with Node.js) | — |
| Git | Latest | https://git-scm.com |
| VS Code | Latest | https://code.visualstudio.com |

### Step 1.2: Create Project Root

```bash
mkdir AI-Insurance-Policy-Simplifier
cd AI-Insurance-Policy-Simplifier
git init
```

### Step 1.3: Create `.gitignore` (Root Level)

```gitignore
# Dependencies
node_modules/

# Environment variables
.env
.env.local

# Build outputs
dist/
build/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Logs
*.log
npm-debug.log*
```

### Step 1.4: Set Up Free Services Accounts

#### A) MongoDB Atlas (Database)

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project → Name it `insurance-simplifier`
4. Click **"Build a Database"** → Select **M0 FREE** tier
5. Choose your cloud provider (AWS recommended) and region closest to you
6. Set a database username and password (save these!)
7. In **Network Access** → Click **"Add IP Address"** → Add `0.0.0.0/0` (allows all IPs — fine for development)
8. In **Database** → Click **"Connect"** → **"Connect your application"**
9. Copy the connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
10. Replace `<username>`, `<password>`, and `<dbname>` with your values

#### B) Cloudinary (File Storage)

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. After login, go to **Dashboard**
4. Copy these three values:
   - **Cloud Name** (e.g., `dxxxxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `AbCdEfGhIjKlMnOpQrStUvWxYz`)
5. Free tier gives you **25 credits/month** (≈ 25 GB storage or bandwidth)

#### C) Google Gemini API (AI Engine)

1. Go to [https://aistudio.google.com/](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **"Get API Key"** → **"Create API key"**
4. Select or create a Google Cloud project
5. Copy the generated API key
6. Free tier limits: **15 requests/min**, **1,500 requests/day**, **1M tokens/min**

> ⚠️ **Important:** Do NOT enable billing on the Google Cloud project you use for the Gemini free tier. If billing is enabled, the free tier may be disabled.

---

## 6. Phase 2 — Database Design (MongoDB)

### Step 2.1: Database Name

```
Database: insurance_simplifier_db
```

### Step 2.2: Collections & Schemas

#### Collection: `users`

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in queries by default
    },
    avatar: {
      type: String,
      default: '', // Cloudinary URL if user uploads a profile picture
    },
    policiesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

#### Collection: `policies`

```javascript
// models/Policy.js
const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Original document info
    originalFileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'image'],
      required: true,
    },
    fileUrl: {
      type: String, // Cloudinary URL
      required: true,
    },
    cloudinaryPublicId: {
      type: String, // For deletion from Cloudinary
      required: true,
    },
    fileSize: {
      type: Number, // in bytes
    },

    // OCR extracted text
    extractedText: {
      type: String,
      default: '',
    },
    ocrConfidence: {
      type: Number, // 0-100 confidence score
      default: null,
    },

    // AI-generated simplified summary
    simplifiedSummary: {
      overview: {
        type: String, // Plain English overview of the policy
        default: '',
      },
      policyType: {
        type: String, // e.g., "Health Insurance", "Auto Insurance"
        default: '',
      },
      coverage: [
        {
          item: String,        // What is covered
          description: String,  // Plain English explanation
          limit: String,        // Coverage limit if mentioned
        },
      ],
      exclusions: [
        {
          item: String,        // What is NOT covered
          description: String,  // Why it matters
          impact: String,       // How it affects claims
        },
      ],
      conditions: [
        {
          condition: String,    // The condition/requirement
          explanation: String,  // What it means in plain English
          importance: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
          },
        },
      ],
      claimProcess: {
        type: String, // How to file a claim (simplified)
        default: '',
      },
      keyNumbers: {
        premium: String,       // Monthly/annual premium
        deductible: String,    // Deductible amount
        maxCoverage: String,   // Maximum coverage limit
        waitingPeriod: String, // Waiting period if applicable
      },
      warnings: [String],      // Important warnings/red flags
      recommendations: [String], // AI recommendations for the user
    },

    // Processing status
    status: {
      type: String,
      enum: ['uploaded', 'extracting', 'simplifying', 'completed', 'failed'],
      default: 'uploaded',
    },
    errorMessage: {
      type: String,
      default: '',
    },

    // Metadata
    tags: [String], // User-added tags like "health", "car", "home"
    isBookmarked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
policySchema.index({ user: 1, createdAt: -1 });
policySchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Policy', policySchema);
```

### Step 2.3: Schema Relationship Diagram

```
┌───────────────┐       1 : N       ┌───────────────────┐
│     Users     │ ◄──────────────── │     Policies      │
│               │                    │                   │
│  _id (PK)     │                    │  _id (PK)         │
│  name         │                    │  user (FK → Users) │
│  email        │                    │  originalFileName  │
│  password     │                    │  fileUrl           │
│  avatar       │                    │  extractedText     │
│  policiesCount│                    │  simplifiedSummary │
│  createdAt    │                    │  status            │
│  updatedAt    │                    │  createdAt         │
└───────────────┘                    │  updatedAt         │
                                     └───────────────────┘
```

---

## 7. Phase 3 — Backend Foundation (Node.js + Express)

### Step 3.1: Initialize Backend

```bash
cd backend
npm init -y
```

### Step 3.2: Install Dependencies

```bash
# Core
npm install express mongoose dotenv cors

# Authentication
npm install jsonwebtoken bcryptjs

# File Upload
npm install multer cloudinary

# OCR & PDF
npm install tesseract.js pdf-parse

# AI Integration
npm install @google/generative-ai

# Validation
npm install express-validator

# Utility
npm install morgan
```

### Step 3.3: Create `.env` File

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/insurance_simplifier_db?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123!
JWT_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Step 3.4: Create `.env.example` (Commit This)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

### Step 3.5: Database Connection — `config/db.js`

```javascript
// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Step 3.6: Server Entry Point — `server.js`

```javascript
// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/policy', require('./routes/policyRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
```

### Step 3.7: Error Middleware — `middleware/errorMiddleware.js`

```javascript
// backend/middleware/errorMiddleware.js

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
```

---

## 8. Phase 4 — Authentication System (JWT)

### Step 4.1: JWT Token Generator — `utils/generateToken.js`

```javascript
// backend/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = generateToken;
```

### Step 4.2: Auth Middleware — `middleware/authMiddleware.js`

```javascript
// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }

      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

module.exports = { protect };
```

### Step 4.3: Auth Controller — `controllers/authController.js`

```javascript
// backend/controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all fields');
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          policiesCount: user.policiesCount,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Login user & return token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        policiesCount: user.policiesCount,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        policiesCount: user.policiesCount,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        token: generateToken(updatedUser._id),
      },
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
```

### Step 4.4: Auth Routes — `routes/authRoutes.js`

```javascript
// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
```

---

## 9. Phase 5 — File Upload & Storage (Cloudinary)

### Step 5.1: Cloudinary Service — `services/cloudinaryService.js`

```javascript
// backend/services/cloudinaryService.js
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} folder - The Cloudinary folder name
 * @param {string} resourceType - 'image' or 'raw' (for PDFs)
 * @returns {Object} - { url, publicId }
 */
const uploadToCloudinary = (fileBuffer, folder = 'insurance-policies', resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        // For PDFs, use 'raw'; for images, use 'image'
        allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'tiff'],
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
          });
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The Cloudinary public ID
 * @param {string} resourceType - 'image' or 'raw'
 */
const deleteFromCloudinary = async (publicId, resourceType = 'raw') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
    throw error;
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
```

### Step 5.2: Multer Upload Middleware — `middleware/uploadMiddleware.js`

```javascript
// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Use memory storage (files stored as buffer in memory, then uploaded to Cloudinary)
const storage = multer.memoryStorage();

// File filter - only allow PDFs and images
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/tiff',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only PDF, JPEG, PNG, WebP, and TIFF files are allowed.'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  },
});

module.exports = upload;
```

---

## 10. Phase 6 — OCR Pipeline (Tesseract.js + pdf-parse)

### Step 6.1: Understanding the Dual Pipeline

```
                      ┌─────────────────┐
                      │  Uploaded File   │
                      └────────┬────────┘
                               │
                    ┌──────────┴──────────┐
                    │  Check file type    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                                  │
         File is PDF                        File is Image
              │                                  │
              ▼                                  ▼
    ┌──────────────────┐              ┌──────────────────┐
    │   pdf-parse       │              │   Tesseract.js   │
    │  (digital text)   │              │   (OCR engine)   │
    └────────┬─────────┘              └────────┬─────────┘
             │                                  │
             │    Check if text was extracted    │
             │         (empty = scanned PDF)     │
             │                                  │
             ├──── If empty ────────────────────┤
             │                                  │
             ▼                                  ▼
    ┌──────────────────┐              ┌──────────────────┐
    │  Convert PDF to  │              │  Return extracted │
    │  image + OCR     │              │  text + confidence│
    └────────┬─────────┘              └────────┬─────────┘
             │                                  │
             └──────────────┬───────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  Extracted Text   │
                  │  (ready for AI)   │
                  └──────────────────┘
```

### Step 6.2: OCR Service — `services/ocrService.js`

```javascript
// backend/services/ocrService.js
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');

/**
 * Extract text from an image using Tesseract.js OCR
 * @param {Buffer} imageBuffer - Image file buffer
 * @returns {Object} - { text, confidence }
 */
const extractTextFromImage = async (imageBuffer) => {
  try {
    console.log('🔍 Starting OCR on image...');

    const {
      data: { text, confidence },
    } = await Tesseract.recognize(imageBuffer, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`   OCR Progress: ${(m.progress * 100).toFixed(1)}%`);
        }
      },
    });

    console.log(`✅ OCR Complete. Confidence: ${confidence.toFixed(1)}%`);

    return {
      text: text.trim(),
      confidence: parseFloat(confidence.toFixed(2)),
    };
  } catch (error) {
    console.error('❌ OCR Error:', error.message);
    throw new Error(`OCR processing failed: ${error.message}`);
  }
};

/**
 * Extract text from a PDF file
 * First tries digital text extraction, falls back to OCR if empty
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Object} - { text, confidence, method }
 */
const extractTextFromPDF = async (pdfBuffer) => {
  try {
    console.log('📄 Parsing PDF...');

    // Step 1: Try digital text extraction with pdf-parse
    const pdfData = await pdfParse(pdfBuffer);
    const digitalText = pdfData.text.trim();

    if (digitalText && digitalText.length > 50) {
      // Digital text found — no OCR needed
      console.log(
        `✅ Digital text extracted: ${digitalText.length} characters`
      );
      return {
        text: digitalText,
        confidence: 99, // Digital extraction is highly accurate
        method: 'digital',
        pages: pdfData.numpages,
      };
    }

    // Step 2: If no digital text, the PDF is likely a scanned image
    // We would need to convert PDF pages to images first
    // For simplicity, we'll try OCR on the raw buffer
    console.log('📸 PDF appears to be scanned. Attempting OCR...');

    const ocrResult = await extractTextFromImage(pdfBuffer);
    return {
      text: ocrResult.text,
      confidence: ocrResult.confidence,
      method: 'ocr',
      pages: pdfData.numpages,
    };
  } catch (error) {
    console.error('❌ PDF parsing error:', error.message);
    throw new Error(`PDF processing failed: ${error.message}`);
  }
};

/**
 * Main function: Extract text from any supported file
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} mimeType - File MIME type
 * @returns {Object} - { text, confidence, method }
 */
const extractText = async (fileBuffer, mimeType) => {
  if (mimeType === 'application/pdf') {
    return await extractTextFromPDF(fileBuffer);
  } else if (mimeType.startsWith('image/')) {
    const result = await extractTextFromImage(fileBuffer);
    return { ...result, method: 'ocr' };
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
};

module.exports = { extractText, extractTextFromImage, extractTextFromPDF };
```

---

## 11. Phase 7 — AI Simplification Engine (Google Gemini API)

### Step 7.1: AI Service — `services/aiService.js`

```javascript
// backend/services/aiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Simplify insurance policy text using Google Gemini AI
 * @param {string} extractedText - Raw text extracted from the policy document
 * @returns {Object} - Structured simplified summary
 */
const simplifyPolicy = async (extractedText) => {
  try {
    console.log('🤖 Sending text to Gemini AI for simplification...');

    // Use Gemini Flash (free tier compatible)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
You are an expert insurance policy analyst and consumer advocate. Your job is to help ordinary people understand their insurance policies by translating complex legal and technical language into simple, clear, everyday English.

Analyze the following insurance policy text and provide a structured summary in JSON format. Be thorough, accurate, and always prioritize the policyholder's understanding.

IMPORTANT RULES:
1. Use simple, everyday language — imagine explaining to someone with no insurance knowledge.
2. Highlight anything that could surprise the policyholder or affect their claims.
3. Be specific — don't use vague language like "certain conditions apply."
4. If something is unclear in the original text, say so explicitly.
5. Always err on the side of caution — warn about potential pitfalls.

Return your response as a valid JSON object with this exact structure:

{
  "overview": "A 2-3 sentence plain English summary of what this policy is and what it does for the policyholder.",
  "policyType": "The type of insurance (e.g., Health Insurance, Auto Insurance, Home Insurance, Life Insurance, Travel Insurance, etc.)",
  "coverage": [
    {
      "item": "What is covered (short title)",
      "description": "Plain English explanation of this coverage",
      "limit": "The maximum amount or limit for this coverage, if mentioned"
    }
  ],
  "exclusions": [
    {
      "item": "What is NOT covered (short title)",
      "description": "Why this exclusion matters to you",
      "impact": "How this could affect you if you need to make a claim"
    }
  ],
  "conditions": [
    {
      "condition": "The condition or requirement",
      "explanation": "What this means in plain English and what you need to do",
      "importance": "low | medium | high | critical"
    }
  ],
  "claimProcess": "Step-by-step explanation of how to file a claim in simple terms",
  "keyNumbers": {
    "premium": "How much you pay and how often (monthly/annually)",
    "deductible": "How much you pay out of pocket before insurance kicks in",
    "maxCoverage": "The maximum amount the insurance will pay",
    "waitingPeriod": "How long you must wait before coverage begins"
  },
  "warnings": [
    "Important warning or red flag that the policyholder should know about"
  ],
  "recommendations": [
    "Actionable recommendation for the policyholder"
  ]
}

If any field cannot be determined from the text, use "Not specified in the document" as the value.

--- INSURANCE POLICY TEXT START ---
${extractedText}
--- INSURANCE POLICY TEXT END ---

Return ONLY the JSON object, no additional text or markdown formatting.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();

    // Clean up response — remove markdown code blocks if present
    responseText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Parse JSON response
    const simplifiedData = JSON.parse(responseText);

    console.log('✅ AI simplification complete');

    return simplifiedData;
  } catch (error) {
    console.error('❌ AI Service Error:', error.message);

    // If JSON parsing failed, return a structured error
    if (error instanceof SyntaxError) {
      throw new Error(
        'AI returned an invalid response format. Please try again.'
      );
    }

    throw new Error(`AI simplification failed: ${error.message}`);
  }
};

module.exports = { simplifyPolicy };
```

### Step 7.2: How the AI Prompt Works

The prompt is designed with several key strategies:

| Strategy | Why |
|---|---|
| **Role Assignment** | "You are an expert insurance policy analyst" — gives the AI context |
| **Target Audience** | "imagine explaining to someone with no insurance knowledge" — sets reading level |
| **Structured Output** | JSON format ensures consistent, parseable responses |
| **Specific Rules** | Prevents vague AI responses like "conditions may apply" |
| **Warning Focus** | Prioritizes highlighting gotchas and claim-affecting clauses |
| **Graceful Degradation** | "Not specified in document" fallback prevents hallucination |

---

## 12. Phase 8 — Backend API Routes (Complete)

### Step 8.1: Policy Controller — `controllers/policyController.js`

```javascript
// backend/controllers/policyController.js
const Policy = require('../models/Policy');
const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');
const { extractText } = require('../services/ocrService');
const { simplifyPolicy } = require('../services/aiService');

// @desc    Upload and process a policy document
// @route   POST /api/policy/upload
// @access  Private
const uploadPolicy = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a file');
    }

    const { originalname, mimetype, buffer, size } = req.file;

    // Determine file type
    const fileType = mimetype === 'application/pdf' ? 'pdf' : 'image';

    // Step 1: Upload to Cloudinary
    console.log('📤 Step 1: Uploading to Cloudinary...');
    const cloudinaryResult = await uploadToCloudinary(
      buffer,
      'insurance-policies',
      fileType === 'pdf' ? 'raw' : 'image'
    );

    // Step 2: Create policy record with 'uploaded' status
    const policy = await Policy.create({
      user: req.user._id,
      originalFileName: originalname,
      fileType,
      fileUrl: cloudinaryResult.url,
      cloudinaryPublicId: cloudinaryResult.publicId,
      fileSize: size,
      status: 'extracting',
      tags: req.body.tags ? req.body.tags.split(',').map((t) => t.trim()) : [],
    });

    // Step 3: Extract text using OCR
    console.log('🔍 Step 2: Extracting text...');
    policy.status = 'extracting';
    await policy.save();

    const ocrResult = await extractText(buffer, mimetype);
    policy.extractedText = ocrResult.text;
    policy.ocrConfidence = ocrResult.confidence;

    // Check if enough text was extracted
    if (!ocrResult.text || ocrResult.text.length < 50) {
      policy.status = 'failed';
      policy.errorMessage =
        'Could not extract enough text from the document. Please ensure the document is clear and readable.';
      await policy.save();

      return res.status(422).json({
        success: false,
        message: policy.errorMessage,
        data: policy,
      });
    }

    // Step 4: Simplify with AI
    console.log('🤖 Step 3: Simplifying with AI...');
    policy.status = 'simplifying';
    await policy.save();

    const simplifiedData = await simplifyPolicy(ocrResult.text);
    policy.simplifiedSummary = simplifiedData;
    policy.status = 'completed';
    await policy.save();

    // Step 5: Update user's policy count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { policiesCount: 1 },
    });

    console.log('✅ Policy processing complete!');

    res.status(201).json({
      success: true,
      message: 'Policy uploaded and simplified successfully',
      data: policy,
    });
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Get all policies for logged-in user
// @route   GET /api/policy
// @access  Private
const getPolicies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    // Build query
    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { originalFileName: { $regex: search, $options: 'i' } },
        { 'simplifiedSummary.policyType': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const policies = await Policy.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-extractedText'); // Exclude large text field from list

    const total = await Policy.countDocuments(query);

    res.json({
      success: true,
      data: policies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single policy by ID
// @route   GET /api/policy/:id
// @access  Private
const getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!policy) {
      res.status(404);
      throw new Error('Policy not found');
    }

    res.json({
      success: true,
      data: policy,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Delete a policy
// @route   DELETE /api/policy/:id
// @access  Private
const deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!policy) {
      res.status(404);
      throw new Error('Policy not found');
    }

    // Delete from Cloudinary
    try {
      const resourceType = policy.fileType === 'pdf' ? 'raw' : 'image';
      await deleteFromCloudinary(policy.cloudinaryPublicId, resourceType);
    } catch (cloudError) {
      console.error('Cloudinary delete warning:', cloudError.message);
      // Continue even if Cloudinary delete fails
    }

    // Delete from database
    await Policy.deleteOne({ _id: policy._id });

    // Update user's policy count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { policiesCount: -1 },
    });

    res.json({
      success: true,
      message: 'Policy deleted successfully',
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Toggle bookmark on a policy
// @route   PUT /api/policy/:id/bookmark
// @access  Private
const toggleBookmark = async (req, res) => {
  try {
    const policy = await Policy.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!policy) {
      res.status(404);
      throw new Error('Policy not found');
    }

    policy.isBookmarked = !policy.isBookmarked;
    await policy.save();

    res.json({
      success: true,
      data: { isBookmarked: policy.isBookmarked },
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Re-simplify a policy (retry AI processing)
// @route   POST /api/policy/:id/re-simplify
// @access  Private
const reSimplifyPolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!policy) {
      res.status(404);
      throw new Error('Policy not found');
    }

    if (!policy.extractedText || policy.extractedText.length < 50) {
      res.status(400);
      throw new Error('Not enough extracted text to simplify');
    }

    policy.status = 'simplifying';
    await policy.save();

    const simplifiedData = await simplifyPolicy(policy.extractedText);
    policy.simplifiedSummary = simplifiedData;
    policy.status = 'completed';
    policy.errorMessage = '';
    await policy.save();

    res.json({
      success: true,
      message: 'Policy re-simplified successfully',
      data: policy,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats for logged-in user
// @route   GET /api/policy/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalPolicies, completedPolicies, failedPolicies, bookmarkedPolicies] =
      await Promise.all([
        Policy.countDocuments({ user: userId }),
        Policy.countDocuments({ user: userId, status: 'completed' }),
        Policy.countDocuments({ user: userId, status: 'failed' }),
        Policy.countDocuments({ user: userId, isBookmarked: true }),
      ]);

    // Get policy type distribution
    const policyTypes = await Policy.aggregate([
      { $match: { user: userId, status: 'completed' } },
      {
        $group: {
          _id: '$simplifiedSummary.policyType',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent policies
    const recentPolicies = await Policy.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('originalFileName status simplifiedSummary.policyType createdAt isBookmarked');

    res.json({
      success: true,
      data: {
        totalPolicies,
        completedPolicies,
        failedPolicies,
        bookmarkedPolicies,
        policyTypes,
        recentPolicies,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadPolicy,
  getPolicies,
  getPolicyById,
  deletePolicy,
  toggleBookmark,
  reSimplifyPolicy,
  getDashboardStats,
};
```

### Step 8.2: Policy Routes — `routes/policyRoutes.js`

```javascript
// backend/routes/policyRoutes.js
const express = require('express');
const router = express.Router();
const {
  uploadPolicy,
  getPolicies,
  getPolicyById,
  deletePolicy,
  toggleBookmark,
  reSimplifyPolicy,
  getDashboardStats,
} = require('../controllers/policyController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes require authentication
router.use(protect);

// Dashboard stats (must be before /:id to avoid conflict)
router.get('/stats', getDashboardStats);

// Upload a policy
router.post('/upload', upload.single('document'), uploadPolicy);

// Get all policies
router.get('/', getPolicies);

// Get a single policy
router.get('/:id', getPolicyById);

// Delete a policy
router.delete('/:id', deletePolicy);

// Toggle bookmark
router.put('/:id/bookmark', toggleBookmark);

// Re-simplify a policy
router.post('/:id/re-simplify', reSimplifyPolicy);

module.exports = router;
```

---

## 13. Phase 9 — Frontend Setup (React + Vite + Tailwind CSS)

### Step 9.1: Initialize Frontend (if not already done)

```bash
cd frontend
npm create vite@latest ./ -- --template react
```

### Step 9.2: Install Frontend Dependencies

```bash
# Core dependencies
npm install react-router-dom axios recoil react-icons react-hot-toast

# Tailwind CSS
npm install -D tailwindcss @tailwindcss/vite
```

### Step 9.3: Tailwind CSS Configuration

#### `tailwind.config.js`

```javascript
// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        dark: {
          100: '#1e293b',
          200: '#0f172a',
          300: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
```

#### `vite.config.js`

```javascript
// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

#### `src/index.css`

```css
/* frontend/src/index.css */
@import "tailwindcss";

/* Google Font: Inter */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1e293b;
}

::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
```

### Step 9.4: Frontend `.env`

```env
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

---

## 14. Phase 10 — State Management (Recoil)

### Step 10.1: Auth Atom — `src/atoms/authAtom.js`

```javascript
// frontend/src/atoms/authAtom.js
import { atom } from 'recoil';

// Get initial auth state from localStorage
const getInitialAuthState = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      return JSON.parse(userInfo);
    }
  } catch (error) {
    localStorage.removeItem('userInfo');
  }
  return null;
};

export const authAtom = atom({
  key: 'authAtom',
  default: getInitialAuthState(),
});

export const authLoadingAtom = atom({
  key: 'authLoadingAtom',
  default: false,
});
```

### Step 10.2: Policy Atom — `src/atoms/policyAtom.js`

```javascript
// frontend/src/atoms/policyAtom.js
import { atom } from 'recoil';

export const policiesAtom = atom({
  key: 'policiesAtom',
  default: [],
});

export const selectedPolicyAtom = atom({
  key: 'selectedPolicyAtom',
  default: null,
});

export const policyLoadingAtom = atom({
  key: 'policyLoadingAtom',
  default: false,
});

export const uploadProgressAtom = atom({
  key: 'uploadProgressAtom',
  default: {
    isUploading: false,
    step: '', // 'uploading', 'extracting', 'simplifying', 'completed'
    progress: 0,
  },
});

export const dashboardStatsAtom = atom({
  key: 'dashboardStatsAtom',
  default: null,
});
```

---

## 15. Phase 11 — Frontend Pages & Components

### Step 11.1: Axios Instance — `src/api/axiosInstance.js`

```javascript
// frontend/src/api/axiosInstance.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### Step 11.2: Custom Hooks

#### `src/hooks/useAuth.js`

```javascript
// frontend/src/hooks/useAuth.js
import { useRecoilState } from 'recoil';
import { authAtom, authLoadingAtom } from '../atoms/authAtom';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const useAuth = () => {
  const [user, setUser] = useRecoilState(authAtom);
  const [loading, setLoading] = useRecoilState(authLoadingAtom);

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/register', {
        name,
        email,
        password,
      });
      if (data.success) {
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        setUser(data.data);
        toast.success('Account created successfully!');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      if (data.success) {
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        setUser(data.data);
        toast.success('Logged in successfully!');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    toast.success('Logged out');
  };

  return { user, loading, register, login, logout };
};

export default useAuth;
```

#### `src/hooks/usePolicy.js`

```javascript
// frontend/src/hooks/usePolicy.js
import { useRecoilState } from 'recoil';
import {
  policiesAtom,
  selectedPolicyAtom,
  policyLoadingAtom,
  uploadProgressAtom,
  dashboardStatsAtom,
} from '../atoms/policyAtom';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const usePolicy = () => {
  const [policies, setPolicies] = useRecoilState(policiesAtom);
  const [selectedPolicy, setSelectedPolicy] = useRecoilState(selectedPolicyAtom);
  const [loading, setLoading] = useRecoilState(policyLoadingAtom);
  const [uploadProgress, setUploadProgress] = useRecoilState(uploadProgressAtom);
  const [stats, setStats] = useRecoilState(dashboardStatsAtom);

  // Upload a new policy
  const uploadPolicy = async (file, tags = '') => {
    setUploadProgress({ isUploading: true, step: 'uploading', progress: 10 });

    try {
      const formData = new FormData();
      formData.append('document', file);
      if (tags) formData.append('tags', tags);

      setUploadProgress({ isUploading: true, step: 'uploading', progress: 30 });

      const { data } = await axiosInstance.post('/policy/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000, // 2 minute timeout for large files + AI processing
      });

      setUploadProgress({ isUploading: false, step: 'completed', progress: 100 });

      if (data.success) {
        toast.success('Policy simplified successfully!');
        return data.data;
      }
    } catch (error) {
      setUploadProgress({ isUploading: false, step: '', progress: 0 });
      toast.error(error.response?.data?.message || 'Upload failed');
      return null;
    }
  };

  // Fetch all policies
  const fetchPolicies = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/policy', { params });
      if (data.success) {
        setPolicies(data.data);
        return data;
      }
    } catch (error) {
      toast.error('Failed to fetch policies');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single policy
  const fetchPolicyById = async (id) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/policy/${id}`);
      if (data.success) {
        setSelectedPolicy(data.data);
        return data.data;
      }
    } catch (error) {
      toast.error('Failed to fetch policy details');
    } finally {
      setLoading(false);
    }
  };

  // Delete a policy
  const deletePolicy = async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/policy/${id}`);
      if (data.success) {
        setPolicies((prev) => prev.filter((p) => p._id !== id));
        toast.success('Policy deleted');
        return true;
      }
    } catch (error) {
      toast.error('Failed to delete policy');
      return false;
    }
  };

  // Toggle bookmark
  const toggleBookmark = async (id) => {
    try {
      const { data } = await axiosInstance.put(`/policy/${id}/bookmark`);
      if (data.success) {
        setPolicies((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, isBookmarked: data.data.isBookmarked } : p
          )
        );
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const { data } = await axiosInstance.get('/policy/stats');
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  return {
    policies,
    selectedPolicy,
    loading,
    uploadProgress,
    stats,
    uploadPolicy,
    fetchPolicies,
    fetchPolicyById,
    deletePolicy,
    toggleBookmark,
    fetchStats,
  };
};

export default usePolicy;
```

### Step 11.3: App Entry Point — `src/App.jsx`

```jsx
// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import PolicyDetailPage from './pages/PolicyDetailPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <div className="min-h-screen bg-dark-300 text-white font-sans">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <UploadPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/policy/:id"
                element={
                  <ProtectedRoute>
                    <PolicyDetailPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
            },
          }}
        />
      </Router>
    </RecoilRoot>
  );
}

export default App;
```

### Step 11.4: ProtectedRoute Component — `src/components/common/ProtectedRoute.jsx`

```jsx
// frontend/src/components/common/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authAtom } from '../../atoms/authAtom';

const ProtectedRoute = ({ children }) => {
  const user = useRecoilValue(authAtom);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### Step 11.5: Navbar Component — `src/components/common/Navbar.jsx`

```jsx
// frontend/src/components/common/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { HiShieldCheck, HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-dark-200/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <HiShieldCheck className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              PolicySimplifier
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-primary-500/25"
                >
                  Upload Policy
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400 text-sm">
                    Hi, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-red-400 transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-300"
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-slate-300 hover:bg-dark-100 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="block px-3 py-2 text-primary-400 hover:bg-dark-100 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  Upload Policy
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-red-400 hover:bg-dark-100 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-slate-300 hover:bg-dark-100 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-primary-400 hover:bg-dark-100 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
```

### Step 11.6: Key Page Components

#### `src/pages/HomePage.jsx` — Landing Page

```jsx
// frontend/src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { HiShieldCheck, HiDocumentText, HiLightBulb, HiCheckCircle } from 'react-icons/hi';

const HomePage = () => {
  const features = [
    {
      icon: <HiDocumentText className="h-8 w-8" />,
      title: 'Upload Any Policy',
      description:
        'Simply upload your insurance policy as a PDF or image. We support health, auto, home, life, and travel insurance documents.',
    },
    {
      icon: <HiLightBulb className="h-8 w-8" />,
      title: 'AI-Powered Simplification',
      description:
        'Our AI reads through the complex legal jargon and translates it into plain, everyday English that anyone can understand.',
    },
    {
      icon: <HiCheckCircle className="h-8 w-8" />,
      title: 'Know Your Coverage',
      description:
        'Get a clear breakdown of what\'s covered, what\'s excluded, key conditions, and potential claim pitfalls — before you need to file a claim.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-dark-300 to-accent-700/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-8">
            <HiShieldCheck className="text-primary-400" />
            <span className="text-primary-300 text-sm font-medium">
              AI-Powered Policy Analysis
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="text-white">Finally </span>
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Understand
            </span>
            <br />
            <span className="text-white">Your Insurance Policy</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Upload your insurance policy and get a clear, jargon-free summary
            in seconds. Know exactly what's covered, what's not, and what
            could affect your claims.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-primary-500/25 hover:-translate-y-0.5"
            >
              Get Started — It's Free
            </Link>
            <Link
              to="/login"
              className="border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:bg-dark-100"
            >
              I Have an Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-dark-200/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            Three simple steps to understand your insurance policy
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-dark-100 border border-slate-800 rounded-2xl p-8 hover:border-primary-500/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/5"
              >
                <div className="bg-primary-500/10 text-primary-400 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <div className="text-primary-400 text-sm font-semibold mb-2">
                  Step {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary-900/40 to-dark-100 border border-primary-500/20 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Don't Get Surprised at Claim Time
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Join thousands of policyholders who now understand exactly what
            their insurance covers — and what it doesn't.
          </p>
          <Link
            to="/register"
            className="inline-block bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-primary-500/25"
          >
            Simplify Your Policy Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
```

#### `src/pages/LoginPage.jsx`

```jsx
// frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-100 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-center mb-8">
            Log in to view your simplified policies
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-200 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-200 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/25"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-slate-400 text-center mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
```

#### `src/pages/RegisterPage.jsx`

```jsx
// frontend/src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiUser, HiMail, HiLockClosed } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const success = await register(name, email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-dark-100 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-slate-400 text-center mb-8">
            Start simplifying your insurance policies today
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-200 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-200 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-200 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="Min 6 characters"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-dark-200 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="Re-enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/25"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-slate-400 text-center mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
```

#### `src/pages/DashboardPage.jsx`

```jsx
// frontend/src/pages/DashboardPage.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiDocumentText,
  HiCheckCircle,
  HiExclamationCircle,
  HiBookmark,
  HiPlus,
} from 'react-icons/hi';
import usePolicy from '../hooks/usePolicy';
import useAuth from '../hooks/useAuth';

const StatsCard = ({ icon, title, value, color }) => (
  <div className="bg-dark-100 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
    <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-3xl font-bold">{value}</p>
    <p className="text-slate-400 text-sm mt-1">{title}</p>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const { stats, fetchStats, fetchPolicies, policies, loading } = usePolicy();

  useEffect(() => {
    fetchStats();
    fetchPolicies({ limit: 5, sortBy: 'createdAt', order: 'desc' });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Here's an overview of your insurance policies
          </p>
        </div>
        <Link
          to="/upload"
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/25"
        >
          <HiPlus />
          <span>Upload Policy</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={<HiDocumentText className="h-6 w-6 text-primary-400" />}
          title="Total Policies"
          value={stats?.totalPolicies || 0}
          color="bg-primary-500/10"
        />
        <StatsCard
          icon={<HiCheckCircle className="h-6 w-6 text-green-400" />}
          title="Simplified"
          value={stats?.completedPolicies || 0}
          color="bg-green-500/10"
        />
        <StatsCard
          icon={<HiExclamationCircle className="h-6 w-6 text-red-400" />}
          title="Failed"
          value={stats?.failedPolicies || 0}
          color="bg-red-500/10"
        />
        <StatsCard
          icon={<HiBookmark className="h-6 w-6 text-yellow-400" />}
          title="Bookmarked"
          value={stats?.bookmarkedPolicies || 0}
          color="bg-yellow-500/10"
        />
      </div>

      {/* Recent Policies */}
      <div className="bg-dark-100 border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Policies</h2>
          <Link
            to="/dashboard"
            className="text-primary-400 hover:text-primary-300 text-sm"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading...</div>
        ) : policies.length === 0 ? (
          <div className="text-center py-10">
            <HiDocumentText className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No policies uploaded yet</p>
            <Link
              to="/upload"
              className="text-primary-400 hover:text-primary-300 text-sm mt-2 inline-block"
            >
              Upload your first policy →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {policies.map((policy) => (
              <Link
                key={policy._id}
                to={`/policy/${policy._id}`}
                className="flex items-center justify-between p-4 bg-dark-200/50 hover:bg-dark-200 rounded-xl transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-500/10 p-3 rounded-lg">
                    <HiDocumentText className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary-400 transition-colors">
                      {policy.originalFileName}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {policy.simplifiedSummary?.policyType || 'Processing...'} •{' '}
                      {new Date(policy.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    policy.status === 'completed'
                      ? 'bg-green-500/10 text-green-400'
                      : policy.status === 'failed'
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}
                >
                  {policy.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
```

#### `src/pages/UploadPage.jsx`

```jsx
// frontend/src/pages/UploadPage.jsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCloudUpload, HiDocumentText, HiX } from 'react-icons/hi';
import usePolicy from '../hooks/usePolicy';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const { uploadPolicy, uploadProgress } = usePolicy();
  const navigate = useNavigate();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const result = await uploadPolicy(file, tags);
    if (result) {
      navigate(`/policy/${result._id}`);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Upload Insurance Policy</h1>
      <p className="text-slate-400 mb-8">
        Upload your policy document and we'll simplify it for you using AI.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-primary-500 bg-primary-500/5'
              : file
              ? 'border-green-500/50 bg-green-500/5'
              : 'border-slate-700 hover:border-slate-600 bg-dark-100'
          }`}
          onClick={() => document.getElementById('file-input').click()}
        >
          {file ? (
            <div className="flex items-center justify-center space-x-4">
              <HiDocumentText className="h-10 w-10 text-green-400" />
              <div className="text-left">
                <p className="font-medium text-green-400">{file.name}</p>
                <p className="text-slate-400 text-sm">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <>
              <HiCloudUpload className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 font-medium mb-1">
                Drag & drop your policy document here
              </p>
              <p className="text-slate-500 text-sm">
                or click to browse • PDF, JPEG, PNG (max 10 MB)
              </p>
            </>
          )}
          <input
            id="file-input"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.tiff"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tags (optional)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-dark-100 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            placeholder="health, family, 2025 (comma separated)"
          />
        </div>

        {/* Upload Progress */}
        {uploadProgress.isUploading && (
          <div className="bg-dark-100 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full" />
              <span className="text-primary-400 font-medium capitalize">
                {uploadProgress.step === 'uploading' && '📤 Uploading document...'}
                {uploadProgress.step === 'extracting' && '🔍 Extracting text (OCR)...'}
                {uploadProgress.step === 'simplifying' && '🤖 AI is simplifying your policy...'}
              </span>
            </div>
            <div className="w-full bg-dark-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-600 to-primary-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${uploadProgress.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || uploadProgress.isUploading}
          className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/25 text-lg"
        >
          {uploadProgress.isUploading
            ? 'Processing...'
            : 'Upload & Simplify'}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
```

#### `src/pages/PolicyDetailPage.jsx`

```jsx
// frontend/src/pages/PolicyDetailPage.jsx
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  HiCheckCircle,
  HiXCircle,
  HiExclamationTriangle,
  HiCurrencyDollar,
  HiArrowLeft,
  HiBookmark,
  HiTrash,
  HiLightBulb,
  HiShieldCheck,
  HiClipboardList,
} from 'react-icons/hi';
import usePolicy from '../hooks/usePolicy';

const SectionTitle = ({ icon, title, color }) => (
  <div className="flex items-center space-x-3 mb-4">
    <div className={`${color} p-2 rounded-lg`}>{icon}</div>
    <h2 className="text-xl font-bold">{title}</h2>
  </div>
);

const PolicyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedPolicy, fetchPolicyById, loading, deletePolicy, toggleBookmark } =
    usePolicy();

  useEffect(() => {
    fetchPolicyById(id);
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      const success = await deletePolicy(id);
      if (success) navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-10 w-10 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!selectedPolicy) {
    return (
      <div className="text-center py-20 text-slate-400">Policy not found</div>
    );
  }

  const summary = selectedPolicy.simplifiedSummary;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <HiArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {selectedPolicy.originalFileName}
            </h1>
            <p className="text-slate-400 text-sm">
              {summary?.policyType || 'Insurance Policy'} •{' '}
              {new Date(selectedPolicy.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => toggleBookmark(id)}
            className={`p-2 rounded-lg transition-colors ${
              selectedPolicy.isBookmarked
                ? 'bg-yellow-500/10 text-yellow-400'
                : 'bg-dark-100 text-slate-400 hover:text-yellow-400'
            }`}
          >
            <HiBookmark className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-dark-100 text-slate-400 hover:text-red-400 transition-colors"
          >
            <HiTrash className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Overview */}
      {summary?.overview && (
        <div className="bg-gradient-to-br from-primary-900/30 to-dark-100 border border-primary-500/20 rounded-2xl p-6 mb-6">
          <SectionTitle
            icon={<HiShieldCheck className="h-5 w-5 text-primary-400" />}
            title="Policy Overview"
            color="bg-primary-500/10"
          />
          <p className="text-slate-300 leading-relaxed">{summary.overview}</p>
        </div>
      )}

      {/* Key Numbers */}
      {summary?.keyNumbers && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(summary.keyNumbers).map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className="bg-dark-100 border border-slate-800 rounded-xl p-4 text-center"
                >
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-white font-semibold text-sm">{value}</p>
                </div>
              )
          )}
        </div>
      )}

      {/* Coverage */}
      {summary?.coverage?.length > 0 && (
        <div className="bg-dark-100 border border-slate-800 rounded-2xl p-6 mb-6">
          <SectionTitle
            icon={<HiCheckCircle className="h-5 w-5 text-green-400" />}
            title="What's Covered"
            color="bg-green-500/10"
          />
          <div className="space-y-4">
            {summary.coverage.map((item, index) => (
              <div
                key={index}
                className="border-l-2 border-green-500/50 pl-4"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-green-400">{item.item}</h3>
                  {item.limit && (
                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">
                      {item.limit}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mt-1">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exclusions */}
      {summary?.exclusions?.length > 0 && (
        <div className="bg-dark-100 border border-slate-800 rounded-2xl p-6 mb-6">
          <SectionTitle
            icon={<HiXCircle className="h-5 w-5 text-red-400" />}
            title="What's NOT Covered"
            color="bg-red-500/10"
          />
          <div className="space-y-4">
            {summary.exclusions.map((item, index) => (
              <div key={index} className="border-l-2 border-red-500/50 pl-4">
                <h3 className="font-semibold text-red-400">{item.item}</h3>
                <p className="text-slate-400 text-sm mt-1">
                  {item.description}
                </p>
                {item.impact && (
                  <p className="text-red-400/70 text-xs mt-1 italic">
                    ⚠️ Impact: {item.impact}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conditions */}
      {summary?.conditions?.length > 0 && (
        <div className="bg-dark-100 border border-slate-800 rounded-2xl p-6 mb-6">
          <SectionTitle
            icon={
              <HiExclamationTriangle className="h-5 w-5 text-yellow-400" />
            }
            title="Key Conditions"
            color="bg-yellow-500/10"
          />
          <div className="space-y-4">
            {summary.conditions.map((item, index) => (
              <div
                key={index}
                className="border-l-2 border-yellow-500/50 pl-4"
              >
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-yellow-400">
                    {item.condition}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      item.importance === 'critical'
                        ? 'bg-red-500/20 text-red-400'
                        : item.importance === 'high'
                        ? 'bg-orange-500/20 text-orange-400'
                        : item.importance === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    {item.importance}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Claim Process */}
      {summary?.claimProcess && (
        <div className="bg-dark-100 border border-slate-800 rounded-2xl p-6 mb-6">
          <SectionTitle
            icon={<HiClipboardList className="h-5 w-5 text-blue-400" />}
            title="How to File a Claim"
            color="bg-blue-500/10"
          />
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {summary.claimProcess}
          </p>
        </div>
      )}

      {/* Warnings */}
      {summary?.warnings?.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 mb-6">
          <SectionTitle
            icon={
              <HiExclamationTriangle className="h-5 w-5 text-red-400" />
            }
            title="⚠️ Important Warnings"
            color="bg-red-500/10"
          />
          <ul className="space-y-2">
            {summary.warnings.map((warning, index) => (
              <li
                key={index}
                className="flex items-start space-x-2 text-red-300 text-sm"
              >
                <span className="mt-1">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {summary?.recommendations?.length > 0 && (
        <div className="bg-accent-700/5 border border-accent-500/20 rounded-2xl p-6 mb-6">
          <SectionTitle
            icon={<HiLightBulb className="h-5 w-5 text-accent-400" />}
            title="💡 AI Recommendations"
            color="bg-accent-500/10"
          />
          <ul className="space-y-2">
            {summary.recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start space-x-2 text-accent-300 text-sm"
              >
                <span className="mt-1">✓</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PolicyDetailPage;
```

#### `src/pages/NotFoundPage.jsx`

```jsx
// frontend/src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
    <div>
      <h1 className="text-8xl font-extrabold text-primary-500 mb-4">404</h1>
      <p className="text-xl text-slate-300 mb-2">Page Not Found</p>
      <p className="text-slate-500 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl transition-all"
      >
        Go Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
```

### Step 11.7: Main Entry Point — `src/main.jsx`

```jsx
// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 16. Phase 12 — API Integration (Axios)

### Complete API Call Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND → BACKEND FLOW                       │
│                                                                  │
│  User Action       →  Hook Function  →  Axios Call  →  Backend  │
│                                                                  │
│  Click "Upload"    →  uploadPolicy() →  POST /api/policy/upload │
│  Open Dashboard    →  fetchStats()   →  GET /api/policy/stats   │
│  View All Policies →  fetchPolicies()→  GET /api/policy         │
│  View One Policy   →  fetchById()    →  GET /api/policy/:id     │
│  Delete Policy     →  deletePolicy() →  DELETE /api/policy/:id  │
│  Bookmark          →  toggleBookmark()→ PUT /api/policy/:id/bm  │
│  Login             →  login()        →  POST /api/auth/login    │
│  Register          →  register()     →  POST /api/auth/register │
│  Get Profile       →  getProfile()   →  GET /api/auth/profile   │
└──────────────────────────────────────────────────────────────────┘
```

### How JWT Token Flows

```
1. User logs in → Backend returns { ..., token: "eyJhbG..." }
2. Frontend saves token in localStorage
3. Axios interceptor reads token from localStorage
4. Every API request includes: Authorization: Bearer <token>
5. Backend middleware (authMiddleware.js) verifies token
6. If valid → req.user is populated, request proceeds
7. If invalid → 401 error → Axios interceptor redirects to /login
```

---

## 17. Phase 13 — Testing

### Step 13.1: Backend Testing Checklist

| Test | Command/Method | Expected Result |
|---|---|---|
| Server starts | `node server.js` | "🚀 Server running..." + "✅ MongoDB Connected" |
| Health check | `GET /api/health` | `{ status: "OK" }` |
| Register user | `POST /api/auth/register` | Returns user + token |
| Login user | `POST /api/auth/login` | Returns user + token |
| Get profile | `GET /api/auth/profile` (with Bearer token) | Returns user data |
| Upload policy | `POST /api/policy/upload` (multipart) | Returns simplified policy |
| Get all policies | `GET /api/policy` | Returns array of policies |
| Get one policy | `GET /api/policy/:id` | Returns single policy |
| Delete policy | `DELETE /api/policy/:id` | Success message |

### Step 13.2: Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Upload a policy (replace TOKEN with actual JWT)
curl -X POST http://localhost:5000/api/policy/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "document=@./sample-policy.pdf" \
  -F "tags=health,family"

# Get all policies
curl -X GET http://localhost:5000/api/policy \
  -H "Authorization: Bearer TOKEN"
```

### Step 13.3: Frontend Testing Checklist

| Page | Test | Expected |
|---|---|---|
| Home | Page loads | Landing page with hero + features |
| Register | Fill form + submit | Redirect to dashboard |
| Login | Enter credentials | Redirect to dashboard |
| Dashboard | Load stats | Stats cards + recent policies |
| Upload | Drag & drop file | Upload progress → redirect to detail |
| Policy Detail | View simplified | All sections rendered (coverage, exclusions, etc.) |
| Not Found | Navigate to `/random` | 404 page |
| Logout | Click logout | Redirect to home, token cleared |

---

## 18. Phase 14 — Deployment

### Step 14.1: Deploy Backend to Render (Free)

1. Go to [https://render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `insurance-simplifier-api`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** **Free**
5. Add environment variables (same as your `.env` file):
   - `NODE_ENV` = `production`
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = your secret
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your api key
   - `CLOUDINARY_API_SECRET` = your api secret
   - `GEMINI_API_KEY` = your Gemini key
   - `CLIENT_URL` = your Vercel frontend URL (set after deploying frontend)
6. Click **"Create Web Service"**
7. Note the deployed URL (e.g., `https://insurance-simplifier-api.onrender.com`)

> ⚠️ **Note:** Render free tier services spin down after 15 minutes of inactivity. The first request after idle may take 30-60 seconds.

### Step 14.2: Deploy Frontend to Vercel (Free)

1. Go to [https://vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variable:
   - `VITE_API_URL` = `https://insurance-simplifier-api.onrender.com/api` (your Render backend URL)
6. Click **"Deploy"**
7. Note the deployed URL (e.g., `https://insurance-simplifier.vercel.app`)

### Step 14.3: Post-Deployment

1. **Update Render** → Add `CLIENT_URL` env var with your Vercel URL
2. **Update MongoDB Atlas** → Ensure `0.0.0.0/0` is in the IP Access List
3. **Test the live app** end-to-end

---

## 19. Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster0...` |
| `JWT_SECRET` | Secret key for JWT signing | `mySuperSecretKey123!` |
| `JWT_EXPIRE` | JWT expiration time | `30d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `dxxxxxxxxx` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `AbCdEfGhIjKlMnOp` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 20. Complete API Documentation

### Base URL

```
Development: http://localhost:5000/api
Production:  https://your-app.onrender.com/api
```

### Authentication Endpoints

#### `POST /api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePass123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "66a1b2c3d4e5f6a7b8c9d0e1",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "",
    "policiesCount": 0,
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### `POST /api/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePass123"
}
```

**Success Response (200):** Same structure as register.

---

#### `GET /api/auth/profile`
Get the current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "66a1b2c3d4e5f6a7b8c9d0e1",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "",
    "policiesCount": 3,
    "createdAt": "2025-07-02T12:00:00.000Z"
  }
}
```

---

#### `PUT /api/auth/profile`
Update the current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body (all optional):**
```json
{
  "name": "John Updated",
  "email": "newemail@example.com",
  "password": "newPassword123"
}
```

---

### Policy Endpoints

#### `POST /api/policy/upload`
Upload a policy document for OCR + AI simplification.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
| Field | Type | Required | Description |
|---|---|---|---|
| `document` | File | Yes | PDF or image file (max 10 MB) |
| `tags` | String | No | Comma-separated tags |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Policy uploaded and simplified successfully",
  "data": {
    "_id": "...",
    "originalFileName": "health-policy.pdf",
    "fileType": "pdf",
    "fileUrl": "https://res.cloudinary.com/...",
    "status": "completed",
    "simplifiedSummary": {
      "overview": "This is a comprehensive health insurance policy...",
      "policyType": "Health Insurance",
      "coverage": [...],
      "exclusions": [...],
      "conditions": [...],
      "claimProcess": "...",
      "keyNumbers": {...},
      "warnings": [...],
      "recommendations": [...]
    }
  }
}
```

---

#### `GET /api/policy`
Get all policies for the logged-in user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
| Param | Type | Default | Description |
|---|---|---|---|
| `page` | Number | 1 | Page number |
| `limit` | Number | 10 | Items per page |
| `status` | String | — | Filter by status |
| `search` | String | — | Search by filename/type |
| `sortBy` | String | `createdAt` | Sort field |
| `order` | String | `desc` | Sort order (`asc`/`desc`) |

---

#### `GET /api/policy/stats`
Get dashboard statistics.

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalPolicies": 5,
    "completedPolicies": 4,
    "failedPolicies": 1,
    "bookmarkedPolicies": 2,
    "policyTypes": [
      { "_id": "Health Insurance", "count": 3 },
      { "_id": "Auto Insurance", "count": 2 }
    ],
    "recentPolicies": [...]
  }
}
```

---

#### `GET /api/policy/:id`
Get a single policy by ID.

---

#### `DELETE /api/policy/:id`
Delete a policy (also removes from Cloudinary).

---

#### `PUT /api/policy/:id/bookmark`
Toggle bookmark status on a policy.

---

#### `POST /api/policy/:id/re-simplify`
Re-run the AI simplification on an already-extracted policy.

---

## 📌 Quick Start Commands Summary

```bash
# 1. Clone the repo
git clone https://github.com/your-username/AI-Insurance-Policy-Simplifier.git
cd AI-Insurance-Policy-Simplifier

# 2. Setup Backend
cd backend
npm install
# Create .env file with your credentials (see Section 7.3)
node server.js

# 3. Setup Frontend (in a new terminal)
cd frontend
npm install
# Create .env file (see Section 13.4)
npm run dev

# 4. Open in browser
# http://localhost:5173
```

---

## 🎯 Future Enhancements (v2 Roadmap)

| Feature | Description |
|---|---|
| **Policy Comparison** | Compare two policies side-by-side |
| **Multi-Language Support** | Simplify policies in Hindi, Spanish, etc. |
| **Email Reports** | Send simplified summaries to email |
| **Policy Scoring** | Rate a policy's value (1-10) using AI |
| **Chat with Policy** | Ask follow-up questions about your policy |
| **Browser Extension** | Simplify policies while browsing insurance sites |
| **Premium Tier** | Higher limits, priority processing, advanced features |

---

> **Built with ❤️ using React, Node.js, MongoDB, Cloudinary, Tesseract.js, and Google Gemini AI — all on free tiers!**
