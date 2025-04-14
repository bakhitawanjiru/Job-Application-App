import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Path = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    console.log('Current role:', userRole);
    console.log('Required role:', requiredRole);

    if (!userRole) {
      navigate('/', { replace: true });
      return;
    }


    if (requiredRole === 'admin' && userRole === 'admin') {
      return; 
    }

    if (userRole !== requiredRole) {
    
      switch (userRole) {
        case 'admin':
          navigate('/admin-dashboard', { replace: true });
          break;
        case 'employer':
          navigate('/employer-dashboard', { replace: true });
          break;
        case 'jobseeker':
          navigate('/jobseeker-dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    }
  }, [userRole, requiredRole, navigate]);

  return children;
};

export default Path;