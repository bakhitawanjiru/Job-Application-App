import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './Auth';
import Sidebar from './Sidebar';
import { MdLocationOn, MdAttachMoney, MdDelete } from 'react-icons/md';
import { BsBriefcase } from 'react-icons/bs';

const SavedJobs = () => {
  const { currentUser } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const q = query(
          collection(db, "savedJobs"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        setSavedJobs(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
        );
      } catch (err) {
        console.error("Failed to fetch saved jobs:", err);
        setError("Failed to load saved jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [currentUser]);

  const handleRemove = async (savedJobId) => {
    try {
      await deleteDoc(doc(db, "savedJobs", savedJobId));
      setSavedJobs(savedJobs.filter(job => job.id !== savedJobId));
    } catch (err) {
      console.error("Error removing saved job:", err);
      setError("Failed to remove job");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="flex">
        <Sidebar userType="jobseeker" />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-[#4682B4] mb-8">Saved Jobs</h1>
            
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid gap-6">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : savedJobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                  No saved jobs found
                </div>
              ) : (
                savedJobs.map((saved) => {
                  const job = saved.jobData;
                  return (
                    <div key={saved.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {job.title}
                        </h2>
                        <button
                          onClick={() => handleRemove(saved.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <MdDelete className="w-6 h-6" />
                        </button>
                      </div>
                      {/* Rest of your job card content */}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;