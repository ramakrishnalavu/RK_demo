import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('movieToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// Movies
export const fetchMovies = (params) => api.get('/movies', { params });
export const fetchMovieById = (id) => api.get(`/movies/${id}`);
export const createMovie = (data) => api.post('/admin/movies', data);
export const updateMovie = (id, data) => api.put(`/admin/movies/${id}`, data);
export const deleteMovie = (id) => api.delete(`/admin/movies/${id}`);

// Shows
export const fetchShows = (params) => api.get('/shows', { params });
export const fetchShowById = (id) => api.get(`/shows/${id}`);
export const fetchSeatsByShow = (id) => api.get(`/shows/${id}/seats`);
export const createShow = (data) => api.post('/admin/shows', data);
export const updateShow = (id, data) => api.put(`/admin/shows/${id}`, data);
export const deleteShow = (id) => api.delete(`/admin/shows/${id}`);

// Theaters
export const fetchTheaters = () => api.get('/theaters');
export const createTheater = (data) => api.post('/admin/theaters', data);
export const updateTheater = (id, data) => api.put(`/admin/theaters/${id}`, data);
export const deleteTheater = (id) => api.delete(`/admin/theaters/${id}`);

// Bookings
export const createBooking = (data) => api.post('/bookings', data);
export const fetchMyBookings = () => api.get('/bookings/my');
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);

// Admin
export const fetchDashboardStats = () => api.get('/admin/dashboard');
export const fetchAllBookings = () => api.get('/admin/bookings');
export const fetchAllUsers = () => api.get('/admin/users');

export default api;
