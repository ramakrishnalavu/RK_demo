import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children }) {
  const { isAuthenticated } = useSelector(s => s.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector(s => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
}
