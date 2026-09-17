# Vertex - Smart Farming, Elevated Growth

Vertex is a comprehensive full-stack platform designed to empower farmers with data-driven insights, community connection, and smart resource management.

## 🏗️ Architecture

- **Frontend:** React 18 (Vite), Tailwind CSS, Lucide Icons, Firebase SDK.
- **Backend:** Node.js, Express.js, Firebase Admin SDK.
- **Databases:**
  - **PostgreSQL:** User profiles and structured farm data (Sequelize).
  - **MongoDB:** Social feed posts and crop encyclopedia (Mongoose).
  - **Redis:** Weather data caching and session optimization.
- **Cloud Services:**
  - **Firebase Auth:** Google & Email/Password authentication.
  - **AWS S3:** Scalable image storage for posts and crop data.
  - **OpenWeatherMap:** Real-time weather intelligence.

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for databases)

### 2. Database Setup
Start the databases using Docker:
```bash
docker-compose up -d
```
This will start PostgreSQL, MongoDB, and Redis on their default ports.

### 3. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database with initial crop data:
   ```bash
   npm run seed
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 4. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🛠️ Key Features

- ✅ **Smart Dashbord:** Personalized weather alerts and farm stats.
- ✅ **Crop Recommendations:** Soil-based matching algorithm.
- ✅ **FarmFeed:** Community social wall with image sharing (S3 backed).
- ✅ **Secure Auth:** Firebase-powered Google and Email login.
- ✅ **Weather Intelligence:** Real-time data with Redis-powered caching for performance.

## 📁 Project Structure

- `/frontend/src`: React frontend components and logic.
- `/backend/src`: Node.js/Express backend.
  - `/config`: Database and service initializations.
  - `/controllers`: Request handling logic.
  - `/models`: Database schemas (Postgres & Mongo).
  - `/services`: Third-party API integrations (Weather, S3, etc.).
- `docker-compose.yml`: Database orchestration.