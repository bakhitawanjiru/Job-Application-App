import { useState, useEffect } from 'react';
import { useAuth } from './Auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '/config/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Sidebar from './Sidebar';
import { MdCloudUpload } from 'react-icons/md';

const Profile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    email: currentUser?.email || '',
    skills: '',
    experience: '',
    education: '',
    resumeUrl: ''
  });
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile(prev => ({
            ...prev,
            ...docSnap.data()
          }));
        }
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let resumeUrl = profile.resumeUrl;

      if (resumeFile) {
        const storage = getStorage();
        const resumeRef = ref(storage, `resumes/${currentUser.uid}/${resumeFile.name}`);
        await uploadBytes(resumeRef, resumeFile);
        resumeUrl = await getDownloadURL(resumeRef);
      }

      await updateDoc(doc(db, 'users', currentUser.uid), {
        ...profile,
        resumeUrl,
        updatedAt: new Date().toISOString()
      });

      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4682B4]/10 to-[#4682B4]/30">
      <div className="flex">
        <Sidebar userType="jobseeker" />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-[#4682B4] mb-8">My Profile</h1>
            
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills</label>
                  <textarea
                    name="skills"
                    value={profile.skills}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    rows="3"
                    placeholder="Enter your skills (e.g., JavaScript, React, Node.js)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <textarea
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    rows="4"
                    placeholder="Describe your work experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Education</label>
                  <textarea
                    name="education"
                    value={profile.education}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4682B4] focus:border-[#4682B4]"
                    rows="3"
                    placeholder="List your educational background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Resume</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-[#4682B4] transition-colors"
                    >
                      <MdCloudUpload className="text-2xl text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        {resumeFile ? resumeFile.name : 'Upload Resume'}
                      </span>
                    </label>
                  </div>
                  {profile.resumeUrl && !resumeFile && (
                    <p className="mt-2 text-sm text-gray-500">
                      Current resume: <a href={profile.resumeUrl} className="text-[#4682B4] hover:underline" target="_blank" rel="noopener noreferrer">View</a>
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#4682B4] text-white px-4 py-2 rounded-md hover:bg-[#4682B4]/90 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;