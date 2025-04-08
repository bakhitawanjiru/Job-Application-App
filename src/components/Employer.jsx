import { useState } from 'react';
import { useAuth } from './Auth';

const Employer = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#4682B4] mb-8">Employer Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome, {currentUser?.email}</h2>
            {/* Add your employer dashboard content here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employer;  // This line is crucial - it adds the default export