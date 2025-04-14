import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '/config/firebase';
import { useNavigate } from 'react-router-dom';

const ADMIN_CREDENTIALS = {
  email: 'admin@jobjungle.com',
  password: 'admin123'
};
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Login attempt with:', email);

    try {
      // Check for admin credentials first
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        console.log('Admin login successful');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('isAdmin', 'true'); // Add additional flag
        navigate('/admin-dashboard', { replace: true });
        return;
      }

      // Regular user authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      if (userData) {
        localStorage.setItem('userRole', userData.userType);
        
        // Navigate based on user type
        if (userData.userType === 'employer') {
          navigate('/employer-dashboard', { replace: true });
        } else {
          navigate('/jobseeker-dashboard', { replace: true });
        }
      } else {
        throw new Error('User data not found');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  
    const handleLogin = async (e) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
    
      try {
      
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        
          localStorage.setItem('userRole', 'admin');
          navigate('/admin-dashboard');
          return;
        }
    
     
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
      
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
      
        if (userData) {
          localStorage.setItem('userRole', userData.userType);
        }
    
        
        if (userData?.role === 'employer') {
          navigate('/employer-dashboard');
        } else {
          navigate('/jobseeker-dashboard');
        }
    
      } catch (err) {
        console.error('Login error:', err);
        setError('Failed to log in: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-[#4682B4] mb-2">Welcome Back</h2>
          <p className="text-center text-gray-600">Please sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4] transition duration-150 ease-in-out"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4] transition duration-150 ease-in-out"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-[#4682B4] text-white py-3 px-4 rounded-md hover:bg-[#4682B4]/90 focus:outline-none focus:ring-2 focus:ring-[#4682B4] focus:ring-offset-2 transition duration-150 ease-in-out transform hover:-translate-y-0.5"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-[#4682B4] hover:text-[#4682B4]/80">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;