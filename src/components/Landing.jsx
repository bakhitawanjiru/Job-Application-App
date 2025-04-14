import { useNavigate } from 'react-router-dom';
import { useAuth } from './Auth';

const Landing = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4682B4]/10 via-white to-[#4682B4]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        
        <div className="text-center">
        <div className="mb-12">
            <h1 className="text-6xl font-bold text-[#4682B4] mb-4">
              Job<span className="text-green-600">Jungle</span>
            </h1>
            <p className="text-xl text-gray-600">
              Where Career Opportunities Flourish
            </p>
            </div>
  
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => navigate('/login')}
              className="bg-[#4682B4] text-white px-8 py-3 rounded-lg hover:bg-[#4682B4]/90 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-white text-[#4682B4] border-2 border-[#4682B4] px-8 py-3 rounded-lg hover:bg-gray-50 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
              >
                Sign Up
              </button>
            </div>
          </div>


      
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-[#4682B4]/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#4682B4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Jobs</h3>
            <p className="text-gray-600">Browse thousands of job opportunities from top companies</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-[#4682B4]/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#4682B4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Applications</h3>
            <p className="text-gray-600">Keep track of your job applications in one place</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-[#4682B4]/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#4682B4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Communication</h3>
            <p className="text-gray-600">Connect directly with employers and recruiters</p>
          </div>
        </div>
      </div>

     
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Job Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;