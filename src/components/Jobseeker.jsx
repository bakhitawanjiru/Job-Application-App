import { useState, useEffect } from "react";
import { useAuth } from "./Auth";
import { collection, query, addDoc, getDocs, where ,doc, getDoc  } from "firebase/firestore";
import { db } from "../config/firebase";
import Sidebar from "./Sidebar";
import { MdLocationOn, MdAttachMoney } from "react-icons/md";
import { BsBriefcase } from "react-icons/bs";
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';

const JobSeeker = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [jobStatuses, setJobStatuses] = useState({});
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;


  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    fullName: "",
    email: currentUser?.email || "",
    phone: "",
    experience: "",
    skills: "",
    coverLetter: "",
  });
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, "jobs"));
        const querySnapshot = await getDocs(q);
        const jobsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const statusQuery = query(collection(db, "jobStatuses"));
      const statusSnapshot = await getDocs(statusQuery);
      const statuses = {};
      statusSnapshot.docs.forEach((doc) => {
        statuses[doc.data().jobId] = doc.data().status;
      });
      setJobStatuses(statuses);
      setJobs(jobsData);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, [currentUser]);
    
   
    

    const fetchApplications = async () => {
      try {
        const q = query(
          collection(db, "applications"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        setApplications(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      }
    };

    
    const handleApply = async (job) => {
      try {
       
        const hasApplied = applications.some(app => app.jobId === job.id);
        if (hasApplied) {
          setError("You have already applied for this job");
          return;
        }
    
        setSelectedJob(job);
        setIsApplicationModalOpen(true);
        setError(null);
      } catch (err) {
        console.error("Error handling application:", err);
        setError("Failed to process application");
      }
    };
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    try {

      const applicationQuery = query(
        collection(db, "applications"),
        where("jobId", "==", selectedJob.id),
        where("status", "==", "accepted")
      );
      
      const applicationSnapshot = await getDocs(applicationQuery);
      
      if (!applicationSnapshot.empty) {
        setError("Sorry, this position has just been filled");
        setIsApplicationModalOpen(false);
        return;
      }
  
      const applicationData = {
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        employerId: selectedJob.employerId,
        applicantId: currentUser.uid,
        applicantName: applicationForm.fullName,
        applicantEmail: applicationForm.email,
        phone: applicationForm.phone,
        experience: applicationForm.experience,
        skills: applicationForm.skills,
        coverLetter: applicationForm.coverLetter,
        status: "pending",
        appliedAt: new Date().toISOString()
      };
  
      await addDoc(collection(db, "applications"), applicationData);
      
     
      setApplications([...applications, { jobId: selectedJob.id }]);
      setIsApplicationModalOpen(false);
      setApplicationForm({
        fullName: "",
        email: "",
        phone: "",
        experience: "",
        skills: "",
        coverLetter: ""
      });
      setError(null);
    } catch (err) {
      console.error("Error submitting application:", err);
      setError("Failed to submit application");
    }
  };
  
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    category: "",
    type: "",
    salaryRange: "",
  });
  const handleSalaryRangeFilter = (salary, range) => {
    const salaryNum = parseInt(salary.replace(/[^0-9]/g, ""));
    switch (range) {
      case "0-30000":
        return salaryNum <= 30000;
      case "30000-60000":
        return salaryNum > 30000 && salaryNum <= 60000;
      case "60000-90000":
        return salaryNum > 60000 && salaryNum <= 90000;
      case "90000+":
        return salaryNum > 90000;
      default:
        return true;
    }
  };
  const handleViewDetails = async (job) => {
    try {
    
      if (job.company) {
        setSelectedJobDetails(job);
        setIsDetailsModalOpen(true);
        return;
      }
  
 
      const companyRef = doc(db, "public_companies", job.employerId);
      const companySnap = await getDoc(companyRef);
      const companyData = companySnap.exists() ? companySnap.data() : null;
  
      setSelectedJobDetails({
        ...job,
        company: companyData ? {
          name: companyData.name,
          location: companyData.location,
          description: companyData.description,
          industry: companyData.industry,
          size: companyData.size,
          website: companyData.website,
          founded: companyData.founded
        } : null
      });
      setIsDetailsModalOpen(true);
    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("Failed to load job details");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesLocation =
      !filters.location ||
      job.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesCategory =
      !filters.category || job.category === filters.category;
    const matchesType = !filters.type || job.type === filters.type;
    const matchesSalary =
      !filters.salaryRange ||
      handleSalaryRangeFilter(job.salary, filters.salaryRange);
      
    return (
      matchesSearch &&
      matchesLocation &&
      matchesCategory &&
      matchesType &&
      matchesSalary
    );
  });
  
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  
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
            jobId: doc.data().jobId
          }))
        );
      } catch (err) {
        console.error("Failed to fetch saved jobs:", err);
      }
    };
  
    fetchSavedJobs();
  }, [currentUser]);
  
  const handleSaveJob = async (job) => {
    try {
      const isJobSaved = savedJobs.some(saved => saved.jobId === job.id);
      
      if (isJobSaved) {
       
        const savedJobDoc = savedJobs.find(saved => saved.jobId === job.id);
        await deleteDoc(doc(db, "savedJobs", savedJobDoc.id));
        setSavedJobs(savedJobs.filter(saved => saved.jobId !== job.id));
      } else {
     
        const docRef = await addDoc(collection(db, "savedJobs"), {
          userId: currentUser.uid,
          jobId: job.id,
          savedAt: new Date().toISOString(),
          jobData: job 
        });
        setSavedJobs([...savedJobs, { id: docRef.id, jobId: job.id }]);
      }
    } catch (err) {
      console.error("Error saving job:", err);
      setError("Failed to save job");
    }
  };
 
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="flex">
        <Sidebar userType="jobseeker" />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-[#4682B4]">
                Available Jobs
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Welcome, {currentUser?.email}
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="mb-6 bg-white p-4 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Location..."
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                  />
                </div>

                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                >
                  <option value="">All Types</option>
                  <option value="full-time">full-time</option>
                  <option value="part-time">part-time</option>
                 
                </select>

                <select
                  value={filters.salaryRange}
                  onChange={(e) =>
                    setFilters({ ...filters, salaryRange: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                >
                  <option value="">All Salary Ranges</option>
                  <option value="0-30000">0-10000kssh</option>
                  <option value="30000-60000">20,000 - 60,000ksh</option>
                  <option value="60000-90000">60,000 - 90,000ksh</option>
                  <option value="90000+">90,000ksh+</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6">
            {loading ? (
  <div className="text-center">Loading...</div>
) : filteredJobs.length === 0 ? (
  <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
    No jobs match your search criteria
  </div>
) : (
 currentJobs.map((job)  => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {job.title}
                      </h2>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                        <BsBriefcase className="mr-1" />
                        {job.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <MdLocationOn className="mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <MdAttachMoney className="mr-1" />
                        {job.salary}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Requirements:
                      </h3>
                      <p className="text-sm text-gray-600">
                        {job.requirements}
                      </p>
                    </div>
                    <button
    onClick={() => handleViewDetails(job)}
    className="px-4 py-2 text-[#4682B4] border border-[#4682B4] rounded-md hover:bg-[#4682B4]/10"
  >
    View Details
  </button>
                    <button
    onClick={() => handleSaveJob(job)}
    className="flex items-center text-[#4682B4] hover:text-[#4682B4]/80"
  >
    {savedJobs.some(saved => saved.jobId === job.id) ? (
      <MdBookmark className="w-6 h-6" />
    ) : (
      <MdBookmarkBorder className="w-6 h-6" />
    )}
    <span className="ml-2">
      {savedJobs.some(saved => saved.jobId === job.id) ? 'Saved' : 'Save Job'}
    </span>
  </button>
  <button
      onClick={() => handleApply(job)}
      disabled={applications.some(app => app.jobId === job.id)}
      className="mt-4 w-full bg-[#4682B4] text-white px-4 py-2 rounded-md hover:bg-[#4682B4]/90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {applications.some(app => app.jobId === job.id)
        ? "Already Applied"
        : "Apply Now"}
    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {isApplicationModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Apply for {selectedJob.title}
              </h3>
              <form onSubmit= {handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={applicationForm.fullName}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        fullName: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={applicationForm.email}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        email: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={applicationForm.phone}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        phone: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    required
                  />
                </div>
                

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Experience
                  </label>
                  <textarea
                    value={applicationForm.experience}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        experience: e.target.value,
                      })
                    }
                    rows="3"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    placeholder="Describe your relevant experience..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cover Letter
                  </label>
                  <textarea
                    value={applicationForm.coverLetter}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        coverLetter: e.target.value,
                      })
                    }
                    rows="4"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    placeholder="Write a brief cover letter..."
                    required
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsApplicationModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4682B4] text-white rounded-md hover:bg-[#4682B4]/90"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
{isDetailsModalOpen && selectedJobDetails && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
      <div className="mt-3">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {selectedJobDetails.title}
          </h3>
          <button
            onClick={() => setIsDetailsModalOpen(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Company Information</h4>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Company:</span> {selectedJobDetails.company?.name || 'Not specified'}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Company Location:</span> {selectedJobDetails.company?.location || 'Not specified'}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">About Company:</span> {selectedJobDetails.company?.description || 'No description available'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center">
              <BsBriefcase className="mr-1" />
              {selectedJobDetails.type}
            </span>
            <span className="flex items-center">
              <MdLocationOn className="mr-1" />
              {selectedJobDetails.location}
            </span>
            <span className="flex items-center">
              <MdAttachMoney className="mr-1" />
              {selectedJobDetails.salary}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700">Description</h4>
            <p className="mt-1 text-sm text-gray-600">{selectedJobDetails.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700">Requirements</h4>
            <p className="mt-1 text-sm text-gray-600">{selectedJobDetails.requirements}</p>
          </div>

        

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Close
            </button>
            <button
              onClick={() => {
                setIsDetailsModalOpen(false);
                handleApply(selectedJobDetails);
              }}
              disabled={applications.some((app) => app.jobId === selectedJobDetails.id)}
              className="px-4 py-2 bg-[#4682B4] text-white rounded-md hover:bg-[#4682B4]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applications.some((app) => app.jobId === selectedJobDetails.id)
                ? "Already Applied"
                : "Apply Now"}
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

export default JobSeeker;
