import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc ,where  } from 'firebase/firestore';
import { db } from '/config/firebase';
import { useAuth } from './Auth';
import Sidebar from './Sidebar';
import { MdEmail, MdPhone } from 'react-icons/md';

const Applications = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const q = query(collection(db, "applications"), where("employerId", "==", currentUser.uid)
      );
        const querySnapshot = await getDocs(q);
        const applicationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched applications:", applicationsData); 
        setApplications(applicationsData);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [currentUser]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const applicationRef = doc(db, "applications", applicationId);
      await updateDoc(applicationRef, { status: newStatus });
      
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error("Error updating application status:", err);
      setError("Failed to update application status");
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setIsViewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="flex">
        <Sidebar userType="employer" />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-[#4682B4] mb-8">Job Applications</h1>

            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-4">Loading applications...</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => (
                      <tr key={application.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{application.jobTitle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(application.appliedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            application.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : application.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {application.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(application)}
                            className="text-[#4682B4] hover:text-[#4682B4]/80 mr-3"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'accepted')}
                            className="text-green-600 hover:text-green-900 mr-3"
                            disabled={application.status === 'accepted'}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                            disabled={application.status === 'rejected'}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {isViewModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Application Details
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Job Title</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedApplication.jobTitle}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Applicant Information</h4>
                  <div className="mt-1 text-sm text-gray-900">
                    <p>{selectedApplication.applicantName}</p>
                    <p className="flex items-center mt-1">
                      <MdEmail className="mr-2" /> {selectedApplication.applicantEmail}
                    </p>
                    <p className="flex items-center mt-1">
                      <MdPhone className="mr-2" /> {selectedApplication.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Experience</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedApplication.experience}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Skills</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedApplication.skills}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Cover Letter</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedApplication.coverLetter}</p>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;