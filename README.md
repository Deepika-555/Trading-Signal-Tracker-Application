# Trading Signal Tracker

A full-stack Trading Signal Tracking Application built with React, Node.js, Express, and PostgreSQL. The application allows users to create trading signals, monitor their performance using live market prices, track ROI, and automatically update signal status based on predefined business rules.

---

# Technology Stack

## Frontend

* React.js
* Material UI (MUI)
* React Query
* Axios
* React Hot Toast

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL

## External Service

* Binance Public Market API

---

# Setup Instructions

## Prerequisites

Install:

* Node.js (v18+)
* PostgreSQL (v14+)
* Git

---

## Clone Repository

```bash
git clone <repository-url>
cd trading-signal-tracker
```

---

# Backend Setup

Navigate to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=trading_tracker
DB_USER=postgres
DB_PASSWORD=your_password
```

Start server:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:3000
```

---

# Frontend Setup

Navigate to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

# Database Setup

Create database:

```sql
CREATE DATABASE trading_tracker;
```

Connect to database and execute:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    symbol VARCHAR(20) NOT NULL,

    direction VARCHAR(10)
    CHECK(direction IN ('BUY','SELL')),

    entry_price DECIMAL(18,8) NOT NULL,

    stop_loss DECIMAL(18,8) NOT NULL,

    target_price DECIMAL(18,8) NOT NULL,

    entry_time TIMESTAMP NOT NULL,

    expiry_time TIMESTAMP NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    status VARCHAR(20) DEFAULT 'OPEN',

    realized_roi DECIMAL(10,2)
);
```

---

# Business Rules

## BUY Signals

```text
Stop Loss < Entry Price
Target Price > Entry Price
```

### Target Hit

```text
Current Price >= Target Price
```

### Stop Loss Hit

```text
Current Price <= Stop Loss
```

---

## SELL Signals

```text
Stop Loss > Entry Price
Target Price < Entry Price
```

### Target Hit

```text
Current Price <= Target Price
```

### Stop Loss Hit

```text
Current Price >= Stop Loss
```

---

## Time Validation

```text
Expiry Time > Entry Time
```

```text
Entry Time can be up to 24 hours in the past
```

---

# ROI Calculation

### BUY

```text
ROI = ((Current Price - Entry Price) / Entry Price) × 100
```

### SELL

```text
ROI = ((Entry Price - Current Price) / Entry Price) × 100
```

ROI is displayed with 2 decimal precision.

---

# API Documentation

Base URL:

```text
http://localhost:3000/api/signals
```

---

## Create Signal

### Endpoint

```http
POST /api/signals
```

### Request Body

```json
{
  "symbol": "BTCUSDT",
  "direction": "BUY",
  "entry_price": 100000,
  "stop_loss": 95000,
  "target_price": 110000,
  "entry_time": "2026-06-01T10:00:00Z",
  "expiry_time": "2026-06-02T10:00:00Z"
}
```

### Success Response

```json
{
  "success": true,
  "data": {}
}
```

---

## Get All Signals

### Endpoint

```http
GET /api/signals
```

### Response

```json
{
  "success": true,
  "data": []
}
```

---

## Get Signal By ID

### Endpoint

```http
GET /api/signals/:id
```

### Response

```json
{
  "success": true,
  "data": {}
}
```

---

## Delete Signal

### Endpoint

```http
DELETE /api/signals/:id
```

### Response

```json
{
  "success": true,
  "message": "Signal deleted successfully"
}
```

---

## Get Live Signal Status

### Endpoint

```http
GET /api/signals/:id/status
```

### Response

```json
{
  "success": true,
  "data": {
    "current_price": 108500,
    "status": "OPEN",
    "roi": 8.50
  }
}
```

---

# Application Architecture

## Overview

The application follows a layered architecture that separates concerns into independent modules. This makes the system easier to maintain, test, and scale.

```text
Frontend (React)
        │
        ▼
REST API (Express)
        │
        ▼
Controllers
        │
        ▼
Services
        │
 ┌──────┴──────┐
 ▼             ▼
PostgreSQL   Binance API
```

---

## Frontend Layer

The React frontend provides:

* Signal Creation Form
* Validation Feedback
* Signal Dashboard
* Status Badges
* ROI Calculation Display
* Auto Refresh every 15 seconds

React Query is used for:

* Data Fetching
* Polling
* Caching
* Automatic Refetching

---

## Controller Layer

Controllers handle:

* Request validation
* Business rule enforcement
* HTTP responses
* Error handling

Controllers never directly access the database.

---

## Service Layer

Services contain business logic:

* Signal creation
* Database operations
* Status calculations
* ROI calculations
* Live price integration

This keeps controllers lightweight and maintainable.

---

## Database Layer

PostgreSQL stores:

* Signal details
* Trading parameters
* Status information
* Historical records

UUIDs are used for unique identification and future scalability.

---

## External Integration

The application retrieves live prices from Binance Market API.

Example:

```text
https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
```

Live prices are used to:

* Determine signal status
* Calculate ROI
* Update dashboard information

---

# Frontend Features

* Responsive Design
* Material UI Components
* Dark Trading Dashboard Theme
* Validation Feedback
* Toast Notifications
* Loading Skeletons
* Delete Signal Functionality
* Status Color Badges
* Auto Refresh every 15 seconds

---

# Future Enhancements

* Authentication & Authorization
* WebSocket Live Updates
* Signal Editing
* Historical Analytics
* Redis Caching
* Multi-User Support
* Portfolio Tracking
* Binance WebSocket Integration

---

# Author

Deepika Jaiswal

Full Stack Developer (MERN / PostgreSQL)
