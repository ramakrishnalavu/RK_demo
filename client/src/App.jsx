import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { PrivateRoute, AdminRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import BookingConfirmation from './pages/BookingConfirmation';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import AdminShows from './pages/admin/AdminShows';
import AdminTheaters from './pages/admin/AdminTheaters';
import AdminBookings from './pages/admin/AdminBookings';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e1e2e',
              color: '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
            },
          }}
        />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies/:id" element={<MovieDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes */}
              <Route path="/seat-selection/:showId" element={
                <PrivateRoute><SeatSelection /></PrivateRoute>
              } />
              <Route path="/booking-confirmation" element={
                <PrivateRoute><BookingConfirmation /></PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute><Profile /></PrivateRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute><AdminDashboard /></AdminRoute>
              } />
              <Route path="/admin/movies" element={
                <AdminRoute><AdminMovies /></AdminRoute>
              } />
              <Route path="/admin/shows" element={
                <AdminRoute><AdminShows /></AdminRoute>
              } />
              <Route path="/admin/theaters" element={
                <AdminRoute><AdminTheaters /></AdminRoute>
              } />
              <Route path="/admin/bookings" element={
                <AdminRoute><AdminBookings /></AdminRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
