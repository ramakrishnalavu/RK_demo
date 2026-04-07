# 🎬 CineBook — Movie Ticket Booking Application

A full-stack movie ticket booking platform built with:
- **Backend**: Java 17 + Spring Boot 3.2 + Spring Security + JWT + PostgreSQL
- **Frontend**: React + Vite + Tailwind CSS v4 + Redux Toolkit + React Router DOM

---

## 📁 Project Structure

```
RK_demo/
├── demo/                    # Spring Boot Backend
│   └── src/main/java/com/example/demo/
│       ├── config/          # SecurityConfig
│       ├── controller/      # REST API Controllers
│       ├── dto/             # Request/Response DTOs
│       ├── exception/       # GlobalExceptionHandler
│       ├── model/           # JPA Entities
│       ├── repository/      # Spring Data JPA Repos
│       ├── security/        # JWT Util + Filter
│       └── service/         # Business Logic
├── client/                  # React Frontend
│   └── src/
│       ├── api/             # Axios API layer
│       ├── components/      # Reusable components
│       ├── pages/           # Route-level screens
│       ├── redux/           # Store + Slices
│       └── App.jsx          # Routes
└── database_setup.sql       # DB creation script
```

---

## 🚀 Getting Started

### 1. PostgreSQL Setup

Make sure PostgreSQL is running, then:
```sql
CREATE DATABASE moviebooking;
```

Default credentials (update in `application.properties` if needed):
- Host: `localhost:5432`
- DB: `moviebooking`  
- User: `postgres`  
- Password: `postgres`

### 2. Create Admin User

After first run, connect to the DB and run:
```sql
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@cinebook.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lheO', 'ADMIN');
```
> Password is: `admin123`

### 3. Start Backend

```powershell
cd demo
./mvnw spring-boot:run
```
Backend runs on: `http://localhost:8080`

### 4. Start Frontend

```powershell
cd client
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🔗 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login + get JWT |
| GET | `/api/movies` | Public | List movies (with filters) |
| GET | `/api/movies/{id}` | Public | Movie details |
| GET | `/api/shows?movieId=&date=` | Public | Shows for a movie |
| GET | `/api/shows/{id}/seats` | Public | Seat availability |
| POST | `/api/bookings` | User | Create booking |
| GET | `/api/bookings/my` | User | My bookings |
| PUT | `/api/bookings/{id}/cancel` | User | Cancel booking |
| POST | `/api/admin/movies` | Admin | Add movie |
| PUT | `/api/admin/movies/{id}` | Admin | Update movie |
| DELETE | `/api/admin/movies/{id}` | Admin | Delete movie |
| POST | `/api/admin/shows` | Admin | Schedule show |
| POST | `/api/admin/theaters` | Admin | Add theater |
| GET | `/api/admin/dashboard` | Admin | Stats |

---

## ✨ Features

**User Side**
- 🎥 Browse movies with Genre / Language / Year filters
- 🔍 Search by movie title
- 🎭 Movie details with cast, rating, duration
- 📅 Date-based show selection
- 💺 Visual seat grid (VIP / Premium / Standard color-coded)
- 💳 Instant booking confirmation
- 👤 Booking history + 1-hour cancellation policy

**Admin Side**
- 📊 Dashboard with stats (users, movies, revenue)
- 🎬 Add / Edit / Delete movies
- 📅 Schedule shows (movie + theater + date + time + price)
- 🏛️ Manage theaters
- 📋 View all bookings with status filter

---

## 🏗️ Architecture Notes

- JWT stored in `localStorage`, attached via Axios interceptor
- Seats auto-generated on show creation (rows A-H, labeled VIP/PREMIUM/STANDARD)
- Seat booking is transactional — concurrent locks prevent double-booking
- Cancellation policy enforced on both frontend and backend (1 hour before show)
