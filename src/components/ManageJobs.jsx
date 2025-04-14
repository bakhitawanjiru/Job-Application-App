import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '/config/firebase';
import Sidebar from './Sidebar';
import { useNavigate, Link } from 'react-router-dom';
import { MdDelete, MdEdit, MdWork, MdArrowBack } from 'react-icons/md';

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    salary: '',
    status: 'active'
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsQuery = query(collection(db, 'jobs'));
        const querySnapshot = await getDocs(jobsQuery);
        
        const jobsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setJobs(jobsData);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleEdit = (job) => {
    setEditingJob(job);
    setEditForm({
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      type: job.type || '',
      salary: job.salary || '',
      status: job.status || 'active'
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      const jobRef = doc(db, 'jobs', editingJob.id);
      await updateDoc(jobRef, editForm);
      
      setJobs(jobs.map(job => 
        job.id === editingJob.id ? { ...job, ...editForm } : job
      ));
      
      setIsEditModalOpen(false);
      setEditingJob(null);
    } catch (err) {
      console.error('Error updating job:', err);
      setError('Failed to update job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteDoc(doc(db, 'jobs', jobId));
        setJobs(jobs.filter(job => job.id !== jobId));
      } catch (err) {
        console.error('Error deleting job:', err);
        setError('Failed to delete job');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="flex">
        <Sidebar userType="admin" />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav className="mb-4 text-sm" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link to="/admin-dashboard" className="text-[#4682B4] hover:text-[#4682B4]/80">
                    Dashboard
                  </Link>
                </li>
                <li className="text-gray-500">/</li>
                <li className="text-gray-600">Manage Jobs</li>
              </ol>
            </nav>

            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-[#4682B4]">Manage Jobs</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/admin-dashboard')}
                  className="flex items-center px-4 py-2 text-sm text-[#4682B4] hover:bg-[#4682B4]/10 rounded-md"
                >
                  <MdArrowBack className="mr-2" />
                  Back to Dashboard
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-4">Loading jobs...</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Title
                      </th>
                      
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Salary
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MdWork className="text-gray-500 mr-2 text-xl" />
                            <div className="text-sm font-medium text-gray-900">
                              {job.title}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.salary}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(job)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <MdEdit className="text-xl" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <MdDelete className="text-xl" />
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

      {isEditModalOpen && editingJob && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Job
              </h3>
              <form onSubmit={handleUpdateJob} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    required
                  />
                </div>

                

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                  >
                    <option value="full-time">full Time</option>
                    <option value="part-time">part Time</option>
                   
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Salary
                  </label>
                  <input
                    type="text"
                    value={editForm.salary}
                    onChange={(e) => setEditForm({...editForm, salary: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4682B4] text-white rounded-md hover:bg-[#4682B4]/90"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;