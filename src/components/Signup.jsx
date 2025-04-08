import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "/config/firebase";  
import { useNavigate } from "react-router-dom";


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('jobseeker');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user type in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        userType: userType,
        createdAt: new Date().toISOString()
      });

      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-[#4682B4] mb-2">Create Account</h2>
          <p className="text-center text-gray-600">Sign up to get started</p>
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
                required
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">I am a:</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4682B4] text-white py-3 px-4 rounded-md hover:bg-[#4682B4]/90 focus:outline-none focus:ring-2 focus:ring-[#4682B4] focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-[#4682B4] hover:text-[#4682B4]/80">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;