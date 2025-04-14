import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '/config/firebase';
import { useAuth } from './Auth';
import Sidebar from './Sidebar';
import { MdLocationOn, MdAttachMoney } from 'react-icons/md';
import { BsBriefcase } from 'react-icons/bs';

const MyApplications = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const q = query(
          collection(db, "applications"),
          where("applicantId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const applicationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Fetched applications:", applicationsData);
        setApplications(applicationsData);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load your applications");
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="flex">
        <Sidebar userType="jobseeker" />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-[#4682B4] mb-8">My Applications</h1>

            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-4">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                You haven't applied to any jobs yet
              </div>
            ) : (
              <div className="grid gap-6">
                {applications.map((application) => (
                  <div key={application.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                          {application.jobTitle}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Applied on: {new Date(application.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        application.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : application.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Your Application</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <strong>Experience:</strong> {application.experience}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Cover Letter:</strong> {application.coverLetter}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;