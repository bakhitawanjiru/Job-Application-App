import { useState, useEffect } from 'react';
import { useAuth } from './Auth';
import { collection, query, where, getDocs, doc, deleteDoc, addDoc,updateDoc,  getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Sidebar from './Sidebar';
import { MdLocationOn, MdAttachMoney, MdEdit, MdDelete } from 'react-icons/md';
import { BsBriefcase } from 'react-icons/bs';
import JobStatus from './JobStatus';

const Employer = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  
   
const [stats, setStats] = useState({
  totalJobs: 0,
  activeJobs: 0,
  totalApplications: 0
});


useEffect(() => {
  const fetchStats = async () => {
    try {
    
      const jobsQuery = query(
        collection(db, "jobs"),
        where("employerId", "==", currentUser.uid)
      );
      const jobsSnapshot = await getDocs(jobsQuery);
      const totalJobs = jobsSnapshot.size;

     
      const activeJobs = jobsSnapshot.docs.filter(
        doc => doc.data().status !== "inactive"
      ).length;

      
      const applicationsQuery = query(
        collection(db, "applications"),
        where("employerId", "==", currentUser.uid)
      );
      const applicationsSnapshot = await getDocs(applicationsQuery);

      setStats({
        totalJobs,
        activeJobs,
        totalApplications: applicationsSnapshot.size
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  fetchStats();
}, [currentUser, jobs]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    type: 'full-time',
    requirements: '',
    status: 'active'
  });

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [currentUser]);

  const fetchJobs = async () => {
    try {
      const q = query(
        collection(db, 'jobs'),
        where('employerId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const jobsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobs(jobsData);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
     
      const applicationsQuery = query(
        collection(db, 'applications'),
        where('employerId', '==', currentUser.uid)
      );
      const applicationsSnapshot = await getDocs(applicationsQuery);
      
      setStats({
        totalJobs: jobs.length,
        activeJobs: jobs.filter(job => job.status === 'active').length,
        totalApplications: applicationsSnapshot.size
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const companyQuery = query(
        collection(db, "companies"),
        where("employerId", "==", currentUser.uid)
      );
      const companyRef = doc(db, "public_companies", currentUser.uid);
    const companySnap = await getDoc(companyRef);
    const companyData = companySnap.exists() ? companySnap.data() : null;

    const jobData = {
      ...newJob,
      employerId: currentUser.uid,
      createdAt: new Date().toISOString(),
      status: 'active',
      company: companyData ? {
        name: companyData.name,
        location: companyData.location,
        description: companyData.description,
        logo: companyData.logo || null,
        website: companyData.website || null
      } : null
    };
      const docRef = await addDoc(collection(db, "jobs"), jobData);
      
     
      setJobs([...jobs, { ...jobData, id: docRef.id }]);
      
     
      setStats(prev => ({
        ...prev,
        totalJobs: prev.totalJobs + 1,
        activeJobs: prev.activeJobs + 1
      }));
  
      setIsModalOpen(false);
      setNewJob({
        title: "",
        description: "",
        location: "",
        salary: "",
        type: "full-time",
        requirements: ""
      });
  
    
      const successMessage = document.createElement("div");
      successMessage.className = "fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded";
      successMessage.innerText = "Job posted successfully!";
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
    } catch (err) {
      console.error("Error creating job:", err);
      setError("Failed to create job");
    }
  };
  const handleEditJob = (job) => {
    try {
      setEditingJob(job);
      setNewJob({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        salary: job.salary || '',
        type: job.type || 'full-time',
        requirements: job.requirements || '',
        status: job.status || 'active'
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error setting up edit mode:', err);
      setError('Failed to edit job');
    }
  };
  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      const jobRef = doc(db, 'jobs', editingJob.id);
      const jobData = {
        ...newJob,
        company: existingJob.company,
        updatedAt: new Date().toISOString()
      };
  
      await updateDoc(jobRef, jobData);
      
   
      setJobs(jobs.map(job => 
        job.id === editingJob.id ? { id: job.id, ...jobData } : job
      ));
      
     
      setIsModalOpen(false);
      setEditingJob(null);
      setNewJob({
        title: '',
        description: '',
        location: '',
        salary: '',
        type: 'full-time',
        requirements: '',
        status: 'active'
      });
      
     
      const successMessage = document.createElement("div");
    successMessage.className = "fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded";
    successMessage.innerText = "Job updated successfully!";
    document.body.appendChild(successMessage);
    setTimeout(() => successMessage.remove(), 3000);

    fetchStats();
  } catch (err) {
    console.error('Failed to update job:', err);
    setError('Failed to update job: ' + err.message);
  }
};
  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteDoc(doc(db, "jobs", jobId));
        setJobs(jobs.filter(job => job.id !== jobId));
        
        
        setStats(prev => ({
          ...prev,
          totalJobs: prev.totalJobs - 1,
          activeJobs: prev.activeJobs - 1
        }));
      } catch (err) {
        console.error("Error deleting job:", err);
        setError("Failed to delete job");
      }
    }
  };
  
      
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="flex">
        <Sidebar userType="employer" />
 
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-[#4682B4]">Employer Dashboard</h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#4682B4] text-white px-4 py-2 rounded-md hover:bg-[#4682B4]/90"
              >
                Post New Job
              </button>
            </div>

         
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800">Total Jobs</h3>
                <p className="text-3xl font-bold text-[#4682B4] mt-2">{stats.totalJobs}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800">Active Jobs</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeJobs}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800">Total Applications</h3>
                <p className="text-3xl font-bold text-[#4682B4] mt-2">{stats.totalApplications}</p>
              </div>
            </div>

           
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Posted Jobs</h2>
              
              {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center py-4">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <div className="text-center text-gray-500">
                  No jobs posted yet. Click "Post New Job" to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map(job => (
                    <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                          <p className="text-gray-600 mt-1">{job.description}</p>
                        </div>
                       
                        <div className="flex items-center gap-2">
                        <JobStatus jobId={job.id} />
                        <button
    onClick={() => {
      try {
        handleEditJob(job);
      } catch (err) {
        console.error('Error clicking edit:', err);
        setError('Failed to start editing');
      }
    }}
    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
  >
    <MdEdit className="text-xl" />
  </button>
  <button
    onClick={() => {
      try {
        handleDeleteJob(job.id);
      } catch (err) {
        console.error('Error clicking delete:', err);
        setError('Failed to delete job');
      }
    }}
    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
  >
    <MdDelete className="text-xl" />
  </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MdLocationOn className="mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <MdAttachMoney className="mr-1" />
                          {job.salary}
                        </span>
                        <span className="flex items-center">
                          <BsBriefcase className="mr-1" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div className="mt-3">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
  {editingJob ? 'Edit Job' : 'Post New Job'}
</h3>
<form onSubmit={editingJob ? handleUpdateJob : handleCreateJob} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              value={newJob.title}
              onChange={(e) => setNewJob({...newJob, title: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newJob.description}
              onChange={(e) => setNewJob({...newJob, description: e.target.value})}
              rows="3"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={newJob.location}
              onChange={(e) => setNewJob({...newJob, location: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Salary</label>
            <input
              type="text"
              value={newJob.salary}
              onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Type</label>
            <select
              value={newJob.type}
              onChange={(e) => setNewJob({...newJob, type: e.target.value})}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Requirements</label>
            <textarea
              value={newJob.requirements}
              onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
              rows="3"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
    <button
      type="button"
      onClick={() => {
        setIsModalOpen(false);
        setEditingJob(null);
        setNewJob({
          title: '',
          description: '',
          location: '',
          salary: '',
          type: 'full-time',
          requirements: '',
          status: 'active'
        });
      }}
      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
    >
      Cancel </button>
    <button
      type="submit"
      className="px-4 py-2 bg-[#4682B4] text-white rounded-md hover:bg-[#4682B4]/90"
    >
      {editingJob ? 'Update Job' : 'Create Job'}
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

export default Employer;