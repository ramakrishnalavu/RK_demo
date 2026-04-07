-- Run this in psql or pgAdmin before starting the backend
-- Creates the database if it doesn't exist

CREATE DATABASE moviebooking;

-- Connect to the database: \c moviebooking

-- The tables will be auto-created by Spring Boot (ddl-auto=update)
-- You can optionally insert seed data below after the app starts:

-- Insert admin user (password: admin123 bcrypt hash)
-- INSERT INTO users (name, email, password, role) VALUES
--   ('Admin', 'admin@cinebook.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lheO', 'ADMIN');

-- Insert sample theaters
-- INSERT INTO theaters (name, location, total_seats) VALUES
--   ('PVR Cinemas', 'Mumbai, Maharashtra', 200),
--   ('INOX Cinemas', 'Delhi, NCR', 180),
--   ('Cinepolis', 'Bangalore, Karnataka', 160);
