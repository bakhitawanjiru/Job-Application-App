import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import Sidebar from './Sidebar';

const Admin = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalCompanies: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, jobs, applications, companies] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'jobs')),
          getDocs(collection(db, 'applications')),
          getDocs(collection(db, 'companies'))
        ]);

        setStats({
          totalUsers: users.size,
          totalJobs: jobs.size,
          totalApplications: applications.size,
          totalCompanies: companies.size
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="flex">
        <Sidebar userType="admin" />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-[#4682B4] mb-8">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
                <p className="text-3xl font-bold text-[#4682B4] mt-2">{stats.totalUsers}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800">Total Jobs</h3>
                <p className="text-3xl font-bold text-[#4682B4] mt-2">{stats.totalJobs}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800">Applications</h3>
                <p className="text-3xl font-bold text-[#4682B4] mt-2">{stats.totalApplications}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800">Companies</h3>
                <p className="text-3xl font-bold text-[#4682B4] mt-2">{stats.totalCompanies}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;