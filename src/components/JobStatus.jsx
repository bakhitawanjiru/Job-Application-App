import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './Auth';

const JobStatus = ({ jobId }) => {
  const [status, setStatus] = useState('active');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const statusRef = doc(db, "jobStatuses", jobId);
        const statusDoc = await getDoc(statusRef);
        if (statusDoc.exists()) {
          setStatus(statusDoc.data().status);
        }
      } catch (err) {
        console.error("Error fetching status:", err);
      }
    };

    fetchStatus();
  }, [jobId]);

  const handleStatusChange = async (newStatus) => {
    try {
      const statusRef = doc(db, "jobStatuses", jobId);
      await setDoc(statusRef, {
        jobId,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.uid
      });
      setStatus(newStatus);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Status:</span>
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="px-2 py-1 text-sm border rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
};

export default JobStatus;