import { Navigate } from 'react-router-dom';
import { useAuth } from './Auth';

const Path = ({ children, requiredRole }) => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default Path;