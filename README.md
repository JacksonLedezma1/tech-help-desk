# Tech Help Desk API

**Coder:** Jackson Ledezma  
**Clan:** Ubuntu

System for managing technical support tickets, built with **NestJS**, **TypeORM**, and **PostgreSQL**. It includes authentication via **JWT**, role-based access control (RBAC), and containerization with **Docker**.

---

## 📋 Table of Contents
1. [Technologies](#-technologies)
2. [Features](#-features)
3. [Prerequisites](#-prerequisites)
4. [Installation & Setup](#-installation--setup)
    - [Running Locally](#running-locally)
    - [Running with Docker](#running-with-docker)
5. [Environment Variables](#-environment-variables)
6. [Database Seeding](#-database-seeding)
7. [API Documentation](#-api-documentation)
8. [Testing](#-testing)

---

## 🚀 Technologies
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (JSON Web Tokens)
- **Documentation:** Swagger (OpenAPI)
- **Containerization:** Docker & Docker Compose

---

## ✨ Features
- **Authentication & Authorization**: Secure login with JWT.
- **Roles**:
    - **Administrador**: Full access to all resources (Users, Clients, Technicians, Categories, Tickets).
    - **Técnico**: Can view assigned tickets and update their status.
    - **Cliente**: Can create tickets and view their own history.
- **Ticket Management**: Complete workflow (Open -> In Progress -> Resolved -> Closed).
- **Standardized Responses**: All endpoints return a standard format `{ success, data, message }`.
- **Validation**: Strict data validation using DTOs.

---

## 🛠 Prerequisites
- Node.js (v18+)
- npm
- Docker & Docker Compose (optional, for containerized deployment)
- PostgreSQL (if running locally without Docker)

---

## ⚙ Installation & Setup

### Running Locally

1. **Clone the repository** (if applicable) and navigate to the project directory.

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and adjust the values.
   ```bash
   cp .env.example .env
   ```

4. **Start the Database**: Ensure you have a PostgreSQL instance running matching your `.env` configuration.

5. **Run the Application**:
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

### Running with Docker

1. **Configure Environment Variables**:
   Ensure your `.env` file exists. For Docker, set `DB_HOST=db`.

2. **Build and Run**:
   ```bash
   docker compose up -d --build
   ```
  To view logs:
   ```bash
   docker logs -f nest-api
   ```
   The API will be available at `http://localhost:5000`.

---

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
DB_HOST=localhost       # Or 'db' if using Docker
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=tech_help_desk
JWT_SECRET=your_secure_secret
PORT=5000
NODE_ENV=development
```

---

## 🌱 Database Seeding

Populate the database with initial test data (Roles, Categories, Users, etc.).

**Locally:**
```bash
npm run seed
```

**Data Created:**
- **Users**:
  - Admin: `admin@seed.com` / `Admin123!`
  - Technician: `tech@seed.com` / `Tech123!`
  - Client: `client@seed.com` / `Client123!`
- **Categories**: Hardware (Seed), Software (Seed)
- **Clients**: Acme Corp, Globex
- **Technicians**: María López, Juan Pérez

---

## 📖 API Documentation

**Swagger UI**:  
Interactive documentation is available at:  
`http://localhost:5000/api/docs` (or `http://localhost:3000/api/docs` if running locally on port 3000).

### Key Endpoints (Examples)

**Authentication**
- `POST /auth/register`
```json
{
  "email": "curl.user@example.com",
  "password": "Pass123!",
  "name": "User Curl",
  "role": "client",
  "company": "Curl Corp"
}
```
- `POST /auth/login`
```json
{ "email": "curl.user@example.com", "password": "Pass123!" }
```
- `GET /auth/profile` (Requires Bearer Token)

**Tickets**
- **Create** (Cliente/Admin): `POST /tickets`
```json
{ "title": "Printer Curl", "description": "Error Curl", "categoryId": "<uuid>", "clientId": "<uuid>", "priority": "high" }
```
- **Change Status** (Téc/Admin): `PATCH /tickets/:id/status`
```json
{ "status": "in_progress" }
```
- **Assign Technician** (Admin): `PATCH /tickets/:id/assign`
```json
{ "technicianId": "<uuid-tecnico>" }
```
- **Update Ticket** (Admin/Téc): `PATCH /tickets/:id`
```json
{ "title": "Ticket Curl Updated", "priority": "medium" }
```
- **List All** (Admin): `GET /tickets`
- **My Tickets** (Cliente/Admin): `GET /tickets/my-tickets`
- **Assigned Tickets** (Téc/Admin): `GET /tickets/assigned`

**Users (Admin Only)**
- **Create**: `POST /users`
```json
{ "email": "curl.admin@example.com", "password": "Pass123!", "name": "Admin Curl", "role": "admin" }
```
- **Update**: `PATCH /users/:id`
```json
{ "name": "Admin Curl Updated", "role": "technician" }
```

**Clients (Admin Only)**
- **Create**: `POST /clients`
```json
{ "name": "Client Curl", "company": "Curl Inc", "contactEmail": "contact@curl-inc.com" }
```
- **Update**: `PATCH /clients/:id`
```json
{ "company": "Curl Inc Updated" }
```

**Technicians (Admin Only)**
- **Create**: `POST /technicians`
```json
{ "name": "Tech Curl", "specialty": "Linux", "availability": true }
```
- **Update**: `PATCH /technicians/:id`
```json
{ "availability": false }
```

**Categories (Admin Only)**
- **Create**: `POST /categories`
```json
{ "name": "Hardware Curl", "description": "Physical issues Curl" }
```
- **Update**: `PATCH /categories/:id`
```json
{ "description": "Update desc" }
```

---

## 🧪 Testing

Run the test suite to verify functionality.

```bash
# Unit tests
npm test

# Test coverage
npm run test:cov
```
