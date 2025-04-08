import { useState } from 'react';
import { useAuth } from './Auth';

const JobSeeker = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#4682B4]">Job Seeker Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {currentUser?.email}</span>
            <button className="bg-[#4682B4] text-white px-4 py-2 rounded-md hover:bg-[#4682B4]/90 transition-colors">
              Update Profile
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Search Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Jobs</h2>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Search jobs..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
              />
              <button className="bg-[#4682B4] text-white px-6 py-2 rounded-md hover:bg-[#4682B4]/90 transition-colors">
                Search
              </button>
            </div>
            
            {/* Recent Job Listings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Recent Job Listings</h3>
              <div className="border rounded-md p-4">
                <p className="text-gray-400 text-center">No jobs found</p>
              </div>
            </div>
          </div>

          {/* Dashboard Sidebar */}
          <div className="space-y-6">
            {/* Applications Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">My Applications</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Total Applications</span>
                  <span className="font-medium">{applications.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Under Review</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Interviews</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </div>

            {/* Saved Jobs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Saved Jobs</h2>
              {savedJobs.length === 0 ? (
                <p className="text-gray-400 text-center">No saved jobs</p>
              ) : (
                <div className="space-y-3">
                  {savedJobs.map((job) => (
                    <div key={job.id} className="text-sm text-gray-600">
                      {job.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeeker;