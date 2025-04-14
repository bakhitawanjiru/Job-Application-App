import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Auth';
import { auth } from '/config/firebase';
import { signOut } from 'firebase/auth';

const Logout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate('/login');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Logging out...</h2>
        <p className="text-gray-600">Please wait while we sign you out.</p>
      </div>
    </div>
  );
};

export default Logout;